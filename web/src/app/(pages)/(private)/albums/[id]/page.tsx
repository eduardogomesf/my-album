'use client'

import { useMutation, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ArrowLeft, Plus } from "phosphor-react"
import { useRef } from "react"
import { uploadFile } from "@/app/api/upload-file"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { FilesAndCounts, getAlbumFiles } from "@/app/api/get-album-files"
import { FilesGrid } from "./files-grid"

export default function Album() {
  const { id: albumId } = useParams<{ id: string }>()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success('Files uploaded')
    }
  })

  const { data: files = {} as FilesAndCounts, isLoading: isFilesLoading } = useQuery({
    queryKey: ['album-files', { albumId }],
    queryFn: async () => getAlbumFiles({ albumId, page: 0, limit: 10 })
  })

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (files && files.length > 0) {
      const filesArray = Array.from(files)

      await Promise.all(
        filesArray.map(
          async (file) => {
            try {
              await uploadFileMutation({
                file,
                albumId: albumId
              })
            } catch (error) {
              toast.error(`Error uploading file ${file.name}`)
            }
          }
        )
      )
    }
  }

  return (
    <div className="m-auto h-full w-full max-w-[1664px] px-8 py-6">
      <Link href={'/'}>
        <ArrowLeft className="h-6 w-6 transition duration-300 animate-fade-in-down text-gray-700 hover:text-gray-800" />
      </Link>

      <main className="mt-8">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-bold">Album name</h2>

          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={inputFileRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <button
              onClick={() => inputFileRef.current?.click()}
            >
              <Plus className="h-6 w-6" />
            </button>
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