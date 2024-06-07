"use client"

import Link from "next/link";
import Image from 'next/image'
import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "@/app/api/get-user-profile";
import { Avatar } from "./avatar";

export function Header() {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  return (
    <div className="bg-white w-full py-4 px-8 border-b-2">
      <header className="max-w-[1600px] m-auto flex flex-row justify-between items-center">
        <Link href={'/'} className="flex items-center gap-2 outline-none">
          <Image src='/logo.webp' alt='Logo' width={30} height={30} className="rounded-md" />
          <span className="text-lg text-gray-900 font-semibold">MyAlbum</span>
        </Link>

        <Avatar firstName={user?.firstName ?? ''} />
      </header>
    </div>
  )
}