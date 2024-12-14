import { HTTP_CODES } from '../constant'

interface ExpectedErrors {
  message: string
  httpCode: number
}

interface MappedError {
  message: string
  httpCode: number
}

export const convertErrorToHttpError = (
  mappedHttpErrors: ExpectedErrors[],
  errorMessage: string | undefined,
): MappedError => {
  const mappedError = mappedHttpErrors.find(
    (error) => error.message === errorMessage,
  )

  if (mappedError) {
    return {
      message: errorMessage ?? HTTP_CODES.BAD_REQUEST.message,
      httpCode: mappedError.httpCode,
    }
  }

  return {
    message: errorMessage ?? HTTP_CODES.BAD_REQUEST.message,
    httpCode: 400,
  }
}
