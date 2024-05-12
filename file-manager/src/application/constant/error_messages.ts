export const ERROR_MESSAGES = {
  USER: {
    NOT_FOUND: 'User not found'
  },
  ALBUM: {
    ALREADY_EXISTS: 'Album already exists',
    NOT_FOUND: 'Album not found',
    DELETED_ALBUM_WITH_SAME_NAME: 'Please delete the album with the same name first',
    DELETED_PLEASE_RESTORE: 'Album is deleted. Please restore it first',
    MOVE_TO_DELETED_ALBUM: 'Cannot move files to a deleted album',
    NOT_DELETED: 'Album is not deleted'
  },
  PERMISSION: {
    NOT_ALLOWED: 'You do not have permission to perform this action'
  },
  FILE: {
    NOT_FOUND: 'File not found',
    INVALID_EXTENSION: 'Invalid extension'
  }
} as const
