import { FC, PropsWithChildren } from 'react'

import { FormGroup } from './InputBase.styles'

export type InputBaseProps = PropsWithChildren<{
  error?: boolean
  disabled?: boolean
  className?: string
  charactersCount?: number
  maxLength?: number
}>

export const InputBase: FC<InputBaseProps> = ({ children, error, disabled, className }) => {
  return (
    <FormGroup disabled={disabled} className={className} error={error}>
      {children}
    </FormGroup>
  )
}
