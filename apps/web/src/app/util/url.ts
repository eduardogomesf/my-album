export const handleFileUrl = (url: string) => {
  const isLocalBackend = process.env.NEXT_PUBLIC_LOCAL_BACKEND === 'TRUE'

  if (isLocalBackend) {
    return url.replace('//s3', '//localhost')
  }

  return url
}
