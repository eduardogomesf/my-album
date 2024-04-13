export const ERROR_MESSAGES = {
  USER: {
    NOT_FOUND: 'User not found'
  },
  ALBUM: {
    ALREADY_EXISTS: 'Album already exists',
    SHOULD_BE_DELETED: 'There is an album with the same name that should be deleted first. Please check the deleted albums.',
    NOT_FOUND: 'Album not found',
    SOURCE_ALBUM_NOT_FOUND: 'Source album not found',
    DESTINATION_ALBUM_NOT_FOUND: 'Destination album not found'
  }
} as const
