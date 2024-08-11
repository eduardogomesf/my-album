import { isValidFileExtension } from '@/application/helper'

jest.mock('@/shared/env.ts', () => {
  return {
    ENVS: {
      FILE_CONFIGS: {
        ALLOWED_EXTENSIONS: ['jpg', 'mp4']
      }
    }
  }
})

describe('Is Valid File Extension Helper', () => {

  it('should get file extesion as valid for jpg', () => {
    const isValidExtesion = isValidFileExtension('jpg')
    expect(isValidExtesion).toBe(true)
  })

  it('should get file extesion as valid for mp4', () => {
    const isValidExtesion = isValidFileExtension('mp4')
    expect(isValidExtesion).toBe(true)
  })

  it('should get file extesion as NOT valid for mp3', () => {
    const isValidExtesion = isValidFileExtension('mp3')
    expect(isValidExtesion).toBe(false)
  })
})