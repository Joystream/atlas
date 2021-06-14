import React from 'react'

import { FormGroup, LabelText } from './InputBase.styles'

import { HelperText } from '../HelperText/HelperText'

export type InputBaseProps = {
  error?: boolean
  warning?: boolean
  helperText?: string | null
  disabled?: boolean
  className?: string
  label?: string
  isSelect?: boolean
  charactersCount?: number
  maxLength?: number
}

export const InputBase: React.FC<InputBaseProps> = ({
  children,
  helperText = '\u00A0',
  warning,
  error,
  disabled,
  className,
  label,
  isSelect,
  charactersCount,
  maxLength,
}) => {
  return (
    <FormGroup as={isSelect ? 'div' : 'label'} disabled={disabled} className={className} error={error}>
      {label && <LabelText>{label}</LabelText>}
      {children}
      {helperText !== null && (
        <HelperText
          warning={warning}
          error={error}
          helperText={helperText}
          charactersCount={charactersCount}
          maxLength={maxLength}
        />
      )}
    </FormGroup>
  )
}
