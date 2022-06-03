import React, { forwardRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import { Loader } from '@/components/_loaders/Loader'

import { InputContainer, InputSize, NodeContainer, TextInput } from './Input.styles'

export type InputProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'number'
  value?: string | number
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  placeholder?: string
  defaultValue?: string
  nodeStart?: React.ReactNode
  nodeEnd?: React.ReactNode
  autoComplete?: 'off'
  error?: boolean
  disabled?: boolean
  size?: InputSize
  processing?: boolean
}

const InputComponent: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    name,
    size = 'large',
    type = 'text',
    onKeyDown,
    value,
    onChange,
    onBlur,
    onFocus,
    onWheel,
    error,
    disabled,
    required,
    placeholder,
    defaultValue,
    nodeStart,
    nodeEnd,
    processing,
    autoComplete,
    className,
  },
  ref
) => {
  const { ref: nodeLeftRef, width: nodeLeftBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })
  const { ref: nodeRightRef, width: nodeRightBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })

  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    if (onWheel) {
      onWheel(event)
      return
    }
    const target = event.target as HTMLInputElement
    target.blur()

    setTimeout(() => {
      target.focus()
    }, 0)
  }

  return (
    <InputContainer as="div" variant={size === 'large' ? 't300' : 't200'} className={className}>
      {nodeStart && (
        <NodeContainer size={size} ref={nodeLeftRef} left>
          {nodeStart}
        </NodeContainer>
      )}
      <TextInput
        inputSize={size}
        error={error}
        leftNodeWidth={nodeLeftBoundsWidth}
        rightNodeWidth={nodeRightBoundsWidth}
        autoComplete={autoComplete}
        ref={ref}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onWheel={handleWheel}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type}
        required={required}
        tabIndex={disabled ? -1 : 0}
        defaultValue={defaultValue}
      />
      {(nodeEnd || processing) && (
        <NodeContainer size={size} ref={nodeRightRef}>
          {processing && <Loader variant="xsmall" />}
          {nodeEnd}
        </NodeContainer>
      )}
    </InputContainer>
  )
}

export const Input = forwardRef(InputComponent)

Input.displayName = 'Input'
