import clsx from 'clsx'
import Image from 'next/image'
import { Calendar, CheckCircle, Circle, PlayCircle } from 'phosphor-react'
import { useRef } from 'react'

import { File } from '@/app/api/get-album-files'
import { formatDate } from '@/app/util/date'

import { handleFileUrl } from '../../../../util/url'

interface FileCardProps {
  file: File
  hasSameDateAsPrevious: boolean
  onSelect: (id: string) => void
  isSelected: boolean
  onSelectFileForMediaOverlay: (file: File) => void
}

export function FileCard({
  file,
  hasSameDateAsPrevious,
  onSelect,
  isSelected,
  onSelectFileForMediaOverlay,
}: FileCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  let timeoutId: NodeJS.Timeout | null = null

  const isImage = file.type === 'image'

  function handleSelect() {
    onSelect(file.id)
  }

  function handleClick() {
    onSelectFileForMediaOverlay(file)
  }

  const handleMouseOver = () => {
    if (videoRef.current) {
      videoRef.current.play()
      timeoutId = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause()
        }
      }, 3000)
    }
  }

  const handleMouseOut = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }

  return (
    <div
      className={clsx(
        'group relative flex flex-col justify-start gap-1',
        isImage ? 'col-span-1' : 'col-span-2',
      )}
    >
      <span
        className={clsx(
          'flex items-center gap-1 text-sm font-normal text-gray-900',
          hasSameDateAsPrevious && 'invisible',
        )}
      >
        <Calendar className="h-4 w-4 text-gray-900" />
        {formatDate(file.createdAt)}
      </span>

      <button className="relative h-80 w-full" onClick={handleClick}>
        {isImage ? (
          <Image
            src={handleFileUrl(file.url)}
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
        ) : (
          <video
            className={clsx(
              'block h-80 rounded-lg bg-black transition-opacity duration-300 hover:opacity-80',
              isSelected && 'border border-gray-500 opacity-70',
            )}
            muted
            ref={videoRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <source src={file.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
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
          <PlayCircle className="h-8 w-8 text-gray-300" />
        </div>
      )}
    </div>
  )
}
