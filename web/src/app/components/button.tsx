import clsx from "clsx"
import { ButtonHTMLAttributes, forwardRef } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  contrast?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, contrast = false, ...props }, ref) => {
    return (
      <button
        className={clsx(
          "flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 transition duration-150 ease-in-out",
          !contrast && "bg-gray-700 hover:bg-gray-800 text-gray-50",
          contrast && "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }