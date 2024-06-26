import clsx from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  contrast?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, contrast = false, className, ...props }, ref) => {
    return (
      <button
        className={clsx(
          twMerge(
            'flex cursor-pointer items-center justify-center gap-1 rounded-md border px-2 py-1 transition duration-150 ease-in-out',
            className,
          ),
          !contrast && 'bg-gray-800 text-gray-50 hover:bg-gray-950',
          contrast && 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
