import { ERROR_MESSAGES } from '../constant'
import { type UseCaseResponse, type UseCase } from '../interface'
import { type FindUserByIdRepository } from '../protocol'

export interface GetUserInfoUseCaseParams {
  userId: string
}

export interface GetUserInfoUseCaseResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export class GetUserInfoUseCase implements UseCase {
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
  ) {}

  async execute(
    params: GetUserInfoUseCaseParams,
  ): Promise<UseCaseResponse<GetUserInfoUseCaseResponse>> {
    const user = await this.findUserByIdRepository.findById(params.userId)

    if (!user) {
      return {
        ok: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      }
    }

    const response: GetUserInfoUseCaseResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.cellphone,
    }

    return {
      ok: true,
      data: response,
    }
  }
}
