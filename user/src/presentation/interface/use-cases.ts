import { type UserLoginUseCase, type CreateNewUserUseCase, type RefreshTokenUseCase } from '../../application/use-case'

export interface UseCases {
  createNewUser: CreateNewUserUseCase
  userLogin: UserLoginUseCase
  refreshToken: RefreshTokenUseCase
}
