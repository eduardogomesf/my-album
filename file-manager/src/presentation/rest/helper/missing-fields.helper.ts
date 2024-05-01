export interface HasMissingFieldsResponse {
  isMissing: boolean
  missingFields: string[]
  missingFieldsMessage: string
}

export class MissingFieldsHelper {
  static hasMissingFields(
    fields: string[],
    payload: Record<string, unknown>
  ): HasMissingFieldsResponse {
    const missingFields: string[] = []

    fields.forEach(field => {
      const value = payload[field]
      if (!value) {
        missingFields.push(field)
      }
    })

    return {
      isMissing: missingFields.length > 0,
      missingFields,
      missingFieldsMessage: `Missing fields: ${missingFields.join(', ')}`
    }
  }
}
