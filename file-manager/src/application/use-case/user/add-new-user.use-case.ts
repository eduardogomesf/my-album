import { User } from '@/domain/entity'
import { type UseCase, type UseCaseResponse } from '../../interface'
import { type CreateUserRepository, type GetUserByEmailRepository } from '../../protocol'

interface AddNewUserDTO {
  id?: string
  firstName: string
  lastName: string
  email: string
}

export class AddNewUserUseCase implements UseCase {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async execute(userDto: AddNewUserDTO): Promise<UseCaseResponse> {
    const userAlreadyExists = await this.getUserByEmailRepository.getByEmail(userDto.email)

    if (userAlreadyExists) {
      return {
        data: userAlreadyExists,
        ok: true,
        message: 'User already exists'
      }
    }

    const user = new User({
      id: userDto.id,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: userDto.email
    })

    await this.createUserRepository.create(user)

    return {
      data: user,
      ok: true,
      message: 'User created successfully'
    }
  }
}
