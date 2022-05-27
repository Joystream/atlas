import { FC, MouseEvent, PropsWithChildren } from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import { CaptionText, RadioAndCheckboxLabel } from './RadioAndCheckboxBase.styles'

type RadioAndCheckboxBaseProps = PropsWithChildren<{
  disabled?: boolean
  className?: string
  label?: string
  caption?: string
  error?: boolean
  onClick?: (e: MouseEvent) => void
}>

export const RadioAndCheckboxBase: FC<RadioAndCheckboxBaseProps> = ({
  disabled,
  children,
  label,
  caption,
  error,
  className,
  onClick,
}) => {
  return (
    <RadioAndCheckboxLabel hasLabel={!!label} disabled={disabled} className={className} onClick={onClick}>
      {children}
      {label && (
        <Text variant="t200" secondary={disabled}>
          {label}
        </Text>
      )}
      {caption && (
        <CaptionText variant="t100" color={error ? cVar('colorTextError') : undefined} secondary>
          {caption}
        </CaptionText>
      )}
    </RadioAndCheckboxLabel>
  )
}
