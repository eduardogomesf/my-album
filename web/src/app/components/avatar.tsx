import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SignOut } from 'phosphor-react'
import { toast } from 'sonner'

import { getCurrentUsage } from '../api/get-current-usage'
import { bytesToMB } from '../util/converter'
import { Progress } from './progress'
import { AvatarSkeleton } from './skeleton/avatar-skeleton'

interface AvatarProps {
  firstName: string
  email: string
}

export function Avatar({ firstName, email }: AvatarProps) {
  const router = useRouter()

  const firstLetter = firstName ? firstName[0].toUpperCase() : null

  const { data: currentUsage } = useQuery({
    queryKey: ['current-usage'],
    queryFn: getCurrentUsage,
  })

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
          className="m-auto mr-4 flex min-w-[150px] flex-col items-start gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg transition-all duration-1000 ease-in-out"
        >
          <DropdownMenu.Arrow className="fill-gray-200" />

          <DropdownMenu.Label className="flex w-full flex-col items-center justify-center">
            <span className="text-md font-medium text-gray-700">
              Hi,{' '}
              <span className="font-semibold text-gray-800">{firstName}</span>!
            </span>

            <span className="text-sm text-gray-500">({email})</span>
          </DropdownMenu.Label>

          <DropdownMenu.Separator className="h-[1px] w-full bg-gray-300" />

          <div className="mx-auto flex flex-col items-center gap-1">
            <DropdownMenu.Label className="flex w-full items-center justify-center">
              <span className="text-sm font-medium text-gray-500">Usage</span>
            </DropdownMenu.Label>
            <div className="flex flex-col items-center gap-1">
              <Progress
                progress={
                  currentUsage?.maxStorage
                    ? (currentUsage?.currentUsage / currentUsage?.maxStorage) *
                      100
                    : 0
                }
              />
              <span className="text-sm font-normal text-gray-600">
                {bytesToMB(currentUsage?.currentUsage ?? 0)} MB of{' '}
                {bytesToMB(currentUsage?.maxStorage ?? 0)} MB used
              </span>
            </div>
          </div>

          <DropdownMenu.Separator className="h-[1px] w-full bg-gray-300" />

          {options.map((option) => (
            <DropdownMenu.Item
              key={option.label}
              className="group w-full rounded-sm px-2 outline-none transition-colors duration-300"
            >
              <button
                className="flex w-full items-center justify-between text-gray-600 outline-none transition-colors duration-300 group-hover:text-gray-900"
                onClick={option.onClick}
              >
                {option.label}
                <option.Icon className="size-4 transition-colors duration-300 group-hover:text-gray-900" />
              </button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
