import React, { FormEvent } from 'react'

import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import { SvgAlertsInformative24, SvgAlertsInformative32 } from '@/components/_icons'
import { Dialog } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { HeaderIconContainer, InformativeIconWrapper } from './AlertDialogModal.styles'

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
  headerIcon?: React.ReactNode
  onExitClick?: () => void
  dividers?: boolean
  children?: React.ReactNode
}

export type AlertDialogModalProps = Pick<ModalProps, 'show'> & AlertDialogProps

export const AlertDialogModal: React.FC<AlertDialogModalProps> = ({
  show,
  onExitClick,
  primaryButton,
  secondaryButton,
  description,
  title,
  children,
  type = 'informative',
  headerIcon,
  ...dialogProps
}) => {
  const smMatch = useMediaMatch('sm')
  const primaryButtonColor = type === 'informative' ? 'primary' : type

  return (
    <Modal show={show} onExitClick={onExitClick}>
      <Dialog
        {...dialogProps}
        primaryButton={primaryButton ? { ...primaryButton, variant: primaryButtonColor } : undefined}
        secondaryButton={secondaryButton}
      >
        <>
          {headerIcon || (
            <HeaderIconContainer>
              <InformativeIconWrapper variant={type}>
                {smMatch ? <SvgAlertsInformative32 /> : <SvgAlertsInformative24 />}
              </InformativeIconWrapper>
            </HeaderIconContainer>
          )}
          <Text variant={smMatch ? 'h500' : 'h400'} margin={{ bottom: 2 }}>
            {title}
          </Text>
          <Text variant="t200" secondary>
            {description}
          </Text>
        </>
      </Dialog>
    </Modal>
  )
}
