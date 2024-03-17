export const HTTP_CODES = {
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized'
  },
  FORBIDDEN: {
    code: 403,
    message: 'Forbidden'
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error'
  },
  CREATED: {
    code: 201,
    message: 'Created'
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Bad Request'
  }
} as const
