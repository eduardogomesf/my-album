'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, XCircle } from 'phosphor-react'
import { useState } from 'react'

import { FilesAndCounts, getAlbumFiles } from '@/app/api/get-album-files'

import { DeleteButton } from './delete-button'
import { FilesGrid } from './files-grid'
import { UploadButton } from './upload-button'
import { MoveFilesButton } from './move-files-button'

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
    data: filesResult = {} as FilesAndCounts,
    isLoading: isFilesLoading,
  } = useQuery({
    queryKey: ['album-files', albumId],
    queryFn: async () => getAlbumFiles({ albumId, page: 0, limit: 10 }),
  })

  return (
    <div className="m-auto h-full w-full max-w-[1664px] px-8 py-6">
      <Link href={'/'} className="block w-6">
        <ArrowLeft className="h-6 w-6 animate-fade-in-down text-gray-700 transition duration-300 hover:text-gray-800" />
      </Link>

      <main className="mt-8">
        <div className="flex w-full items-center justify-between">
          <div className='flex items-center gap-2'>
            {
              filesResult?.album?.name ? (
                <h2 className="text-2xl font-bold">
                  {filesResult?.album?.name}
                </h2>
              ) : (
                <div className='w-32 h-6 rounded-full animate-pulse bg-gray-300' />
              )
            }

            {filesResult.total > 0 &&
              (<div className='flex items-center gap-1'>
                <span className="text-sm text-gray-600 font-normal">
                  {selectedFiles.length > 0 ? `(${selectedFiles.length} of ${filesResult.total} files selected)` : `(${filesResult.total} files)`}
                </span>
                {selectedFiles.length > 0 && (
                  <button onClick={cleanSelectedFiles}>
                    <XCircle className='w-4 h-4 text-gray-600' />
                  </button>
                )}
              </div>)
            }
          </div>

          <div className="flex items-center gap-4">
            {selectedFiles.length === 0 && <UploadButton albumId={albumId} />}
            {selectedFiles.length > 0 && (
              <MoveFilesButton
                filesIds={selectedFiles}
                cleanSelectedFiles={cleanSelectedFiles}
                albumId={albumId}
              />
            )}
            {selectedFiles.length > 0 && (
              <DeleteButton
                albumId={albumId}
                filesIds={selectedFiles}
                cleanSelectedFiles={cleanSelectedFiles}
              />
            )}
          </div>
        </div>

        <FilesGrid
          isLoading={isFilesLoading}
          files={filesResult?.files}
          limit={filesResult?.limit}
          page={filesResult?.page}
          total={filesResult?.total}
          totalOfPages={filesResult?.totalOfPages}
          onSelect={handleSelectFile}
          selectedFiles={selectedFiles}
        />
      </main>
    </div>
  )
}
