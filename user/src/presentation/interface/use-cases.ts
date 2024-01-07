import { type UserLoginUseCase, type CreateNewUserUseCase } from '../../application/use-case'

export interface UseCases {
  createNewUser: CreateNewUserUseCase
  userLogin: UserLoginUseCase
}
