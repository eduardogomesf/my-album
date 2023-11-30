import { type Request, type Response } from 'express'
import { type CustomerLoginUseCase, type CreateNewCustomerUseCase } from '@/application/use-case'
import { MissingFieldsHelper } from '../helper/missing-fields.helper'

export class CustomerController {
  constructor(
    private readonly createNewCustomerUseCase: CreateNewCustomerUseCase,
    private readonly customerLoginUseCase: CustomerLoginUseCase
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['firstName', 'lastName', 'email', 'password', 'cellphone'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { firstName, lastName, email, password, cellphone } = request.body

      const createCustomerResult = await this.createNewCustomerUseCase.create({
        firstName, lastName, email, password, cellphone
      })

      if (!createCustomerResult.ok) {
        return response.status(400).json({
          message: createCustomerResult.message
        })
      }

      return response.status(201).send()
    } catch (error) {
      console.error('Error creating customer')
      console.error(error)
      return response.status(500).send()
    }
  }

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
        ['email', 'password'],
        request.body
      )

      if (missingFieldsValidation.isMissing) {
        return response.status(400).json({
          message: `Missing fields: ${missingFieldsValidation.missingFields.join(', ')}`
        })
      }

      const { email, password } = request.body

      const loginResult = await this.customerLoginUseCase.login({
        email, password
      })

      if (!loginResult.ok) {
        if (loginResult.message && loginResult.message.includes('given credentials')) {
          return response.status(401).json({
            message: loginResult.message
          })
        }

        return response.status(400).json({
          message: loginResult.message
        })
      }

      const responseBody = {
        token: loginResult?.data.token
      }

      return response.status(200).json(responseBody)
    } catch (error) {
      console.error('Error creating customer')
      console.error(error)
      return response.status(500).send()
    }
  }
}
