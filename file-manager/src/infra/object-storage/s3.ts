import {
  S3Client,
  GetObjectCommand,
  type GetObjectCommandInput,
  DeleteObjectCommand,
  PutObjectCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import {
  type GetFileUrlService,
  type DeleteFileFromStorageService,
  type GenerateUploadUrlService,
  type GenerateUploadUrlServiceDTO
} from '@/application/protocol'
import { type File } from '@/domain/entity'
import { ENVS } from '@/shared'
import {
  type DeleteOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type UpdateOneByIdOutboxRepository
} from './interface'
import { OutboxType } from '@prisma/client'

export class S3FileStorage implements GetFileUrlService, DeleteFileFromStorageService, GenerateUploadUrlService {
  private readonly client: S3Client

  constructor(
    private readonly updateOneByIdOutboxRepository: UpdateOneByIdOutboxRepository,
    private readonly getOneByAggregateIdAndTypeOutboxRepository: GetOneByAggregateIdAndTypeOutboxRepository,
    private readonly deleteOneByIdOutboxRepository: DeleteOneByIdOutboxRepository
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

  async generateUploadUrl (params: GenerateUploadUrlServiceDTO): Promise<string> {
    await this.client.send(new CreateBucketCommand({ Bucket: ENVS.S3.BUCKET_NAME }))

    const expiration = 60 * ENVS.S3.UPLOAD_URL_EXPIRATION_IN_MINUTES

    const payload = new PutObjectCommand({
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: `${params.userId}/${params.id}`,
      ContentType: params.mimetype,
      ContentLength: params.size,
      ContentEncoding: params.encoding,
      ACL: 'private'

    })

    const url = await getSignedUrl(
      this.client,
      payload,
      { expiresIn: expiration }
    )

    return url
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

  async delete (file: File, userId: string): Promise<boolean> {
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
}
