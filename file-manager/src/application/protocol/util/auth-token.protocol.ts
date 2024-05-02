export interface TokenValidatorResponse {
  isValid: boolean
  invalidationReason?: 'EXPIRED' | 'INVALID' | 'OTHER'
  data?: any
}

export interface TokenValidator {
  validate: (token: string) => TokenValidatorResponse
}
