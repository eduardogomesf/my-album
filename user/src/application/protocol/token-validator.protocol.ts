export interface TokenValidatorResponse {
  isValid: boolean
  invalidationReason: 'EXPIRED' | 'INVALID' | 'OTHER'
}

export interface TokenValidator {
  validate: (token: string) => Promise<TokenValidatorResponse>
}
