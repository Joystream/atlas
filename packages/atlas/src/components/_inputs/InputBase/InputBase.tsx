import { FC, PropsWithChildren } from 'react'

import { HelperText } from '@/components/HelperText'

import { FormGroup, LabelText } from './InputBase.styles'

export type InputBaseProps = PropsWithChildren<{
  error?: boolean
  warning?: boolean
  helperText?: string | null
  disabled?: boolean
  className?: string
  label?: string
  isSelect?: boolean
  charactersCount?: number
  maxLength?: number
}>

export const InputBase: FC<InputBaseProps> = ({
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
