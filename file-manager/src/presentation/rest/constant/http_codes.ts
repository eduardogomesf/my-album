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
  },
  OK: {
    code: 200,
    message: 'OK'
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found'
  }
} as const
