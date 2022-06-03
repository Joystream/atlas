import React from 'react'

import { FormGroup } from './InputBase.styles'

export type InputBaseProps = {
  error?: boolean
  disabled?: boolean
  className?: string
  charactersCount?: number
  maxLength?: number
}

export const InputBase: React.FC<InputBaseProps> = ({ children, error, disabled, className }) => {
  return (
    <FormGroup disabled={disabled} className={className} error={error}>
      {children}
    </FormGroup>
  )
}
