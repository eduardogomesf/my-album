export function Footer() {
  return (
    <footer className="absolute bottom-0 w-full border-t-2 bg-white px-8 py-4">
      <div className="w-full flex items-center justify-center">
        <span className="text-sm text-gray-600 font-medium">
          © {new Date().getFullYear()} MyAlbum. All rights reserved.
        </span>
      </div>
    </footer>
  )
}