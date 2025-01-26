import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { useRef } from 'react'

import { Button } from './button'

interface ConfirmActionModalProps {
  children: React.ReactNode
  title: string
  description: string
  additionalNote?: string
  onConfirm: () => Promise<void>
}

export function ConfirmActionModal({
  children,
  title,
  description,
  additionalNote,
  onConfirm,
}: ConfirmActionModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleCancel() {
    btnRef.current?.click()
  }

  async function handleConfirm() {
    await onConfirm()

    btnRef.current?.click()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-fade-in-down bg-overlay" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-4 focus:outline-none md:w-4/12">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </Dialog.Title>

          <span className="mt-2 text-sm text-gray-500">{additionalNote}</span>

          <Dialog.Description className="text-md mt-2 text-gray-700">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button type="button" onClick={handleCancel} contrast={true}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="group absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition duration-150 ease-in-out hover:bg-gray-200"
              aria-label="Close"
              ref={btnRef}
            >
              <X className="h-5 w-5 text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-800" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
