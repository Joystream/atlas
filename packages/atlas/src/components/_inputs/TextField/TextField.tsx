import React, { forwardRef } from 'react'
import useMeasure from 'react-use-measure'

import { InputBase, InputBaseProps } from '@/components/_inputs/InputBase'

import { NodeContainer, TextFieldContainer, TextInput } from './TextField.styles'

export type TextFieldProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search'
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  placeholder?: string
  defaultValue?: string
  nodeStart?: React.ReactNode
  nodeEnd?: React.ReactNode
} & InputBaseProps

const TextFieldComponent: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (
  {
    name,
    type = 'text',
    onKeyDown,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    disabled,
    required,
    placeholder,
    defaultValue,
    nodeStart,
    nodeEnd,
    ...inputBaseProps
  },
  ref
) => {
  const [nodeLeftRef, nodeLeftBounds] = useMeasure()
  const [nodeRightRef, nodeRightBounds] = useMeasure()
  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps}>
      <TextFieldContainer>
        {nodeStart && (
          <NodeContainer ref={nodeLeftRef} left>
            {nodeStart}
          </NodeContainer>
        )}
        <TextInput
          leftNodeWidth={nodeLeftBounds.width}
          rightNodeWidth={nodeRightBounds.width}
          ref={ref}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          type={type}
          required={required}
          tabIndex={disabled ? -1 : 0}
          defaultValue={defaultValue}
        />
        {nodeEnd && <NodeContainer ref={nodeRightRef}>{nodeEnd}</NodeContainer>}
      </TextFieldContainer>
    </InputBase>
  )
}

export const TextField = forwardRef(TextFieldComponent)

TextField.displayName = 'TextField'
