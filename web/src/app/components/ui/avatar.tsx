interface AvatarProps {
  firstName: string
}

export function Avatar({ firstName }: AvatarProps) {
  const firstLetter = firstName ? firstName[0].toUpperCase() : 'U'

  return (
    <div className="flex items-center justify-center size-8 bg-gray-700 text-white rounded-full">
      {firstLetter}
    </div>
  )
}