import { LabelHTMLAttributes } from "react"

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  return (
    <label {...props} className="text-sm md:text-md text-gray-600 font-medium">
      {props.children}
    </label>
  )
}