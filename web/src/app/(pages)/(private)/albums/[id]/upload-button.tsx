import { v4 as uuid } from 'uuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'phosphor-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import { uploadFile } from '@/app/api/upload-file'
import { FileMetadata, preUpload } from '@/app/api/pre-upload'
import { postUpload } from '@/app/api/post-upload'

interface UploadButtonProps {
  albumId: string
}

export function UploadButton({ albumId }: UploadButtonProps) {
  const queryClient = useQueryClient()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: preUploadMutation } = useMutation({
    mutationFn: preUpload,
  })

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
  })

  const { mutateAsync: postUploadMutation } = useMutation({
    mutationFn: postUpload,
  })

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (!files?.length) {
      return
    }

    const filesArray = Array.from(files)

    const filesMetaData: FileMetadata[] = []

    const filesWithIds = filesArray.map((file) => {
      const id = uuid()

      filesMetaData.push({
        id,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
      })

      return {
        file,
        id,
      }
    })

    const uploadResult = await preUploadMutation({
      files: filesMetaData,
      albumId
    })

    const uploadsResult = await Promise.all(
      uploadResult.allowed.map(async (allowedFile) => {
        const { uploadUrl, fields } = allowedFile

        const fileWithId = filesWithIds.find((file) => file.id === allowedFile.id)

        if (!fileWithId) {
          return null
        }

        let uploadFailed = false

        await uploadFileMutation({
          file: fileWithId?.file,
          url: uploadUrl,
          fields
        }).catch(() => {
          uploadFailed = true

        })

        return {
          fileId: allowedFile.fileId,
          success: !uploadFailed
        }
      })
    )

    const uploadToS3Results = uploadsResult.reduce((accumulator, current) => {
      if (current?.success === true) {
        accumulator.successUploadsIds.push(current.fileId)
      } else if (current?.success === false) {
        accumulator.failedUploadsIds.push(current.fileId)
      }

      return accumulator
    }, {
      successUploadsIds: [] as string[],
      failedUploadsIds: [] as string[]
    })

    if (uploadToS3Results?.successUploadsIds.length === 0) {
      toast.error('Failed to upload files')
      return
    }

    await postUploadMutation({
      filesIds: uploadToS3Results.successUploadsIds,
      albumId
    })

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['album-files'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['current-usage'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['albums'],
      })
    ])

    toast.success('Upload complete!')
  }

  return (
    <>
      <input
        type="file"
        ref={inputFileRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept='image/*, video/*'
      />
      <button onClick={() => inputFileRef.current?.click()}>
        <Plus className="h-6 w-6" />
      </button>
    </>
  )
}
