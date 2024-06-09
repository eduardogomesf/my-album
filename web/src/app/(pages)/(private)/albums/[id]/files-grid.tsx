import clsx from "clsx"

import { File } from "@/app/api/get-album-files"
import { FileCardSkeleton } from "./file-card-skeleton"

interface FilesGrid {
  files: File[]
  isLoading: boolean
  limit: number
  page: number
  total: number
  totalOfPages: number
}

export function FilesGrid({ isLoading, files }: FilesGrid) {

  if (files && files.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center my-40">
        <p className="text-center text-gray-600 text-lg">No files found</p>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'mt-4 h-auto grid grid-cols-1 gap-6 md:grid-cols-5 auto-rows-auto',
        files &&
        files.length === 0 &&
        !isLoading &&
        'mt-[150px] md:grid-cols-1',
      )}
    >
      {isLoading ? (
        Array.from({ length: 10 }).map((_: unknown, index: number) => (
          <FileCardSkeleton key={index} />
        ))
      ) : (
        files.map((album: any) => (
          <span>{album.id}</span>
        ))
      )}
    </div>
  )
}