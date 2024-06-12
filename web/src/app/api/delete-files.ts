import { api } from "../lib/axios";

interface DeleteFilesParams {
  filesIds: string[];
  albumId: string
}

export async function deleteFiles(params: DeleteFilesParams) {
  await api.post('/files/delete', {
    filesIds: params.filesIds,
    albumId: params.albumId
  })
}