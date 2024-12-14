import { getFileExtension } from '@/application/helper'

describe('Get File Extension Helper', () => {
  it('should get the file extension as pdf', () => {
    const extesion = getFileExtension('my-personal-project.pdf')
    expect(extesion).toBe('pdf')
  })

  it('should get the file extension as jpg', () => {
    const extesion = getFileExtension('animals.jpg')
    expect(extesion).toBe('jpg')
  })

  it('should get the file extension as mp4', () => {
    const extesion = getFileExtension('family.mp4')
    expect(extesion).toBe('mp4')
  })
})
