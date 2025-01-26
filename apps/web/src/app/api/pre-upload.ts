import { api } from '../lib/axios'

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

export interface FileAfterAnalysis {
  id: string
  allowed: boolean
  reason?: string
  uploadUrl?: string
  fileId?: string
  fields?: Record<string, string>
}

export type PreUploadAnalysisUseCaseResponse = FileAfterAnalysis[]

export async function preUpload(
  payload: PreUploadPayload,
): Promise<PreUploadAnalysisUseCaseResponse> {
  const response = await api.post(
    '/file-management/api/v1/files/pre-upload',
    payload,
  )

  return response.data
}
