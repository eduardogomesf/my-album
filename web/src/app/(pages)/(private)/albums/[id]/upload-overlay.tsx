import { X } from 'phosphor-react'

import { FileWithId } from './upload-button'
import { UploadItem } from './upload-item'

interface UploadOverlayProps {
  open: boolean
  onClose: () => void
  totalNumberOfFiles: number
  numberOfUploadedFiles: number
  numberOfFailedFiles: number
  filesToBeUploaded: FileWithId[]
  isUploadInProgress: boolean
}

export function UploadOverlay({
  filesToBeUploaded,
  open,
  onClose,
  totalNumberOfFiles,
  numberOfUploadedFiles = 0,
  isUploadInProgress = false,
  numberOfFailedFiles = 0
}: UploadOverlayProps) {
  return (
    open && (
      <div
        className="z-50 fixed bottom-20 left-10 h-[300px] w-10/12 animate-fade-in-down rounded-md bg-white px-2 py-2 focus:outline-none md:w-[400px]"
      >
        <div className="flex items-center gap-1 px-2">
          <strong className="text-lg font-semibold text-gray-800">
            Media Upload
          </strong>

          <span className="text-sm font-normal text-gray-500">
            ({numberOfUploadedFiles} of {totalNumberOfFiles})
          </span>
        </div>

        {!isUploadInProgress && (
          <div className='flex flex-col items-start gap-1 px-2'>
            {
              numberOfUploadedFiles > 0 &&
              (<span className='text-sm font-normal text-gray-500'>
                {numberOfUploadedFiles} uploaded{numberOfFailedFiles > 0 && `, ${numberOfFailedFiles} failed`}
              </span>)
            }
          </div>
        )}

        {!isUploadInProgress && (
          <button
            className="group absolute right-4 top-2 flex h-6 w-6 items-center justify-center rounded-full transition duration-150 ease-in-out"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-800" />
          </button>
        )}

        <div className="mb-4 mt-2 h-[2px] w-full bg-gray-100" />

        <div className="flex h-[200px] w-full flex-col items-start gap-2 overflow-auto px-2">
          {!!filesToBeUploaded.length &&
            filesToBeUploaded.map((fileToBeUploaded, index) => (
              <UploadItem
                key={index}
                name={fileToBeUploaded.file.name}
                status={fileToBeUploaded.status}
                failureReason={fileToBeUploaded.failureReason}
              />
            ))}
        </div>
      </div>
    )
  )
}
