import { FC, FormEvent, PropsWithChildren, ReactNode } from 'react'

import { SvgAlertsInformative24, SvgAlertsInformative32, SvgAlertsWarning24, SvgAlertsWarning32 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import { Dialog } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { HeaderIconContainer, InformativeIconWrapper } from './AlertDialogModal.styles'

type DialogButtonProps = PropsWithChildren<{
  text: string
  disabled?: boolean
  onClick?: (e?: MouseEvent) => void
}> &
  Omit<ButtonProps, 'children'>

export type AlertDialogProps = PropsWithChildren<{
  title?: ReactNode
  description?: ReactNode
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  className?: string
  onSubmit?: (e?: FormEvent) => void
  type?: 'destructive' | 'warning' | 'informative'
  noIcon?: boolean
  headerIcon?: ReactNode
  onExitClick?: () => void
  dividers?: boolean
}>

export type AlertDialogModalProps = Pick<ModalProps, 'show' | 'additionalActionsNode'> & AlertDialogProps

export const AlertDialogModal: FC<AlertDialogModalProps> = ({
  show,
  onExitClick,
  primaryButton,
  secondaryButton,
  description,
  title,
  children,
  type = 'informative',
  noIcon,
  headerIcon,
  ...dialogProps
}) => {
  const smMatch = useMediaMatch('sm')
  const isInformative = type === 'informative'
  const primaryButtonColor = isInformative ? 'primary' : type

  return (
    <Modal show={show} onClickOutside={() => secondaryButton?.onClick?.() || onExitClick?.()} onExitClick={onExitClick}>
      <Dialog
        {...dialogProps}
        primaryButton={primaryButton ? { ...primaryButton, variant: primaryButtonColor } : undefined}
        secondaryButton={secondaryButton}
      >
        <>
          {!noIcon &&
            (headerIcon || (
              <HeaderIconContainer>
                <InformativeIconWrapper variant={type}>
                  {smMatch ? (
                    isInformative ? (
                      <SvgAlertsInformative32 />
                    ) : (
                      <SvgAlertsWarning32 />
                    )
                  ) : isInformative ? (
                    <SvgAlertsInformative24 />
                  ) : (
                    <SvgAlertsWarning24 />
                  )}
                </InformativeIconWrapper>
              </HeaderIconContainer>
            ))}
          {title && (
            <Text as="h1" variant={smMatch ? 'h500' : 'h400'} margin={{ bottom: 2 }}>
              {title}
            </Text>
          )}
          <Text as="p" variant="t200" color="colorText">
            {description}
          </Text>
        </>
      </Dialog>
    </Modal>
  )
}
