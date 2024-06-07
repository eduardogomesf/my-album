"use client"

import { useQuery } from "@tanstack/react-query";

import { AlbumCard } from "./album-card";
import { getAlbums } from "@/app/api/get-albums";
import { AlbumCardSkeleton } from "./album-card-skeleton";

export default function Home() {
  const { data: albums, isLoading } = useQuery({
    queryFn: async () => await getAlbums(),
    queryKey: ['albums'],
    staleTime: 1000 * 60 * 60 * 1, // 1 hours 
  })

  return (
    <main className="min-h-screen max-w-[1664px] w-full m-auto px-8 py-6">
      <section className="h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl	font-bold">Albums</h2>

          <div className="flex items-end gap-4">
            <button
              className="px-2 py-1 flex items-center gap-1 border bg-gray-800 rounded-md text-gray-50"
            >
              New album
            </button>
          </div>
        </div>

        <div className="h-full mt-4 grid grid-cols-1 justify-between gap-6 md:grid-cols-5">
          {isLoading ?
            Array.from({ length: 5 }).map((_: unknown, index: number) => (
              <AlbumCardSkeleton key={index} />
            )) :
            albums?.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
              />
            ))}
        </div>
      </section>
    </main>
  )
}
