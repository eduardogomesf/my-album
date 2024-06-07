export function AlbumCardSkeleton() {
  return (
    <div className="group h-40 w-full max-w-[300px] animate-pulse cursor-pointer rounded-md">
      <div className="flex h-5/6 w-full items-center justify-center rounded-t-lg bg-gray-300" />

      <div></div>

      <div className="relative flex flex-col items-start gap-2 rounded-b-lg bg-gray-200 p-3">
        <div className="h-3 w-[35%] rounded-md bg-gray-300" />
        <div className="h-3 w-[65%] rounded-md bg-gray-300" />
        <div className="h-3 w-[50%] rounded-md bg-gray-300" />
      </div>
    </div>
  )
}
