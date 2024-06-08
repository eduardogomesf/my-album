import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { SignOut } from 'phosphor-react'

import { AvatarSkeleton } from './skeleton/avatar-skeleton'
import { toast } from 'sonner'

interface AvatarProps {
  firstName: string
  email: string
}

export function Avatar({ firstName, email }: AvatarProps) {
  const router = useRouter()

  const firstLetter = firstName ? firstName[0].toUpperCase() : null

  function handleSignOut() {
    router.push('/sign-out')
    toast.success('You have been signed out.')
  }

  const options = [
    {
      label: 'Sign out',
      Icon: SignOut,
      onClick: handleSignOut,
    },
  ]

  if (!firstLetter) {
    return <AvatarSkeleton />
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex size-8 items-center justify-center rounded-full bg-gray-800 text-white outline-none transition duration-150 ease-in-out hover:bg-gray-950">
          {firstLetter}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={1}
          className="m-auto flex min-w-[150px] flex-col items-start gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg transition-all duration-1000 ease-in-out"
        >
          <DropdownMenu.Arrow className="fill-gray-200" />

          <DropdownMenu.Label className='w-full flex items-center justify-center'>
            <span className="text-gray-700 font-medium text-md">
              Hi, {' '}
              <span className="text-gray-800 font-semibold">{firstName}</span>!
            </span>

          </DropdownMenu.Label>

          <DropdownMenu.Label className='text-sm text-gray-500'>
            <span>({email})</span>
          </DropdownMenu.Label>

          <DropdownMenu.Separator className='h-[1px] bg-gray-300 w-full' />

          {options.map((option) => (
            <DropdownMenu.Item
              key={option.label}
              className="group w-full rounded-sm px-2 outline-none transition-colors duration-300 hover:bg-gray-700"
            >
              <button
                className="flex w-full items-center justify-between text-gray-600 outline-none transition-colors duration-300 group-hover:text-gray-50"
                onClick={option.onClick}
              >
                {option.label}
                <option.Icon className="size-4 transition-colors duration-300 group-hover:text-gray-50" />
              </button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
