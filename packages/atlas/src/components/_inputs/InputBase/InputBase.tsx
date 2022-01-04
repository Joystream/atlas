import React from 'react'

import { HelperText } from '@/components/HelperText/HelperText'

import { FormGroup, LabelText } from './InputBase.styles'

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
      {label && <LabelText variant="h300">{label}</LabelText>}
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
