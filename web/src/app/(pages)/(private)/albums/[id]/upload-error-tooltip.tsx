import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

type UploadErrorTooltipProps = {
  children: React.ReactNode
  message: string
}

export function UploadErrorTooltip({ children, message }: UploadErrorTooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-white p-2 rounded-md" side='right' sideOffset={5}>
            <span className='text-sm text-red-600'>{message}</span>
            <Tooltip.Arrow className="fill-red-600" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}