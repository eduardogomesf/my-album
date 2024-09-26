import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'phosphor-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { postUpload } from '@/app/api/post-upload'
import {
  FileAfterAnalysis,
  FileMetadata,
  preUpload,
} from '@/app/api/pre-upload'
import { uploadFile } from '@/app/api/upload-file'

import { UploadStatus } from './upload-item'
import { UploadOverlay } from './upload-overlay'

export interface FileWithId {
  id: string
  file: File
  status: UploadStatus
  failureReason?: string
}

interface UploadButtonProps {
  albumId: string
}

export function UploadButton({ albumId }: UploadButtonProps) {
  const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState(false)
  const [filesWithIds, setFilesWithIds] = useState<FileWithId[]>([])
  const [totalNumberOfFiles, setTotalNumberOfFiles] = useState(0)
  const [finishedNumberOfFiles, setFinishedNumberOfFiles] = useState(0)

  function closeUploadOverLay() {
    setTotalNumberOfFiles(0)
    setFilesWithIds([])
    setFinishedNumberOfFiles(0)
    setIsUploadOverlayOpen(false)
  }

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

  async function uploadFilesToS3(
    filesToUpload: FileAfterAnalysis[],
    allFiles: FileWithId[],
  ) {
    const successUploadsIds: string[] = []
    const failedUploadsIds: string[] = []

    const result = await Promise.all(
      filesToUpload.map(async (allowedFile) => {
        const { uploadUrl, fields } = allowedFile

        const fileWithId = allFiles.find((file) => file.id === allowedFile.id)

        if (!fileWithId || !uploadUrl || !fields) {
          return null
        }

        let uploadedWithSuccess = true

        await uploadFileMutation({
          file: fileWithId?.file,
          url: uploadUrl,
          fields,
        }).catch(() => {
          uploadedWithSuccess = false
        })

        if (uploadedWithSuccess) {
          setFinishedNumberOfFiles((prev) => prev + 1)
          successUploadsIds.push(allowedFile.id)
        } else {
          failedUploadsIds.push(allowedFile.id)
        }

        return null
      }),
    )

    return {
      successUploadsIds,
      failedUploadsIds,
      result,
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (!files?.length) {
      return
    }

    const filesArray = Array.from(files)

    setTotalNumberOfFiles(filesArray.length)
    setFilesWithIds([])
    setFinishedNumberOfFiles(0)

    const filesMetaData: FileMetadata[] = []

    const formattedFiles = filesArray.map((file) => {
      const id = uuid()
      const status = UploadStatus.Uploading

      filesMetaData.push({
        id,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
      })

      return {
        file,
        id,
        status,
        failureReason: ''
      }
    })

    setFilesWithIds(formattedFiles)
    setIsUploadOverlayOpen(true)

    const preUploadFiles = await preUploadMutation({
      files: filesMetaData,
      albumId,
    })

    const allowedFiles: FileAfterAnalysis[] = []

    const filesAfterPreUploadAnalysis = formattedFiles.map((file) => {
      const preUploadFile = preUploadFiles.find(
        (preUploadFile) => preUploadFile.id === file.id,
      )

      if (!preUploadFile?.allowed && preUploadFile?.reason) {
        file.status = UploadStatus.Failed
        file.failureReason = preUploadFile.reason
      } else if (preUploadFile?.allowed) {
        allowedFiles.push(preUploadFile)
      }

      return file
    })

    setFilesWithIds(() => [...filesAfterPreUploadAnalysis])

    const { successUploadsIds, failedUploadsIds } = await uploadFilesToS3(
      allowedFiles,
      filesAfterPreUploadAnalysis,
    )

    const filesWithPostUploadStatus = filesAfterPreUploadAnalysis.map(
      (file) => {
        if (successUploadsIds.includes(file.id)) {
          file.status = UploadStatus.Completed
        } else if (failedUploadsIds.includes(file.id)) {
          file.status = UploadStatus.Failed
        }

        return file
      },
    )

    setFilesWithIds(() => [...filesWithPostUploadStatus])

    if (successUploadsIds.length === 0) {
      toast.error('Failed to upload files. Please try again.', {
        duration: 5000,
      })
      return
    }

    const filesIdsForPostUpload = allowedFiles.reduce(
      (accumulator, allowedFile) => {
        if (successUploadsIds.includes(allowedFile.id) && allowedFile.fileId) {
          accumulator.push(allowedFile.fileId)
        }

        return accumulator
      },
      [] as string[],
    )

    await postUploadMutation({
      filesIds: filesIdsForPostUpload,
      albumId,
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
      }),
    ])

    const allFilesUploaded =
      filesIdsForPostUpload.length === files.length
        ? 'Upload complete! All files have been uploaded.'
        : 'Upload complete! Some files were not uploaded.'

    toast.success(allFilesUploaded, {
      duration: 5000,
    })

    setTimeout(() => {
      closeUploadOverLay()
    }, 5000)
  }

  return (
    <>
      <input
        type="file"
        ref={inputFileRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept="image/*, video/*"
      />
      <button onClick={() => inputFileRef.current?.click()}>
        <Plus className="h-6 w-6" />
      </button>
      <UploadOverlay
        open={isUploadOverlayOpen}
        onClose={closeUploadOverLay}
        totalNumberOfFiles={totalNumberOfFiles}
        finishedNumberOfFiles={finishedNumberOfFiles}
        filesToBeUploaded={filesWithIds}
      />
    </>
  )
}
