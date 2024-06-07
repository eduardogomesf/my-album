'use client'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

import { getAlbums } from '@/app/api/get-albums'

import { AlbumCard } from './album-card'
import { AlbumCardSkeleton } from './album-card-skeleton'
import { NewAlbumModal } from './new-album-modal'

export default function Home() {
  const { data: albums, isLoading } = useQuery({
    queryFn: async () => await getAlbums(),
    queryKey: ['albums'],
    staleTime: 1000 * 60 * 60 * 1, // 1 hours
  })

  return (
    <main className="m-auto min-h-screen w-full max-w-[1664px] px-8 py-6">
      <section className="h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Albums</h2>

          <div className="flex items-end gap-4">
            <NewAlbumModal>
              <button className="flex items-center gap-1 rounded-md border bg-gray-700 px-2 py-1 text-gray-50 hover:bg-gray-800 transition duration-150 ease-in-out">
                New album
              </button>
            </NewAlbumModal>
          </div>
        </div>

        <div
          className={clsx(
            'mt-4 grid h-full grid-cols-1 justify-between gap-6 md:grid-cols-5',
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
          ) : albums && albums.length > 0 ? (
            albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))
          ) : (
            <p className="text-center text-gray-500">No albums found</p>
          )}
        </div>
      </section>
    </main>
  )
}
