import clsx from "clsx"

import { Album } from "@/app/api/get-albums"
import { AlbumCard } from "./album-card"
import { AlbumCardSkeleton } from "./album-card-skeleton"

interface AlbumsGridProps {
  albums: Album[]
  isLoading: boolean
}

export function AlbumsGrid({ isLoading, albums }: AlbumsGridProps) {

  if (albums && albums.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center my-32">
        <p className="text-center text-gray-600 text-lg">No albums found</p>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'mt-4 h-auto grid grid-cols-1 gap-6 md:grid-cols-5 auto-rows-auto',
        albums &&
        albums.length === 0 &&
        !isLoading &&
        'mt-[150px] md:grid-cols-1',
      )}
    >
      {isLoading ? (
        Array.from({ length: 5 }).map((_: unknown, index: number) => (
          <AlbumCardSkeleton key={index} />
        ))
      ) : (
        albums.map((album: any) => (
          <AlbumCard key={album.id} album={album} />
        ))
      )}
    </div>
  )
}