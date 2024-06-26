'use client'

import * as RadixProgress from '@radix-ui/react-progress'

type ProgressProps = {
  progress: number
}

export function Progress({ progress = 50 }: ProgressProps) {
  return (
    <RadixProgress.Root
      className="bg-02 relative h-2 w-full overflow-hidden rounded-full bg-gray-400 md:max-w-[300px]"
      value={progress}
    >
      <RadixProgress.Indicator
        className="bg-12 h-full w-full bg-gray-500"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </RadixProgress.Root>
  )
}
