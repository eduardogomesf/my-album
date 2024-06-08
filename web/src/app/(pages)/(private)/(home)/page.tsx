'use client'

import { useQuery } from '@tanstack/react-query'

import { getAlbums } from '@/app/api/get-albums'

import { NewAlbumModal } from './new-album-modal'
import { Button } from '@/app/components/button'
import { AlbumsGrid } from './albums-grid'

export default function Home() {
  const { data: albums = [], isLoading: isAlbumsLoading } = useQuery({
    queryFn: async () => await getAlbums(),
    queryKey: ['albums'],
    staleTime: 1000 * 60 * 60 * 1, // 1 hours
  })

  const { data: deletedAlbums = [], isLoading: isDeletedAlbumsLoading } = useQuery({
    queryFn: async () => await getAlbums(true),
    queryKey: ['deleted-albums'],
    staleTime: 1000 * 60 * 60 * 1, // 1 hours
  })

  return (
    <main className="m-auto w-full max-w-[1664px] px-8 py-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Albums</h2>

          <div className="flex items-end gap-4">
            <NewAlbumModal>
              <Button>
                New album
              </Button>
            </NewAlbumModal>
          </div>
        </div>

        <AlbumsGrid
          albums={albums}
          isLoading={isAlbumsLoading}
        />
      </section>

      <section className="h-full mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Deleted Albums</h2>
        </div>

        <AlbumsGrid
          albums={deletedAlbums}
          isLoading={isDeletedAlbumsLoading}
        />
      </section>
    </main>
  )
}
