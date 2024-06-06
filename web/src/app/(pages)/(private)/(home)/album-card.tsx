import { useState } from "react";
import { ImageSquare, CheckCircle, Circle } from "phosphor-react";
import clsx from "clsx";

import { Album } from "@/app/api/get-albums";

export interface AlbumCardProps {
  album: Album
  onSelect: (id: string) => void;
}

export function AlbumCard({ album, onSelect }: AlbumCardProps) {
  const [isSelected, setIsSelected] = useState(false)

  function handleSelect() {
    setIsSelected(!isSelected)
    onSelect(album.id)
  }

  return (
    <div className="bg-gray-300 h-40 w-full max-w-[300px] rounded-md group cursor-pointer">
      <div className="relative h-5/6 bg-gray-200 flex items-center justify-center rounded-t-lg">
        <button
          className={clsx(
            "absolute top-2 left-2 group-hover:block duration-500 transition ease-in-out",
            !isSelected && 'hidden'
          )}
          onClick={handleSelect}
        >
          {isSelected ? (<CheckCircle className="h-6 w-6" />) : (<Circle className="h-6 w-6" />)}
        </button>

        <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
          <ImageSquare className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex flex-col gap-1 rounded-b-lg">
        <span className="text-lg font-bold">
          {album.name}
        </span>
        <span className="text-sm text-gray-500">
          {`${album.numberOfImages} photos, ${album.numberOfVideos} videos`}
        </span>
        <span className="text-sm text-gray-500">
          {album.updatedAt}
        </span>
      </div>
    </div >
  )
}