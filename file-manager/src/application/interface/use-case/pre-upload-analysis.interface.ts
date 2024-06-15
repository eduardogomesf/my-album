export interface FileMetadata {
  id: string
  originalName: string
  size: number
  mimetype: string
  encoding: string
  hash: string
}

export interface PreUploadAnalysisUseCaseParams {
  files: FileMetadata[]
  albumId: string
  userId: string
}

export interface AllowedFile {
  id: string
  uploadUrl: string
  fileId: string
  fields: Record<string, string>
}

export interface NotAllowedFile {
  id: string
  reason: string
}

export interface PreUploadAnalysisUseCaseResponse {
  allowed: AllowedFile[]
  notAllowedDueToExtension: NotAllowedFile[]
  notAllowedDueToSize: NotAllowedFile[]
  notAllowedDueToAvailableStorage: NotAllowedFile[]
}
