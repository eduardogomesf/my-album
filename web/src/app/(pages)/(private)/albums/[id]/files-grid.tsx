import clsx from "clsx"

import { File } from "@/app/api/get-album-files"
import { FileCardSkeleton } from "./file-card-skeleton"
import { FileCard } from "./file-card"
import { isSameDate } from "@/app/util/date"

interface FilesGrid {
  files: File[]
  isLoading: boolean
  limit: number
  page: number
  total: number
  totalOfPages: number
  onSelect: (id: string) => void
}

export function FilesGrid({ isLoading, files, onSelect }: FilesGrid) {

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
        'mt-4 h-auto grid grid-cols-1 gap-2 md:grid-cols-5 lg:grid-cols-8 auto-rows-auto',
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
        files.map((file: File, index) => (
          <FileCard
            file={file}
            key={file.id}
            hasSameDateAsPrevious={isSameDate(file.updatedAt, files[index - 1]?.updatedAt)}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  )
}