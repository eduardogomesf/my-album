import {
  type UserLoginUseCase,
  type CreateNewUserUseCase,
  type RefreshTokenUseCase,
  type GetUserInfoUseCase,
} from '@/application/use-case'

export interface UseCases {
  createNewUser: CreateNewUserUseCase
  userLogin: UserLoginUseCase
  refreshToken: RefreshTokenUseCase
  getUserInfoUseCase: GetUserInfoUseCase
}
