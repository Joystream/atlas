import BN from 'bn.js'
import { FC, FormEvent, PropsWithChildren, ReactNode } from 'react'

import { Fee } from '@/components/Fee'
import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import {
  SvgAlertsInformative24,
  SvgAlertsInformative32,
  SvgAlertsWarning24,
  SvgAlertsWarning32,
} from '@/components/_icons'
import { Dialog } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { TxMethodName } from '@/joystream-lib'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { useFee } from '@/providers/joystream'

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
  fee?: {
    methodName: TxMethodName
    args?: Parameters<JoystreamLibExtrinsics[TxMethodName]>
  }
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
  fee,
  ...dialogProps
}) => {
  const smMatch = useMediaMatch('sm')
  const isInformative = type === 'informative'
  const primaryButtonColor = isInformative ? 'primary' : type
  const { fullFee, loading } = useFee(fee ? fee.methodName : undefined, fee && show ? fee.args : undefined)

  return (
    <Modal show={show} onEscPress={secondaryButton?.onClick || onExitClick} onExitClick={onExitClick}>
      <Dialog
        {...dialogProps}
        primaryButton={primaryButton ? { ...primaryButton, variant: primaryButtonColor } : undefined}
        secondaryButton={secondaryButton}
        additionalActionsNode={fee && <Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
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
