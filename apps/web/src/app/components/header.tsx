'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'

import { getUserProfile } from '@/app/api/get-user-profile'

import { Avatar } from './avatar'

export function Header() {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  return (
    <div className="w-full border-b-2 bg-white px-8 py-4">
      <header className="m-auto flex max-w-[1600px] flex-row items-center justify-between">
        <Link href={'/'} className="flex items-center gap-2 outline-none">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <span className="text-lg font-semibold text-gray-900">MyAlbum</span>
        </Link>

        <Avatar firstName={user?.firstName ?? ''} email={user?.email ?? ''} />
      </header>
    </div>
  )
}
