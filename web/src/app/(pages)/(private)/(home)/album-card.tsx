import { ImageSquare, Trash } from "phosphor-react";

import { Album } from "@/app/api/get-albums";
import { formatDate } from "@/app/util/date";
import { useRouter } from "next/navigation";

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

  const formattedUpdatedAt = album.updatedAt ? formatDate(album.updatedAt) : '';

  function handleRedirect() {
    return router.push(`/albums/${album.id}`)
  }

  return (
    <div
      className="bg-gray-300 h-40 w-full max-w-[300px] rounded-md group cursor-pointer"
    >
      <button
        className="w-full h-5/6 bg-gray-200 flex items-center justify-center rounded-t-lg"
        onClick={handleRedirect}
      >
        <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
          <ImageSquare className="h-6 w-6" />
        </div>
      </button>

      <div className="relative bg-gray-50 p-3 flex flex-col gap-1 rounded-b-lg items-start">
        <button
          className="hidden absolute top-3 right-3 group-hover:block duration-500 transition ease-in-out"
          onClick={() => {}}
        >
          <Trash className="h-6 w-6" />
        </button>

        <span className="text-lg font-bold">
          {album.name}
        </span>
        <span className="text-sm text-gray-500">
          {formatMediaCounts()}
        </span>
        <span className="text-sm text-gray-500">
          {formattedUpdatedAt}
        </span>
      </div>
    </div >
  )
}