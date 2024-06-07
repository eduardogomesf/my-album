import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { X } from 'phosphor-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createNewAlbum } from '@/app/api/create-new-album'
import { TextInput } from '@/app/components/form/text-input'
import { SOMETHING_WENT_WRONG } from '@/app/constants/error'

export interface NewAlbumModalProps {
  children: React.ReactNode
}

const newAlbumSchema = z.object({
  name: z.string().min(3, 'Name is required'),
})

type NewAlbumSchema = z.infer<typeof newAlbumSchema>

export function NewAlbumModal({ children }: NewAlbumModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewAlbumSchema>({
    resolver: zodResolver(newAlbumSchema),
  })

  const btnRef = useRef<HTMLButtonElement>(null)

  const { mutateAsync: newAlbum } = useMutation({
    mutationFn: createNewAlbum,
  })

  async function handleNewAlbum(data: NewAlbumSchema) {
    try {
      await newAlbum({
        name: data.name.trim(),
      })

      btnRef.current?.click()

      toast.success('Album created successfully')
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error('There is already an album with this name')
        } else {
          toast.error(SOMETHING_WENT_WRONG)
        }
      } else {
        toast.error(SOMETHING_WENT_WRONG)
      }
    } finally {
      reset({
        name: '',
      })
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-fade-in-down bg-overlay" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-4 focus:outline-none md:w-4/12">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            New album
          </Dialog.Title>

          <form className="mt-4" onSubmit={handleSubmit(handleNewAlbum)}>
            <TextInput
              id="name"
              placeholder="Name of the album"
              {...register('name')}
              error={errors.name?.message}
            />

            <div className="mt-5 flex justify-end">
              {/* <Dialog.Close asChild> */}
              <button
                className="flex cursor-pointer items-center gap-1 rounded-md border bg-gray-700 px-2 py-1 text-gray-50 transition duration-150 ease-in-out hover:bg-gray-800"
                type="submit"
              >
                Create
              </button>
              {/* </Dialog.Close> */}
            </div>
          </form>

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
