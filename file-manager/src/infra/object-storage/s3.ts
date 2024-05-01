import {
  type SaveFileStorageServiceDTO,
  type SaveFileStorageService,
  type GetFileUrlService
} from '@/application/protocol'
import {
  PutObjectCommand,
  S3Client,
  type StorageClass,
  CreateBucketCommand,
  GetObjectCommand,
  type GetObjectCommandInput
} from '@aws-sdk/client-s3'
import { type File } from '@/domain/entity'
import { ENVS } from '@/shared'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class S3FileStorage implements SaveFileStorageService, GetFileUrlService {
  private readonly client: S3Client

  constructor() {
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

  async save(params: SaveFileStorageServiceDTO): Promise<null> {
    await this.client.send(new CreateBucketCommand({ Bucket: ENVS.S3.BUCKET_NAME }))

    const key = `${params.userId}/${params.fileId}`

    const command = new PutObjectCommand({
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: key,
      Body: params.content,
      ContentType: params.type,
      ContentEncoding: params.encoding,
      ACL: 'private',
      StorageClass: ENVS.S3.STORAGE_CLASS as StorageClass
    })

    await this.client.send(command)

    return null
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
}
