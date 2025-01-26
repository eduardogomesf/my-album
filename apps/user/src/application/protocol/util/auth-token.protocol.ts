export interface TokenValidatorResponse {
  isValid: boolean
  invalidationReason?: 'EXPIRED' | 'INVALID' | 'OTHER'
  data?: any
}

export interface TokenValidator {
  validate: (token: string) => Promise<TokenValidatorResponse>
}

export interface TokenGenerator {
  generate: (payload: any) => Promise<string>
}
