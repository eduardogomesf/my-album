import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'

import { Label } from './label'

type InputCustomProps = {
  label?: string
  labelId?: string
  error?: string
}

type InputProps = InputCustomProps & InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelId, error, ...props }, ref) => {
    return (
      <div className="flex flex-col items-start gap-1">
        {label && <Label htmlFor={labelId}>{label}</Label>}
        <input
          className="w-full rounded-md border bg-white p-3 text-sm focus:border-gray-800 focus:outline-none"
          id={labelId}
          ref={ref}
          {...props}
        />
        <span
          className={clsx(
            'ml-2 mt-1 text-xs text-red-500 opacity-0',
            error && 'opacity-100',
          )}
        >
          {error ?? 'no-error'}
        </span>
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'

export { TextInput }
