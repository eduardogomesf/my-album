'use client'

import { Link } from 'phosphor-react'

export function Footer() {
  return (
    <footer className="absolute bottom-0 w-full border-t-2 bg-white px-8 py-4">
      <div className="flex w-full flex-col items-center justify-around gap-3 md:flex-row">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-red-600">
            This website is a personal project and not a real product.
          </span>
        </div>

        <span className="text-sm font-medium text-gray-600">
          © {new Date().getFullYear()} MyAlbum. All rights reserved.
        </span>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/eduardogomesf/my-album"
            target="_blank"
            className="text-sm font-medium text-gray-800 transition duration-300 ease-in-out hover:text-gray-800 hover:underline md:text-gray-600"
            rel="noreferrer"
          >
            See project on Github
          </a>
          <Link className="h-4 w-4 font-medium text-gray-800 hover:text-gray-800 md:text-gray-600" />
        </div>
      </div>
    </footer>
  )
}
