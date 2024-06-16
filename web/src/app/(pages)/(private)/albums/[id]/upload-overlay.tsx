import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { UploadItem } from './upload-item'
import { FileWithId } from './upload-button'

interface UploadOverlayProps {
  open: boolean
  onClose: () => void
  totalNumberOfFiles: number
  finishedNumberOfFiles: number
  filesToBeUploaded: FileWithId[]
}

export function UploadOverlay({ filesToBeUploaded, open, onClose, totalNumberOfFiles, finishedNumberOfFiles = 0 }: UploadOverlayProps) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Content className="fixed left-10 bottom-20 rounded-md bg-white py-2 px-2 focus:outline-none w-10/12 h-[300px] md:w-[400px]">
          <div className='flex items-center gap-1 px-2'>
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              Media Upload
            </Dialog.Title>

            <span className='text-gray-500 text-sm font-normal'>
              ({finishedNumberOfFiles} of {totalNumberOfFiles})
            </span>
          </div>


          <Dialog.Close asChild>
            <button
              className="group absolute right-4 top-2 flex h-6 w-6 items-center justify-center rounded-full transition duration-150 ease-in-out hover:bg-gray-200"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-800" />
            </button>
          </Dialog.Close>

          <div className='w-full h-[2px] bg-gray-100 mt-2 mb-4' />

          <div className='flex flex-col gap-2 items-start w-full overflow-auto h-[200px] px-2'>
            {!!filesToBeUploaded.length && filesToBeUploaded.map((fileToBeUploaded, index) => (
              <UploadItem
                key={index}
                name={fileToBeUploaded.file.name}
                status={fileToBeUploaded.status}
              />
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}