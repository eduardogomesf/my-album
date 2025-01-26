/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '<rootDir>/src/main',
    '<rootDir>/src/infra',
    '<rootDir>/src/shared',
    '<rootDir>/src/presentation',
    '<rootDir>/src/application/interface',
    '<rootDir>/src/application/protocol'
  ]
}
