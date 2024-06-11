'use client'

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ArrowLeft } from "phosphor-react"
import { useParams } from "next/navigation"
import { FilesAndCounts, getAlbumFiles } from "@/app/api/get-album-files"
import { FilesGrid } from "./files-grid"
import { UploadButton } from "./upload-button"

export default function Album() {
  const { id: albumId } = useParams<{ id: string }>()

  const { data: files = {} as FilesAndCounts, isLoading: isFilesLoading } = useQuery({
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
          <h2 className="text-2xl font-bold">Album name</h2>

          <div className="flex items-center gap-4">
            <UploadButton albumId={albumId} />
          </div>
        </div>

        <FilesGrid
          isLoading={isFilesLoading}
          files={files?.files}
          limit={files?.limit}
          page={files?.page}
          total={files?.total}
          totalOfPages={files?.totalOfPages}
        />
      </main>
    </div>
  )
}