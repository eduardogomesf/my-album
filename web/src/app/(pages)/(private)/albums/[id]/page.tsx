'use client'

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ArrowLeft } from "phosphor-react"
import { useParams } from "next/navigation"
import { FilesAndCounts, getAlbumFiles } from "@/app/api/get-album-files"
import { FilesGrid } from "./files-grid"
import { UploadButton } from "./upload-button"
import { DeleteButton } from "./delete-button"
import { useState } from "react"

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

  const { data: filesResult = {} as FilesAndCounts, isLoading: isFilesLoading } = useQuery({
    queryKey: ['album-files', { albumId }],
    queryFn: async () => getAlbumFiles({ albumId, page: 0, limit: 10 })
  })

  return (
    <div className="m-auto h-full w-full max-w-[1664px] px-8 py-6">
      <Link href={'/'} className="block w-6">
        <ArrowLeft className="h-6 w-6 transition duration-300 animate-fade-in-down text-gray-700 hover:text-gray-800" />
      </Link>

      <main className="mt-8">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-bold">{filesResult?.album?.name ?? 'Album name...'}</h2>

          <div className="flex items-center gap-4">
            {selectedFiles.length === 0 && <UploadButton albumId={albumId} />}
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
        />
      </main>
    </div>
  )
}