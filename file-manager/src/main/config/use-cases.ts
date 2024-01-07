import { type UseCases } from '@/presentation/interface/injections'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  return {
    addNewUserUseCase: null
  } as any
}
