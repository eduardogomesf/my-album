import clsx from 'clsx'

import { Album } from '@/app/api/get-albums'

import { AlbumCard } from './album-card'
import { AlbumCardSkeleton } from './album-card-skeleton'

interface AlbumsGridProps {
  albums: Album[]
  isLoading: boolean
  isDeletedAlbum?: boolean
}

export function AlbumsGrid({
  isLoading,
  albums,
  isDeletedAlbum = false,
}: AlbumsGridProps) {
  if (albums && albums.length === 0 && !isLoading) {
    return (
      <div className="my-32 flex items-center justify-center">
        <p className="text-center text-lg text-gray-600">No albums found</p>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'mt-4 grid h-auto auto-rows-auto grid-cols-1 gap-6 md:grid-cols-5',
        albums &&
          albums.length === 0 &&
          !isLoading &&
          'mt-[150px] md:grid-cols-1',
      )}
    >
      {isLoading
        ? Array.from({ length: 5 }).map((_: unknown, index: number) => (
            <AlbumCardSkeleton key={index} />
          ))
        : albums.map((album: Album) => (
            <AlbumCard
              key={album.id}
              album={album}
              isDeletedAlbum={isDeletedAlbum}
            />
          ))}
    </div>
  )
}
