export class PrismaQueryHelper {
  static getPagination(page: number, limit: number): { limit: number, offset: number } {
    return {
      limit,
      offset: (page - 1) * limit
    }
  }

  static formatInParam(values: string[] | number[]): string {
    return values.join(', ')
  }
}
