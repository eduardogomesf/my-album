import { CheckCircle, CircleNotch, XCircle } from 'phosphor-react'

export enum UploadStatus {
  Uploading = 'uploading',
  Completed = 'completed',
  Failed = 'failed',
}

interface UploadItemProps {
  name: string
  status: UploadStatus
}

export function UploadItem({ name, status }: UploadItemProps) {
  return (
    <div className="flex w-full items-center justify-between border-b border-b-gray-100 pb-2">
      <span className="text-md max-w-xs overflow-hidden truncate font-semibold text-gray-800">
        {name}
      </span>
      {status === UploadStatus.Uploading ? (
        <CircleNotch className="h-5 w-5 animate-spin text-gray-600" />
      ) : status === UploadStatus.Completed ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      )}
    </div>
  )
}
