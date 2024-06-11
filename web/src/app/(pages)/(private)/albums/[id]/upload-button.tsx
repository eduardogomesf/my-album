import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { toast } from "sonner"
import { uploadFile } from "@/app/api/upload-file"
import { Plus } from "phosphor-react"

interface UploadButtonProps {
  albumId: string
}

export function UploadButton({ albumId }: UploadButtonProps) {
  const queryClient = useQueryClient()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
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

      await queryClient.invalidateQueries({
        queryKey: ['album-files']
      })

      toast.success('Files uploaded successfully')
    }
  }

  return (
    <>
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
    </>
  )
}