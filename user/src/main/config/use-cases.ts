import { type UseCases } from '@/presentation/interface/use-cases'
import { generateCreateNewUserUseCase, generateUserLoginUseCase } from '../factory/use-case'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  return {
    createNewUser: await generateCreateNewUserUseCase(),
    userLogin: generateUserLoginUseCase()
  }
}
