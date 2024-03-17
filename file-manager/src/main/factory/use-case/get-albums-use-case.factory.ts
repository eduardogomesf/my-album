import { type GetAlbumsRepository } from '@/application/protocol'
import { GetAlbumsUseCase } from '@/application/use-case'

export const generateGetAlbumsUseCase = (
  getAlbumsRepository: GetAlbumsRepository
) => {
  return new GetAlbumsUseCase(getAlbumsRepository)
}
