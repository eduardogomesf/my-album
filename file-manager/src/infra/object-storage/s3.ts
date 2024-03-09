import { type SaveFileStorageServiceDTO, type SaveFileStorageService } from '@/application/protocol/files'
import { type ObjectCannedACL, PutObjectCommand, S3Client, type StorageClass } from '@aws-sdk/client-s3'
import { ENVS } from '@/shared'

export class S3FileStorage implements SaveFileStorageService {
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

  async save (params: SaveFileStorageServiceDTO): Promise<{ url: string }> {
    const key = `${params.userId}/${params.name}`

    const command = new PutObjectCommand({
      Bucket: ENVS.S3.BUCKET_NAME,
      Key: key,
      Body: params.content,
      ContentType: params.type,
      ContentEncoding: params.encoding,
      ACL: ENVS.S3.DEFAULT_ACL as ObjectCannedACL,
      StorageClass: ENVS.S3.STORAGE_CLASS as StorageClass
    })

    await this.client.send(command)

    return {
      url: `${ENVS.S3.URL}/${ENVS.S3.BUCKET_NAME}/${key}`
    }
  }
}
