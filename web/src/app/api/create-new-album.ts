import { api } from '../lib/axios'

type CreateNewAlbum = {
  name: string
}

export async function createNewAlbum(payload: CreateNewAlbum) {
  return await api.post('/file-management/api/v1/albums', payload)
}
