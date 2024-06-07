import { useRouter } from 'next/navigation'
import { ImageSquare, Trash } from 'phosphor-react'

import { Album } from '@/app/api/get-albums'
import { formatDate } from '@/app/util/date'

export interface AlbumCardProps {
  album: Album
}

export function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter()

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

  return (
    <div className="group h-40 w-full max-w-[300px] cursor-pointer rounded-md bg-gray-300">
      <button
        className="flex h-5/6 w-full items-center justify-center rounded-t-lg bg-gray-200"
        onClick={handleRedirect}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
          <ImageSquare className="h-6 w-6" />
        </div>
      </button>

      <div className="relative flex flex-col items-start gap-1 rounded-b-lg bg-gray-50 p-3">
        <button
          className="absolute right-3 top-3 hidden transition duration-500 ease-in-out group-hover:block"
          onClick={() => {}}
        >
          <Trash className="h-6 w-6" />
        </button>

        <span className="text-lg font-bold">{album.name}</span>
        <span className="text-sm text-gray-500">{formatMediaCounts()}</span>
        <span className="text-sm text-gray-500">{formattedUpdatedAt}</span>
      </div>
    </div>
  )
}
