import { type Request, type Response } from 'express'
import { type CreateNewCustomerUseCase } from '../../../application/use-case'
import { MissingFieldsHelper } from '../helper/missing-fields.helper'

export class CustomerController {
  constructor(
    private readonly createNewCustomerUseCase: CreateNewCustomerUseCase
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

      await this.createNewCustomerUseCase.create({
        firstName, lastName, email, password, cellphone
      })

      return response.status(201).send()
    } catch (error) {
      console.error('Error creating customer')
      console.error(error)
      return response.status(500).send()
    }
  }
}
