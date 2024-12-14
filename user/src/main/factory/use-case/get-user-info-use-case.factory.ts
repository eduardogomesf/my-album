import { type FindUserByIdRepository } from '@/application/protocol'
import { GetUserInfoUseCase } from '@/application/use-case'

export const generateGetUserInfoUseCase = (
  findUserByIdRepository: FindUserByIdRepository,
) => {
  return new GetUserInfoUseCase(findUserByIdRepository)
}
