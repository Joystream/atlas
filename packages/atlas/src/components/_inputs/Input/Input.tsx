import React, { forwardRef, useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Button, ButtonProps } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { ConsoleLogger } from '@/utils/logs'

import { InputContainer, NodeContainer, TextInput } from './Input.styles'

import { InputSize } from '../inputs.utils'

export type InputProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'number'
  value?: string | number
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  defaultValue?: string
  autoComplete?: 'off'
  error?: boolean
  disabled?: boolean
  size?: InputSize
  processing?: boolean
  nodeStart?: React.ReactNode
  actionButton?: ButtonProps
  nodeEnd?: React.ReactNode
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
    placeholder,
    defaultValue,
    nodeStart,
    processing,
    autoComplete,
    className,
    nodeEnd,
    actionButton,
  },
  ref
) => {
  const { ref: nodeLeftRef, width: nodeLeftBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })
  const { ref: nodeRightRef, width: nodeRightBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })

  const inputRef = useRef<HTMLInputElement>(null)

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

  if (actionButton && nodeEnd) {
    ConsoleLogger.warn('Input: actionButton and nodeEnd are mutually exclusive. nodeEnd will be ignored.')
  }

  return (
    <InputContainer as="label" variant={size === 'large' ? 't300' : 't200'} className={className}>
      <TextInput
        inputSize={size}
        error={error}
        leftNodeWidth={nodeLeftBoundsWidth}
        rightNodeWidth={nodeRightBoundsWidth}
        autoComplete={autoComplete}
        ref={mergeRefs([inputRef, ref])}
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
        tabIndex={disabled ? -1 : 0}
        defaultValue={defaultValue}
      />
      {nodeStart && (
        <NodeContainer onClick={() => inputRef.current?.focus()} size={size} ref={nodeLeftRef} left disabled={disabled}>
          {nodeStart}
        </NodeContainer>
      )}
      {(nodeEnd || actionButton || processing) && (
        <NodeContainer
          onClick={() => inputRef.current?.focus()}
          size={size}
          ref={nodeRightRef}
          disabled={disabled}
          isButton={!!actionButton}
        >
          {processing && <Loader variant="xsmall" />}
          {actionButton ? <Button {...actionButton} variant="tertiary" disabled={disabled} size="small" /> : nodeEnd}
        </NodeContainer>
      )}
    </InputContainer>
  )
}

export const Input = forwardRef(InputComponent)

Input.displayName = 'Input'
