import { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react'

import { Text } from '@/components/Text'

import { CaptionText, RadioAndCheckboxLabel } from './RadioAndCheckboxBase.styles'

type RadioAndCheckboxBaseProps = PropsWithChildren<{
  disabled?: boolean
  className?: string
  label?: ReactNode
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
        <Text as="span" variant="t200" color={disabled ? 'colorText' : undefined}>
          {label}
        </Text>
      )}
      {caption && (
        <CaptionText as="span" variant="t100" color={error ? 'colorTextError' : 'colorText'}>
          {caption}
        </CaptionText>
      )}
    </RadioAndCheckboxLabel>
  )
}
