import {
  ChangeEvent,
  FocusEvent,
  ForwardRefRenderFunction,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  WheelEvent,
  forwardRef,
  useRef,
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { ConsoleLogger } from '@/utils/logs'

import { InputContainer, NodeContainer, TextInput } from './Input.styles'

import { InputSize } from '../inputs.utils'

export type InputProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'number'
  value?: string | number
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onWheel?: (event: WheelEvent<HTMLInputElement>) => void
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  defaultValue?: string
  autoComplete?: 'off' | 'new-password'
  error?: boolean
  disabled?: boolean
  size?: InputSize
  processing?: boolean
  nodeStart?: ReactNode
  actionButton?: Omit<ButtonProps, 'variant' | 'size'> & { dontFocusOnClick?: boolean; tooltipText?: string }
  nodeEnd?: ReactNode
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
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
    onClick,
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

  const isNodeStartText = nodeStart && typeof nodeStart === 'string'
  const isNodeEndText = nodeEnd && typeof nodeEnd === 'string'

  const renderedNodeStart = isNodeStartText ? (
    <Text as="span" variant={size === 'large' ? 't300' : 't200'} color="colorTextMuted">
      {nodeStart}
    </Text>
  ) : (
    nodeStart
  )

  const renderedNodeEnd = isNodeEndText ? (
    <Text as="span" variant={size === 'large' ? 't300' : 't200'} color="colorTextMuted">
      {nodeEnd}
    </Text>
  ) : (
    nodeEnd
  )

  const handleWheel = (event: WheelEvent<HTMLInputElement>) => {
    if (onWheel) {
      onWheel(event)
      return
    }
    if (type !== 'number') {
      return // goal of following code is to disabled scroll inside number inputs that can change value
    }
    const target = event.target as HTMLInputElement
    target.blur()

    setTimeout(() => {
      target.focus()
    }, 0)
  }

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!actionButton?.dontFocusOnClick) {
      inputRef.current?.focus()
    }
    e.currentTarget.blur()
    actionButton?.onClick?.(e)
  }

  if (actionButton && nodeEnd) {
    ConsoleLogger.error('Input: actionButton and nodeEnd are mutually exclusive. nodeEnd will be ignored.')
  }

  return (
    <InputContainer size={size} className={className}>
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
        onClick={onClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type}
        tabIndex={disabled ? -1 : 0}
        defaultValue={defaultValue}
      />
      <span className="border-span" />
      {nodeStart && (
        <NodeContainer size={size} onClick={() => inputRef.current?.focus()} ref={nodeLeftRef} left disabled={disabled}>
          {renderedNodeStart}
        </NodeContainer>
      )}
      {(nodeEnd || actionButton || processing) && (
        <NodeContainer size={size} ref={nodeRightRef} disabled={disabled} isButton={!!actionButton}>
          {processing && <Loader variant="xsmall" />}
          {actionButton ? (
            <Tooltip text={actionButton.tooltipText} placement="top" hideOnClick={false}>
              <Button
                {...actionButton}
                variant="tertiary"
                disabled={disabled}
                size="small"
                onClick={handleButtonClick}
              />
            </Tooltip>
          ) : (
            renderedNodeEnd
          )}
        </NodeContainer>
      )}
    </InputContainer>
  )
}

export const Input = forwardRef(InputComponent)

Input.displayName = 'Input'
