import { api } from "../lib/axios"

interface GetAlbumFilesParams {
  albumId: string
  page: number
  limit: number
}

export interface File {
  id: string,
  name: string,
  size: number,
  encoding: string,
  type: "image" | "video",
  extension: string,
  albumId: string,
  url: string,
  updatedAt: string
}

export interface FilesAndCounts {
  files: File[]
  limit: number
  page: number
  total: number
  totalOfPages: number
}

export async function getAlbumFiles(params: GetAlbumFilesParams): Promise<FilesAndCounts> {
  const response = await api.get(`/albums/${params.albumId}/files`, {
    params: {
      page: params.page ?? 0,
      limit: params.limit ?? 10
    }
  })

  return response.data
}