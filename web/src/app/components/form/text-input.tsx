import { InputHTMLAttributes } from "react"
import { Label } from "./label"

type InputCustomProps = {
  label?: string
  labelId?: string
}

type InputProps = InputCustomProps & InputHTMLAttributes<HTMLInputElement>

export function TextInput(props: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {props.label && <Label htmlFor={props.labelId}>{props.label}</Label>}
      <input
        {...props}
        className="w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-950"
        id={props.labelId}
      />
    </div>
  )
}