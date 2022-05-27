import {
  ChangeEvent,
  FocusEvent,
  ForwardRefRenderFunction,
  KeyboardEvent,
  ReactNode,
  WheelEvent,
  forwardRef,
} from 'react'
import useResizeObserver from 'use-resize-observer'

import { InputBase, InputBaseProps } from '@/components/_inputs/InputBase'

import { NodeContainer, TextFieldContainer, TextInput } from './TextField.styles'

export type TextFieldProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'number'
  value?: string | number
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onWheel?: (event: WheelEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  placeholder?: string
  defaultValue?: string
  nodeStart?: ReactNode
  nodeEnd?: ReactNode
  autoComplete?: 'off'
} & InputBaseProps

const TextFieldComponent: ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (
  {
    name,
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
    autoComplete,
    ...inputBaseProps
  },
  ref
) => {
  const { ref: nodeLeftRef, width: nodeLeftBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })
  const { ref: nodeRightRef, width: nodeRightBoundsWidth = 0 } = useResizeObserver({ box: 'border-box' })

  const handleWheel = (event: WheelEvent<HTMLInputElement>) => {
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
    <InputBase error={error} disabled={disabled} {...inputBaseProps}>
      <TextFieldContainer>
        {nodeStart && (
          <NodeContainer ref={nodeLeftRef} left>
            {nodeStart}
          </NodeContainer>
        )}
        <TextInput
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
        {nodeEnd && <NodeContainer ref={nodeRightRef}>{nodeEnd}</NodeContainer>}
      </TextFieldContainer>
    </InputBase>
  )
}

export const TextField = forwardRef(TextFieldComponent)

TextField.displayName = 'TextField'
