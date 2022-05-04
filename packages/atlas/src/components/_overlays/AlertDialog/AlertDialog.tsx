import React, { FormEvent } from 'react'

import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import { SvgAlertsInformative24, SvgAlertsInformative32 } from '@/components/_icons'
import { Dialog } from '@/components/_overlays/Dialog'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { InformativeIconWrapper } from './AlertDialog.styles'

type DialogButtonProps = {
  text: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

export type AlertDialogProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  className?: string
  onSubmit?: (e?: FormEvent) => void
  type?: 'destructive' | 'warning' | 'informative'
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  children,
  onSubmit,
  type = 'informative',
}) => {
  const smMatch = useMediaMatch('sm')
  const primaryButtonColor = type === 'informative' ? 'primary' : type

  return (
    <Dialog
      primaryButton={primaryButton ? { ...primaryButton, variant: primaryButtonColor } : undefined}
      secondaryButton={secondaryButton}
      icon={
        <InformativeIconWrapper variant={type}>
          {smMatch ? <SvgAlertsInformative32 /> : <SvgAlertsInformative24 />}
        </InformativeIconWrapper>
      }
      title={title}
      onSubmit={onSubmit}
    >
      {description && (
        <Text variant="t200" secondary>
          {description}
        </Text>
      )}
      {children}
    </Dialog>
  )
}
