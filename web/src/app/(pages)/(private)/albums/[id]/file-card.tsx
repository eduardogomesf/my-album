import Image from "next/image"

import { File } from "@/app/api/get-album-files"
import { formatDate } from "@/app/util/date"
import { Calendar, CheckCircle, Circle, PlayCircle } from "phosphor-react"
import clsx from "clsx"
import { useState } from "react"

interface FileCardProps {
  file: File
  hasSameDateAsPrevious: boolean
}

export function FileCard({ file, hasSameDateAsPrevious }: FileCardProps) {
  const [isSelected, setIsSelected] = useState(false)

  function handleSelect() {
    setIsSelected(!isSelected)
  }

  return (
    <button
      className="flex justify-start gap-1 flex-col relative group"
    >
      <span
        className={clsx(
          "text-sm text-gray-900 font-normal flex items-center gap-1",
          hasSameDateAsPrevious && "invisible",
        )}
      >
        <Calendar className="text-gray-900 w-4 h-4" />
        {formatDate(file.updatedAt)}
      </span>

      <Image
        src={file.url.replace('s3', 'localhost')}
        alt={file.name}
        className={clsx(
          "rounded-lg hover:opacity-80 duration-300 transition-opacity",
          isSelected && "opacity-70 border border-gray-500"
        )}
        width={300}
        height={250}
      />

      <button
        onClick={handleSelect}
        className="hidden absolute top-8 left-2 group-hover:block"
      >
        {
          isSelected ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )
        }
      </button>

      {file.type === 'video' && (
        <div
          className="absolute top-8 right-5"
        >
          <PlayCircle className="w-8 h-8" />
        </div>
      )}
    </button>
  )
}