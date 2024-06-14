export interface FileMetadata {
  id: string
  originalName: string
  size: number
  mimetype: string
  encoding: string
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
