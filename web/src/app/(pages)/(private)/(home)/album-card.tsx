import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowClockwise, Image as ImageIcon, Trash } from 'phosphor-react'
import { toast } from 'sonner'

import { deleteAlbum } from '@/app/api/delete-album'
import { Album } from '@/app/api/get-albums'
import { restoreAlbum } from '@/app/api/restore-album'
import { ConfirmActionModal } from '@/app/components/confirm-action-modal'
import { SOMETHING_WENT_WRONG } from '@/app/constants/error'
import { formatDate } from '@/app/util/date'
import Image from 'next/image'

export interface AlbumCardProps {
  album: Album
  isDeletedAlbum?: boolean
}

export function AlbumCard({ album, isDeletedAlbum = false }: AlbumCardProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const hasFiles = album.numberOfPhotos || album.numberOfVideos

  const { mutateAsync: deleteCurrentAlbum } = useMutation({
    mutationFn: deleteAlbum,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['albums'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['deleted-albums'],
        }),
      ])
    },
  })

  const { mutateAsync: restoreCurrentAlbum } = useMutation({
    mutationFn: restoreAlbum,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['albums'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['deleted-albums'],
        }),
      ])
    },
  })

  function formatMediaCounts() {
    if (album.numberOfPhotos && album.numberOfVideos) {
      return `${album.numberOfPhotos} photos, ${album.numberOfVideos} videos`
    } else if (album.numberOfPhotos) {
      return `${album.numberOfPhotos} photos`
    } else if (album.numberOfVideos) {
      return `${album.numberOfVideos} videos`
    } else {
      return 'No media found'
    }
  }

  const formattedUpdatedAt = album.updatedAt ? formatDate(album.updatedAt) : ''

  function handleRedirect() {
    return router.push(`/albums/${album.id}`)
  }

  async function handleDelete() {
    try {
      await deleteCurrentAlbum({ albumId: album.id })

      const successMessage = isDeletedAlbum
        ? 'Album deleted successfully!'
        : 'Album moved to trash successfully!'

      toast.success(successMessage)
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error('Album not found. Please refresh the page.')
        } else {
          toast.error(SOMETHING_WENT_WRONG)
        }
      } else {
        toast.error(SOMETHING_WENT_WRONG)
      }
    }
  }

  async function handleRestore() {
    try {
      await restoreCurrentAlbum({ albumId: album.id })

      toast.success('Album restored successfully!')
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error('Album not found. Please refresh the page.')
        } else {
          toast.error(SOMETHING_WENT_WRONG)
        }
      } else {
        toast.error(SOMETHING_WENT_WRONG)
      }
    }
  }

  return (
    <div className="flex h-60 w-full max-w-[300px] cursor-pointer flex-col rounded-md bg-gray-300">
      {album.coverUrl ? (
        <button
          className="relative w-[300px] h-[140] flex flex-1 items-center justify-center rounded-t-lg transition duration-150 ease-in-out hover:bg-gray-300"
          onClick={handleRedirect}
        >
          <Image
            alt='Album cover'
            src={album.coverUrl}
            className='rounded-t-lg'
            fill={true}
            style={{ objectFit: 'cover' }}
            priority
          />
        </button>
      ) : (
        <button
          className="flex w-full flex-1 items-center justify-center rounded-t-lg bg-gray-200 transition duration-150 ease-in-out hover:bg-gray-300"
          onClick={handleRedirect}
        >
          <ImageIcon
            className="h-10 w-10 text-gray-800"
            alt="Album card background"
          />
        </button>
      )
      }

      <div className="group relative flex flex-col items-start gap-1 rounded-b-lg bg-gray-50 p-3">
        <div className="absolute right-3 top-3 flex items-center gap-3">
          {isDeletedAlbum && (
            <ConfirmActionModal
              title={'Restore album'}
              description={`Are you sure you want to restore "${album.name}"?`}
              onConfirm={handleRestore}
            >
              <button>
                <ArrowClockwise className="hidden h-6 w-6 animate-fade-in-down text-gray-700 transition duration-300 hover:text-gray-800 group-hover:block" />
              </button>
            </ConfirmActionModal>
          )}

          <ConfirmActionModal
            title={
              isDeletedAlbum || !hasFiles
                ? 'Delete album'
                : 'Move album to Trash'
            }
            description={
              isDeletedAlbum || !hasFiles
                ? `Are you sure you want to permanently delete "${album.name}"? This action can not be undone."`
                : `Are you sure you want to move "${album.name}" to the trash?`
            }
            additionalNote={
              !isDeletedAlbum && !hasFiles
                ? 'This album will be permanently deleted since it does not have any media files'
                : ''
            }
            onConfirm={handleDelete}
          >
            <button>
              <Trash className="hidden h-6 w-6 animate-fade-in-down text-gray-700 transition duration-300 hover:text-gray-800 group-hover:block" />
            </button>
          </ConfirmActionModal>
        </div>

        <span className="text-lg font-bold">{album.name}</span>
        <span className="text-sm text-gray-500">{formatMediaCounts()}</span>
        <span className="text-sm text-gray-500">{formattedUpdatedAt}</span>
      </div>
    </div >
  )
}
