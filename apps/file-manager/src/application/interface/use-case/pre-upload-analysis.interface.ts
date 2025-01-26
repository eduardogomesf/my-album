export interface FileMetadata {
  id: string
  originalName: string
  size: number
  mimetype: string
}

export interface PreUploadAnalysisUseCaseParams {
  files: FileMetadata[]
  albumId: string
  userId: string
}

export interface FileAfterAnalysis {
  id: string
  allowed: boolean
  reason?: string
  uploadUrl?: string
  fileId?: string
  fields?: Record<string, string>
}
export type PreUploadAnalysisUseCaseResponse = FileAfterAnalysis[]
