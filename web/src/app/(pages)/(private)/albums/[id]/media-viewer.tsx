import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { ArrowLeft, CaretLeft, CaretRight, Info } from 'phosphor-react'

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
              className="group z-50 absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition duration-150 ease-in-out"
              aria-label="Close"
            >
              <ArrowLeft className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400" />
            </button>
          </Dialog.Close>

          <div className='group z-50 absolute right-4 top-4 flex'>
            <button className='flex h-8 w-8 items-center justify-center rounded-full transition duration-150 ease-in-out'>
              <Info className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400" />
            </button>
          </div>

          <button
            className={`
              group z-50 absolute top-1/2 -translate-y-1/2 left-6 opacity-0 hover:opacity-100 bg-transparent h-20 w-20
              flex items-center justify-center 
              transition duration-150 ease-in-out 
            `}
          >
            <CaretLeft
              className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400"
            />
          </button>

          <button
            className={`
              group z-50 absolute top-1/2 -translate-y-1/2 right-6 opacity-0 hover:opacity-100 bg-transparent h-20 w-20
              flex items-center justify-center 
              transition duration-150 ease-in-out 
            `}
          >
            <CaretRight
              className="h-6 w-6 text-white transition duration-150 ease-in-out group-hover:text-gray-400"
            />
          </button>

          {isImage ? (
            <Image
              src={treatedUrl}
              alt={'Media'}
              className='mx-auto w-full md:max-w-[85%] opacity-95'
              fill={true}
              style={{ objectFit: 'contain' }}
              priority
              sizes="100%"
            />
          ) : (
            <video
              className='block mx-auto h-full w-full md:max-w-[85%] opacity-95'
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