import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'phosphor-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { postUpload } from '@/app/api/post-upload'
import { FileMetadata, preUpload } from '@/app/api/pre-upload'
import { uploadFile } from '@/app/api/upload-file'

import { UploadStatus } from './upload-item'
import { UploadOverlay } from './upload-overlay'

export interface FileWithId {
  id: string
  file: File
  status: UploadStatus
  allowed: boolean
  failureReason?: string
  reason?: string
  uploadUrl?: string
  fileId?: string
  fields?: Record<string, string>
}

interface UploadButtonProps {
  albumId: string
}

export function UploadButton({ albumId }: UploadButtonProps) {
  const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState(false)
  const [filesWithIds, setFilesWithIds] = useState<FileWithId[]>([])
  const [totalNumberOfFiles, setTotalNumberOfFiles] = useState(0)
  const [numberOfUploadedFiles, setNumberOfUploadedFiles] = useState(0)
  const [numberOfFailedFiles, setNumberOfFailedFiles] = useState(0)
  const [isUploadInProgress, setIsUploadInProgress] = useState(false)

  function closeUploadOverLay() {
    setTotalNumberOfFiles(0)
    setFilesWithIds([])
    setNumberOfUploadedFiles(0)
    setNumberOfFailedFiles(0)
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

  async function updateFileUploadStatusOnTheFly(
    id: string,
    status: UploadStatus,
  ) {
    setFilesWithIds((prevFilesWithIds) =>
      prevFilesWithIds.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    )
  }

  async function uploadFilesToS3(
    files: FileWithId[],
  ): Promise<{ uploadedFilesIds: string[] }> {
    const uploadedFilesIds = []

    for await (const file of files) {
      if (!file.allowed || !file.uploadUrl || !file.fields) {
        continue
      }

      const { uploadUrl, fields } = file

      let uploadedWithSuccess = true

      await uploadFileMutation({
        file: file?.file,
        url: uploadUrl,
        fields,
      }).catch(() => {
        uploadedWithSuccess = false
      })

      const status = uploadedWithSuccess
        ? UploadStatus.Completed
        : UploadStatus.Failed

      if (uploadedWithSuccess) {
        uploadedFilesIds.push(file.fileId as string)
        setNumberOfUploadedFiles((prev) => prev + 1)
      } else {
        setNumberOfFailedFiles((prev) => prev + 1)
      }

      updateFileUploadStatusOnTheFly(file.id, status)
    }

    return {
      uploadedFilesIds,
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (!files?.length) {
      return
    }

    const filesArray = Array.from(files)

    setIsUploadInProgress(true)

    setTotalNumberOfFiles(filesArray.length)
    setFilesWithIds([])
    setNumberOfUploadedFiles(0)

    const filesMetaData: FileMetadata[] = []

    const formattedFiles: FileWithId[] = filesArray.map((file) => {
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
        failureReason: '',
        allowed: false,
      }
    })

    setFilesWithIds(formattedFiles)
    setIsUploadOverlayOpen(true)

    const preUploadFiles = await preUploadMutation({
      files: filesMetaData,
      albumId,
    })

    const filesAfterPreUploadAnalysis = formattedFiles.map((file) => {
      const preUploadFile = preUploadFiles.find(
        (preUploadFile) => preUploadFile.id === file.id,
      )

      if (!preUploadFile?.allowed && preUploadFile?.reason) {
        file.status = UploadStatus.Failed
        file.failureReason = preUploadFile.reason
        file.allowed = false
        setNumberOfFailedFiles((prev) => prev + 1)
      } else if (preUploadFile?.allowed) {
        file.allowed = true
        file.fields = preUploadFile.fields
        file.uploadUrl = preUploadFile.uploadUrl
        file.fileId = preUploadFile.fileId
      }

      return file
    })

    setFilesWithIds(() => [...filesAfterPreUploadAnalysis])

    const { uploadedFilesIds } = await uploadFilesToS3(
      filesAfterPreUploadAnalysis,
    )

    if (uploadedFilesIds.length === 0) {
      toast.error('Failed to upload files. Please try again.', {
        duration: 5000,
      })
      setIsUploadInProgress(false)
      return
    }

    await postUploadMutation({
      filesIds: uploadedFilesIds,
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
      uploadedFilesIds.length === files.length
        ? 'Upload complete! All files have been uploaded.'
        : 'Upload complete! Some files were not uploaded.'

    setIsUploadInProgress(false)

    toast.success(allFilesUploaded, {
      duration: 5000,
    })
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
        numberOfUploadedFiles={numberOfUploadedFiles}
        numberOfFailedFiles={numberOfFailedFiles}
        filesToBeUploaded={filesWithIds}
        isUploadInProgress={isUploadInProgress}
      />
    </>
  )
}
