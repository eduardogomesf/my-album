import { api } from "../lib/axios"

export interface FileMetadata {
  id: string
  originalName: string
  size: number
  mimetype: string
}

export interface PreUploadPayload {
  files: FileMetadata[]
  albumId: string
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

export async function preUpload(payload: PreUploadPayload): Promise<PreUploadAnalysisUseCaseResponse> {
  const response = await api.post('/files/pre-upload', payload)

  return response.data
}