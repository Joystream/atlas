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
  helperText,
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
      {label && <LabelText variant="body2">{label}</LabelText>}
      {children}
      {helperText && (
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
