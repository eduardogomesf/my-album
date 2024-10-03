'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, XCircle } from 'phosphor-react'
import { useState } from 'react'

import { File, getAlbumFiles } from '@/app/api/get-album-files'

import { DeleteButton } from './delete-button'
import { DownloadButton } from './download-button'
import { FilesGrid } from './files-grid'
import { MoveFilesButton } from './move-files-button'
import { UploadButton } from './upload-button'

export default function Album() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  function handleSelectFile(id: string) {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter((fileId) => fileId !== id))
    } else {
      setSelectedFiles([...selectedFiles, id])
    }
  }

  function cleanSelectedFiles() {
    setSelectedFiles([])
  }

  const { id: albumId } = useParams<{ id: string }>()

  const {
    data: getFilesResult,
    isLoading: isFilesLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['album-files', albumId],
    queryFn: async ({ pageParam = 0 }) =>
      getAlbumFiles({ albumId, page: pageParam, limit: 16 }),
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.page < lastPage.totalOfPages
      return hasNextPage ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
  })

  const filesResult = getFilesResult?.pages?.length
    ? getFilesResult?.pages[getFilesResult?.pages.length - 1]
    : {
        album: { name: '' },
        files: [],
        limit: 10,
        page: 1,
        total: 1,
        totalOfPages: 1,
      }
  const files = getFilesResult?.pages?.length
    ? getFilesResult.pages.reduce((accumulator, current) => {
        accumulator = [...accumulator, ...current.files]
        return accumulator
      }, [] as File[])
    : []

  return (
    <div className="m-auto h-full w-full max-w-[1664px] px-8 py-6">
      <Link href={'/'} className="block w-6">
        <ArrowLeft className="h-6 w-6 animate-fade-in-down text-gray-700 transition duration-300 hover:text-gray-800" />
      </Link>

      <main className="mt-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {filesResult?.album?.name ? (
              <h2 className="text-2xl font-bold">{filesResult?.album?.name}</h2>
            ) : (
              <div className="h-6 w-32 animate-pulse rounded-full bg-gray-300" />
            )}

            {filesResult.total > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-normal text-gray-600">
                  {selectedFiles.length > 0
                    ? `(${selectedFiles.length} of ${filesResult.total} files selected)`
                    : `(${filesResult.total} files)`}
                </span>
                {selectedFiles.length > 0 && (
                  <button onClick={cleanSelectedFiles}>
                    <XCircle className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {selectedFiles.length === 0 && <UploadButton albumId={albumId} />}
            {selectedFiles.length > 0 && (
              <>
                <DownloadButton
                  filesIds={selectedFiles}
                  albumId={albumId}
                  cleanSelectedFiles={cleanSelectedFiles}
                />
                <MoveFilesButton
                  filesIds={selectedFiles}
                  cleanSelectedFiles={cleanSelectedFiles}
                  albumId={albumId}
                />
                <DeleteButton
                  albumId={albumId}
                  filesIds={selectedFiles}
                  cleanSelectedFiles={cleanSelectedFiles}
                />
              </>
            )}
          </div>
        </div>

        <FilesGrid
          isLoading={isFilesLoading}
          files={files}
          limit={filesResult?.limit}
          page={filesResult?.page}
          total={filesResult?.total}
          totalOfPages={filesResult?.totalOfPages}
          onSelect={handleSelectFile}
          selectedFiles={selectedFiles}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          totalOfFiles={filesResult?.total}
        />
      </main>
    </div>
  )
}
