export class MissingFieldsHelper {
  static hasMissingFields(fields: string[], payload: Record<string, unknown>): { isMissing: boolean, missingFields: string[] } {
    const missingFields: string[] = []

    fields.forEach(field => {
      const value = payload[field]
      if (!value) {
        missingFields.push(field)
      }
    })

    return {
      isMissing: missingFields.length > 0,
      missingFields
    }
  }
}
