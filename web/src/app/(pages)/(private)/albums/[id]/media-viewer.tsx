import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { ArrowLeft, CaretLeft, CaretRight } from 'phosphor-react'

interface MediaViewerProps {
  isImage: boolean
  url: string
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function MediaViewer({
  url,
  isImage,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: MediaViewerProps) {
  function handleModalKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      onNext()
    } else if (event.key === 'ArrowLeft') {
      onPrevious()
    }
  }

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 animate-fade-in-down bg-black p-2"
          onKeyDown={handleModalKeyDown}
        >
          <button
            className="group absolute left-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full transition duration-150 ease-in-out focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <ArrowLeft className="h-6 w-6 text-white transition duration-150 ease-in-out focus:outline-none group-hover:text-gray-400" />
          </button>

          <button
            className={`group absolute left-6 top-1/2 z-50 flex h-20 w-20 -translate-y-1/2 items-center justify-center bg-transparent opacity-0 transition duration-150 ease-in-out hover:opacity-100`}
            onClick={onPrevious}
          >
            <CaretLeft className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400" />
          </button>

          <button
            className={`group absolute right-6 top-1/2 z-50 flex h-20 w-20 -translate-y-1/2 items-center justify-center bg-transparent opacity-0 transition duration-150 ease-in-out hover:opacity-100`}
            onClick={onNext}
          >
            <CaretRight className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400" />
          </button>

          {isImage ? (
            <Image
              src={url}
              alt={'Media'}
              className="mx-auto w-full opacity-95 md:max-w-[85%]"
              fill={true}
              style={{ objectFit: 'contain' }}
              priority
              sizes="100%"
            />
          ) : (
            <video
              className="mx-auto block h-full w-full opacity-95 md:max-w-[85%]"
              controls
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
