import { Check, Folders, Image, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from "@/app/components/button";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAlbums } from "@/app/api/get-albums";
import { formatDate } from "@/app/util/date";
import clsx from "clsx";
import { moveFilesToAlbum } from "@/app/api/move-files-to-album";
import { toast } from "sonner";

interface MoveFilesButtonProps {
  filesIds: string[]
  albumId: string
  cleanSelectedFiles: () => void
}

export function MoveFilesButton({ filesIds, albumId, cleanSelectedFiles }: MoveFilesButtonProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)

  const btnRef = useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  const { data: albums = [], isLoading: isAlbumsLoading } = useQuery({
    queryFn: async () => await getAlbums(),
    queryKey: ['albums'],
    staleTime: 1000 * 60 * 60 * 1, // 1 hours
  })

  const { mutateAsync: moveFilesToAlbumMutation } = useMutation({
    mutationFn: async () => await moveFilesToAlbum({
      filesIds,
      targetAlbumId: selectedAlbumId as string
    }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['album-files', albumId] }),
        queryClient.invalidateQueries({ queryKey: ['albums'] }),
        queryClient.invalidateQueries({ queryKey: ['album-files', selectedAlbumId] })
      ])
      setSelectedAlbumId(null)
      cleanSelectedFiles()
      btnRef.current?.click()
      toast.success('Files moved successfully', {
        duration: 5000
      })
    },
  })

  function handleCancel() {
    btnRef.current?.click()
    setSelectedAlbumId(null)
  }

  function handleSelectAlbum(albumId: string) {
    setSelectedAlbumId(albumId)
  }

  async function handleConfirm() {
    try {
      await moveFilesToAlbumMutation()
    } catch (error) {
      toast.error('An error occurred while moving files')
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="relative flex items-center justify-center animate-fade-in-down transition duration-300"
          disabled={filesIds.length === 0}
        >
          <Folders className="h-7 w-7 text-gray-900" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-fade-in-down bg-overlay" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-4 focus:outline-none md:w-4/12">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Move files to another album
          </Dialog.Title>

          <Dialog.Description className="text-md mt-2 text-gray-700">
            Select the album where you want to move the files
          </Dialog.Description>

          <div className="mt-4 max-h-[200px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {albums?.map((album) => (
              <button
                className="group flex h-32 w-full max-w-[150px] cursor-pointer flex-col rounded-md bg-gray-200"
                onClick={() => handleSelectAlbum(album.id)}
              >
                <div
                  className={clsx(
                    "flex w-full flex-1 items-center justify-center rounded-t-lg bg-gray-200 transition duration-150 ease-in-out group-hover:bg-gray-300",
                    selectedAlbumId === album.id ? 'bg-gray-300' : ''
                  )}
                >
                  <Image
                    className="h-6 w-6 text-gray-800"
                  />
                </div>

                <div className="group w-full relative flex flex-col items-start gap-1 rounded-b-lg bg-gray-50 p-3">
                  <span className="text-sm font-bold">{album.name}</span>
                  <span className="text-xs text-gray-500">{album.updatedAt ? formatDate(album.updatedAt) : ''}</span>
                  {selectedAlbumId === album.id && (
                    <span className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full">
                      <Check className="h-4 w-4 text-gray-800" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button
              type="button"
              onClick={handleCancel}
              contrast={true}
            >
              Cancel
            </Button>
            <Button
              type="button" onClick={handleConfirm}
              disabled={isAlbumsLoading || filesIds.length === 0 || selectedAlbumId === null}
            >
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