import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { ArrowLeft } from 'phosphor-react'

interface MediaViewerProps {
  children: React.ReactNode
  isImage: boolean
  url: string
}

export function MediaViewer({ children, url, isImage }: MediaViewerProps) {

  const treatedUrl = url.replace('s3', 'localhost')

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 p-2 bg-black animate-fade-in-down">
          <Dialog.Close asChild>
            <button
              className="group z-50 absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full transition duration-150 ease-in-out hover:bg-gray-600"
              aria-label="Close"
            >
              <ArrowLeft className="h-5 w-5 text-gray-100 transition duration-150 ease-in-out group-hover:text-gray-200" />
            </button>
          </Dialog.Close>

          {isImage ? (
            <Image
              src={treatedUrl}
              alt={'Media'}
              className='mx-auto max-w-[85%] opacity-95'
              fill={true}
              style={{ objectFit: 'contain' }}
              priority
              sizes="100%"
            />
          ) : (
            <video
              className='block mx-auto h-full max-w-[85%] opacity-95'
              controls
            >
              <source src={treatedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}