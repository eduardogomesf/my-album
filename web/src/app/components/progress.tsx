'use client'

import * as RadixProgress from '@radix-ui/react-progress'

type ProgressProps = {
  progress: number
}

export function Progress({ progress = 50 }: ProgressProps) {
  return (
    <RadixProgress.Root
      className="relative h-2 w-full overflow-hidden rounded-full bg-02 md:max-w-[300px] bg-gray-400"
      value={progress}
    >
      <RadixProgress.Indicator
        className="h-full w-full bg-12 bg-gray-500"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </RadixProgress.Root>
  )
}


// const {} = useQuery({
//   queryKey: ['current-usage'],
//   queryFn: () => {}
// })