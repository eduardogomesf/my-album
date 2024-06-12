import clsx from 'clsx'
import Image from 'next/image'
import { Calendar, CheckCircle, Circle, PlayCircle } from 'phosphor-react'
import { useState } from 'react'

import { File } from '@/app/api/get-album-files'
import { formatDate } from '@/app/util/date'

interface FileCardProps {
  file: File
  hasSameDateAsPrevious: boolean
  onSelect: (id: string) => void
}

export function FileCard({
  file,
  hasSameDateAsPrevious,
  onSelect,
}: FileCardProps) {
  const [isSelected, setIsSelected] = useState(false)

  function handleSelect() {
    setIsSelected(!isSelected)
    onSelect(file.id)
  }

  function handleClick() {
    console.log('clicked')
  }

  return (
    <div className={clsx('group relative flex flex-col justify-start gap-1')}>
      <span
        className={clsx(
          'flex items-center gap-1 text-sm font-normal text-gray-900',
          hasSameDateAsPrevious && 'invisible',
        )}
      >
        <Calendar className="h-4 w-4 text-gray-900" />
        {formatDate(file.updatedAt)}
      </span>

      <button className="relative h-80 w-full" onClick={handleClick}>
        <Image
          src={file.url.replace('s3', 'localhost')}
          alt={file.name}
          className={clsx(
            'rounded-lg transition-opacity duration-300 hover:opacity-80',
            isSelected && 'border border-gray-500 opacity-70',
          )}
          fill={true}
          style={{ objectFit: 'cover' }}
          priority
          sizes="100%"
        />
      </button>

      <button
        onClick={handleSelect}
        className={clsx(
          'absolute left-2 top-8 group-hover:block',
          isSelected ? 'block' : 'hidden',
        )}
      >
        {isSelected ? (
          <CheckCircle className="h-6 w-6" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      {file.type === 'video' && (
        <div className="absolute right-5 top-8">
          <PlayCircle className="h-8 w-8" />
        </div>
      )}
    </div>
  )
}
