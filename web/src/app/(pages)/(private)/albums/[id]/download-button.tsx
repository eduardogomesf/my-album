import { useMutation } from '@tanstack/react-query'
import { DownloadSimple } from 'phosphor-react'
import { toast } from 'sonner'

import { downloadFiles } from '@/app/api/download-files'

interface DownloadButtonProps {
  filesIds: string[]
  albumId: string
  cleanSelectedFiles: () => void
}

export function DownloadButton({
  albumId,
  filesIds,
  cleanSelectedFiles,
}: DownloadButtonProps) {
  const { mutateAsync: downloadFilesMutation } = useMutation({
    mutationFn: downloadFiles,
  })

  async function handleDownload() {
    try {
      if (filesIds.length === 0) {
        toast.error('Select files to download')
        return
      }

      const response = await downloadFilesMutation({
        filesIds,
        albumId,
      })

      const url = window.URL.createObjectURL(new Blob([response]));

      const a = document.createElement('a');
      a.href = url;
      a.download = `${albumId}-${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Revoke the temporary URL to free up resources
      window.URL.revokeObjectURL(url);

      cleanSelectedFiles()

      toast.success('Files downloaded successfully')
    } catch (error) {
      toast.error('Error downloading files')
    }
  }

  return (
    <button
      disabled={filesIds.length === 0}
      onClick={handleDownload}
    >
      <DownloadSimple className="h-6 w-6" />
    </button>
  )
}
