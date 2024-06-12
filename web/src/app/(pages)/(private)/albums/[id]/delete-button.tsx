import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "phosphor-react";
import { deleteFiles } from "@/app/api/delete-files";
import { toast } from "sonner";
import { ConfirmActionModal } from "@/app/components/confirm-action-modal";

interface DeleteButtonProps {
  filesIds: string[];
  albumId: string;
  cleanSelectedFiles: () => void;
}

export function DeleteButton({ albumId, filesIds, cleanSelectedFiles }: DeleteButtonProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteFilesMutation } = useMutation({
    mutationFn: deleteFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['album-files']
      })
      queryClient.invalidateQueries({
        queryKey: ['current-usage']
      })
      queryClient.invalidateQueries({
        queryKey: ['albums']
      })
    }
  })

  async function handleDelete() {
    try {
      if (filesIds.length === 0) {
        toast.error("Select files to delete")
        return
      }

      await deleteFilesMutation({
        filesIds,
        albumId
      })

      cleanSelectedFiles()

      toast.success("Files deleted successfully")
    } catch (error) {
      toast.error("Error deleting files")
    }
  }

  return (
    <ConfirmActionModal
      title={'Delete files'}
      description={`Are you sure you want the files? This action cannot be undone.`}
      onConfirm={handleDelete}
      additionalNote="You won't be able to recover these files."
    >
      <button disabled={filesIds.length === 0}>
        <Trash className="h-6 w-6" />
      </button>
    </ConfirmActionModal>
  )
}