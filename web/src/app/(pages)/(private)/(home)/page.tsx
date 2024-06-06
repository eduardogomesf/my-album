"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DownloadSimple, Plus, Trash } from "phosphor-react";

import { AlbumCard } from "./album-card";
import { getAlbums } from "@/app/api/get-albums";

export default function Home() {
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([])

  const { data: albums } = useQuery({
    queryFn: async () => await getAlbums(),
    queryKey: ['albums'],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours 
  })

  function handleSelectAlbum(albumId: string) {
    if (selectedAlbums.includes(albumId)) {
      setSelectedAlbums(selectedAlbums.filter((albumId) => albumId !== albumId))
    } else {
      setSelectedAlbums([...selectedAlbums, albumId])
    }
  }

  return (
    <main className="min-h-screen max-w-[1664px] w-full m-auto px-8 py-6">
      <section className="h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl	font-bold">Albums</h2>

          <div className="flex items-end gap-4">
            <button>
              <Plus className="h-6 w-6" />
            </button>
            <button>
              <DownloadSimple className="h-6 w-6" />
            </button>
            <button>
              <Trash className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="h-full mt-4 grid grid-cols-1 justify-between gap-6 md:grid-cols-5">
          {albums?.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onSelect={handleSelectAlbum}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
