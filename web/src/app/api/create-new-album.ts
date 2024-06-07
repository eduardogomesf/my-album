import { api } from '../lib/axios'

type CreateNewAlbum = {
  name: string
}

export async function createNewAlbum(payload: CreateNewAlbum) {
  return await api.post('/albums', payload)
}
