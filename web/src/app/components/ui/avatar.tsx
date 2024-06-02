import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { SignOut } from 'phosphor-react'

interface AvatarProps {
  firstName: string
}

export function Avatar({ firstName }: AvatarProps) {
  const router = useRouter()

  const firstLetter = firstName ? firstName[0].toUpperCase() : 'U'


  async function handleSignOut() {
    router.replace('/sign-in')
  }

  const options = [
    // {
    //   label: 'Edit profile',
    //   Icon: Pen,
    //   onClick: () => {}
    // },
    {
      label: 'Sign out',
      Icon: SignOut,
      onClick: handleSignOut
    },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center size-8 bg-gray-700 text-white rounded-full">
          {firstLetter}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={1}
          className='flex flex-col gap-2 items-start m-auto bg-white rounded-md shadow-lg p-2 min-w-[150px] border border-gray-200 transition-all ease-in-out duration-1000'
        >
          <DropdownMenu.Arrow className="fill-gray-700" />

          {options.map(option => (
            <DropdownMenu.Item
              key={option.label}
              className='w-full group hover:bg-gray-700 px-2 rounded-sm transition-colors duration-300 outline-none'
            >
              <button
                className='w-full flex justify-between items-center outline-none text-gray-600 group-hover:text-gray-50 transition-colors duration-300'
                onClick={option.onClick}
              >
                {option.label}
                <option.Icon className='group-hover:text-gray-50 transition-colors duration-300 size-4' />
              </button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>

    </DropdownMenu.Root>
  )
}