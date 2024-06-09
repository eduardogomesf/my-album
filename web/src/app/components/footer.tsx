'use client'

import { Link } from "phosphor-react";

export function Footer() {
  return (
    <footer className="absolute bottom-0 w-full border-t-2 bg-white px-8 py-4">
      <div className="w-full flex flex-col md:flex-row gap-3 items-center justify-around" >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-red-600 font-medium">This website is a personal project and not a real product.</span>
        </div>

        <span className="text-sm text-gray-600 font-medium">
          © {new Date().getFullYear()} MyAlbum. All rights reserved.
        </span>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/eduardogomesf/my-album"
            target="_blank"
            className="text-sm text-gray-800 md:text-gray-600 font-medium hover:text-gray-800 hover:underline transition duration-300 ease-in-out"
          >
            See project on Github
          </a>
          <Link className="w-4 h-4 text-gray-800 md:text-gray-600 font-medium hover:text-gray-800" />
        </div>
      </div>
    </footer >
  )
}