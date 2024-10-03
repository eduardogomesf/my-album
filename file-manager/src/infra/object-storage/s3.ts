import {
  S3Client,
  GetObjectCommand,
  type GetObjectCommandInput,
  DeleteObjectCommand,
  CreateBucketCommand,
  PutBucketCorsCommand,
  type GetObjectCommandOutput,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { type PresignedPostOptions, createPresignedPost } from '@aws-sdk/s3-presigned-post'

import {
  type GetFileUrlService,
  type DeleteFileFromStorageService,
  type GenerateUploadUrlService,
  type GenerateUploadUrlServiceDTO,
  type GenerateUploadUrlServiceResponse,
  type GetFileStreamFromStorageService,
  DeleteFilesFromStorageService
} from '@/application/protocol'
import { type File } from '@/domain/entity'
import { ENVS, Logger } from '@/shared'
import {
  type GetManyByAggregateIdsAndTypeOutboxRepository,
  type DeleteOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type UpdateOneByIdOutboxRepository,
  type DeleteManyByIdsOutboxRepository,
  type UpdateManyByIdsOutboxRepository
} from './interface'
import { OutboxType } from '@prisma/client'
import { type Readable } from 'stream'

export class S3FileStorage 
implements GetFileUrlService, DeleteFileFromStorageService, 
GenerateUploadUrlService, GetFileStreamFromStorageService, DeleteFilesFromStorageService {
  private readonly logger = new Logger(S3FileStorage.name)
  private readonly client: S3Client

  constructor(
    private readonly updateOneByIdOutboxRepository: UpdateOneByIdOutboxRepository,
    private readonly getOneByAggregateIdAndTypeOutboxRepository: GetOneByAggregateIdAndTypeOutboxRepository,
    private readonly deleteOneByIdOutboxRepository: DeleteOneByIdOutboxRepository,
    private readonly getManyByAggregateIdsAndTypeOutboxRepository: GetManyByAggregateIdsAndTypeOutboxRepository,
    private readonly deleteManyByIdsOutboxRepository: DeleteManyByIdsOutboxRepository,
    private readonly updateManyByIdsOutboxRepository: UpdateManyByIdsOutboxRepository,
  ) {
    this.client = new S3Client({
      region: ENVS.S3.REGION,
      endpoint: ENVS.S3.URL,
      forcePathStyle: true,
      credentials: {
        accessKeyId: ENVS.S3.ACCESS_KEY_ID,
        secretAccessKey: ENVS.S3.SECRET_ACCESS_KEY
      }
    })
  }

  async generateUploadUrl (params: GenerateUploadUrlServiceDTO): Promise<GenerateUploadUrlServiceResponse> {
    await this.createBucket()

    const expiration = 60 * ENVS.S3.UPLOAD_URL_EXPIRATION_IN_MINUTES
    const key = `${params.userId}/${params.id}`

    const payload: PresignedPostOptions = {
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: key,
      Expires: expiration,
      Conditions: [
        ['content-length-range', params.size, params.size],
        ['starts-with', '$Content-Type', 'image/'],
        ['starts-with', '$Content-Type', 'video/'],
        ['eq', '$key', key]
      ]
    }

    const { url, fields } = await createPresignedPost(
      this.client,
      payload
    )

    return {
      url,
      fields
    }
  }

  async getFileUrl(file: File, userId: string): Promise<string> {
    const expiration = 60 * 60 * ENVS.S3.URL_EXPIRATION

    const payload: GetObjectCommandInput = {
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: `${userId}/${file.id}`
    }

    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand(payload),
      { expiresIn: expiration }
    )

    return url ?? ''
  }

  async delete(file: File, userId: string): Promise<boolean> {
    try {
      const key = `${userId}/${file.id}`

      let wasDeleted = false

      const outboxRecord = await this.getOneByAggregateIdAndTypeOutboxRepository.getByAggregateIdAndType(
        file.id,
        OutboxType.FILE_DELETED
      )

      if (!outboxRecord) {
        return wasDeleted
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: ENVS.S3.BUCKET_NAME,
        Key: key
      })

      this.client.send(deleteCommand)
        .then(async () => {
          await this.deleteOneByIdOutboxRepository.deleteOneById(outboxRecord.id)

          wasDeleted = true
        }).catch(async () => {
          if (outboxRecord.retryCount >= 10) {
            await this.deleteOneByIdOutboxRepository.deleteOneById(outboxRecord.id)

            wasDeleted = true
          } else {
            await this.updateOneByIdOutboxRepository.updateOneById({
              id: outboxRecord.id,
              retryCount: outboxRecord.retryCount + 1,
              lastAttemptedAt: new Date()
            })

            wasDeleted = false
          }
        })

      return wasDeleted
    } catch (error) {
      return false
    }
  }

  async deleteMany(filesIds: string[], userId: string): Promise<boolean> {
    try {
      const keys = filesIds.map(id => ({ Key: `${userId}/${id}` }))

      let wasDeleted = false

      const outboxRecords = await this.getManyByAggregateIdsAndTypeOutboxRepository.getManyByAggregateIdsAndType(
        filesIds,
        OutboxType.FILE_DELETED
      )

      if (!outboxRecords?.length) {
        return wasDeleted
      }

      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: ENVS.S3.BUCKET_NAME,
        Delete: {
          Objects: keys
        }
      })

      const recordsIds = outboxRecords.map(outbox => outbox.id)

      this.client.send(deleteObjectsCommand)
        .then(async () => {
          await this.deleteManyByIdsOutboxRepository.deleteManyByIds(recordsIds)

          wasDeleted = true
        }).catch(async (error) => {
          this.logger.error("Error deleting files: ", JSON.stringify({ 
            error: error.message, 
            filesIds
          }))

          await this.updateManyByIdsOutboxRepository.updateManyByIds({
            ids: recordsIds,
            lastAttemptedAt: new Date()
          })

          wasDeleted = false
        })

      return wasDeleted
    } catch (error) {
      return false
    }
  }

  async getFileStream (file: File, userId: string): Promise<Readable> {
    const key = `${userId}/${file.id}`
    const command = new GetObjectCommand({
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: key
    })
    const data: GetObjectCommandOutput = await this.client.send(command)
    const fileStream = data.Body as Readable
    return fileStream
  }

  private async createBucket(): Promise<void> {
    await this.client.send(new CreateBucketCommand({ Bucket: ENVS.S3.BUCKET_NAME }))

    await this.client.send(new PutBucketCorsCommand({
      Bucket: ENVS.S3.BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['PUT', 'POST', 'DELETE', 'GET', 'HEAD'],
            AllowedOrigins: ['*'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    }))
  }
}
