export function getFileExtension(filename: string): string | null {
  const regex = /\.([0-9a-z]+)(?:[?#]|$)/i
  const matches = filename.match(regex)
  return matches ? matches[1] : null
}
