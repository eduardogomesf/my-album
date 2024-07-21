import clsx from 'clsx'
import { useState } from 'react'

import { File } from '@/app/api/get-album-files'
import { isSameDate } from '@/app/util/date'

import { FileCard } from './file-card'
import { FileCardSkeleton } from './file-card-skeleton'
import { MediaViewer } from './media-viewer'

interface FilesGrid {
  files: File[]
  isLoading: boolean
  limit: number
  page: number
  total: number
  totalOfPages: number
  onSelect: (id: string) => void
  selectedFiles: string[]
}

type FileForMediaOverlay = File & { listPosition: number }

export function FilesGrid({
  isLoading,
  files,
  onSelect,
  selectedFiles,
}: FilesGrid) {
  const [fileForMediaOverlay, setFileForMediaOverlay] =
    useState<FileForMediaOverlay | null>(null)

  function onCloseModalOverlay() {
    setFileForMediaOverlay(null)
  }

  function handleSelectFileForMediaOverlay(file: File) {
    setFileForMediaOverlay({
      ...file,
      listPosition: files.findIndex((f) => f.id === file.id),
    })
  }

  function handleNextFile() {
    if (!fileForMediaOverlay) return

    const nextPosition = fileForMediaOverlay.listPosition + 1

    const nextFile = files[nextPosition]

    if (nextFile) {
      setFileForMediaOverlay({
        ...nextFile,
        listPosition: nextPosition,
      })
    }
  }

  function handlePreviousFile() {
    if (!fileForMediaOverlay) return

    const previousPosition = fileForMediaOverlay.listPosition - 1

    const previousFile = files[previousPosition]

    if (previousFile) {
      setFileForMediaOverlay({
        ...previousFile,
        listPosition: previousPosition,
      })
    }
  }

  if (files && files.length === 0 && !isLoading) {
    return (
      <div className="my-40 flex items-center justify-center">
        <p className="text-center text-lg text-gray-600">No media found</p>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'mt-4 grid h-auto auto-rows-auto grid-cols-1 gap-2 md:grid-cols-5 lg:grid-cols-8',
        files &&
          files.length === 0 &&
          !isLoading &&
          'mt-[150px] md:grid-cols-1',
      )}
    >
      {fileForMediaOverlay && (
        <MediaViewer
          isImage={fileForMediaOverlay.type === 'image'}
          url={fileForMediaOverlay.url.replace('s3', 'localhost')}
          isOpen={!!fileForMediaOverlay}
          onClose={onCloseModalOverlay}
          onNext={handleNextFile}
          onPrevious={handlePreviousFile}
        />
      )}

      {isLoading
        ? Array.from({ length: 10 }).map((_: unknown, index: number) => (
            <FileCardSkeleton key={index} />
          ))
        : files.map((file: File, index) => (
            <FileCard
              file={file}
              key={file.id}
              hasSameDateAsPrevious={isSameDate(
                file.createdAt,
                files[index - 1]?.createdAt,
              )}
              onSelect={onSelect}
              isSelected={selectedFiles.includes(file.id)}
              onSelectFileForMediaOverlay={handleSelectFileForMediaOverlay}
            />
          ))}
    </div>
  )
}
