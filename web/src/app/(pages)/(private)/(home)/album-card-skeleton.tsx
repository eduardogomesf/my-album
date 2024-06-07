export function AlbumCardSkeleton() {
  return (
    <div
      className="animate-pulse h-40 w-full max-w-[300px] rounded-md group cursor-pointer"
    >
      <div
        className="w-full h-5/6 bg-gray-300 flex items-center justify-center rounded-t-lg"
      />

      <div></div>

      <div className="relative bg-gray-200 p-3 flex flex-col gap-2 rounded-b-lg items-start">
        <div className="w-[35%] bg-gray-300 h-3 rounded-md" />
        <div className="w-[65%] bg-gray-300 h-3 rounded-md" />
        <div className="w-[50%] bg-gray-300 h-3 rounded-md" />
      </div>
    </div >
  )
}