export class MissingFieldsHelper {
  static hasMissingFields(
    fields: string[],
    payload: Record<string, unknown> | any
  ): { isMissing: boolean, missingFields: string[], message: string } {
    const missingFields: string[] = []

    fields.forEach(field => {
      const value = payload[field]
      if (value === null || value === undefined || value === '') {
        missingFields.push(field)
      }
    })

    return {
      isMissing: missingFields.length > 0,
      missingFields,
      message: `fields ${missingFields.join(', ')} can not be empty`
    }
  }
}
