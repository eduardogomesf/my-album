import { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  return (
    <label {...props} className="md:text-md text-sm font-medium text-gray-600">
      {props.children}
    </label>
  )
}
