import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgActionCheck } from '@/components/_icons'
import { Dialog } from '@/components/_overlays/Dialog'
import { JOYSTREAM_STORAGE_DISCORD_URL } from '@/config/urls'
import { ExtrinsicStatus } from '@/joystream-lib'
import { transitions } from '@/styles'

import { TRANSACTION_STEPS_DETAILS } from './TransactionModal.constants'
import {
  PolkadotLogoWrapper,
  Step,
  StepsBar,
  StyledLottie,
  StyledModal,
  StyledPolkadotLogo,
  StyledTransactionIllustration,
  SuccessBackground,
  SuccessIcon,
  SuccessWrapper,
} from './TransactionModal.styles'

export type TransactionModalProps = {
  status: ExtrinsicStatus | null
  onClose: () => void
  className?: string
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ status, onClose, className }) => {
  const [polkadotLogoVisible, setPolkadotLogoVisible] = useState(false)
  const [initialStatus, setInitialStatus] = useState<number | null>(null)
  const nonUploadTransaction = initialStatus === ExtrinsicStatus.Unsigned
  const error = status === ExtrinsicStatus.Error
  const stepDetails =
    status != null
      ? TRANSACTION_STEPS_DETAILS[status === ExtrinsicStatus.Completed ? ExtrinsicStatus.Syncing : status]
      : null

  useEffect(() => {
    if (status !== null && initialStatus === null) {
      setInitialStatus(status)
    }
    if (status === null) {
      setInitialStatus(null)
    }
    if (status) {
      setPolkadotLogoVisible(false)
    }
  }, [initialStatus, status])

  useEffect(() => {
    if (status === ExtrinsicStatus.Completed) {
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [status, onClose])

  const canCancel =
    status &&
    [
      ExtrinsicStatus.ProcessingAssets,
      ExtrinsicStatus.Unsigned,
      ExtrinsicStatus.Completed,
      ExtrinsicStatus.Error,
      ExtrinsicStatus.VoucherSizeLimitExceeded,
    ].includes(status)

  const transactionSteps = Object.values(TRANSACTION_STEPS_DETAILS).slice(nonUploadTransaction ? 3 : 2)

  return (
    <StyledModal show={!!stepDetails} {...className}>
      <StepsBar>
        {transactionSteps.map((_, idx) => (
          <Step
            loop={stepDetails?.animation.loop}
            key={`transactionStep-${idx}`}
            past={
              status !== null &&
              !error &&
              idx < status - (nonUploadTransaction ? 1 : 0) &&
              status - (nonUploadTransaction ? 1 : 0) !== idx
            }
            isActive={status !== null && !error && status - (nonUploadTransaction ? 1 : 0) === idx}
          />
        ))}
      </StepsBar>
      <StyledTransactionIllustration>
        <CSSTransition
          in={polkadotLogoVisible}
          timeout={200}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <PolkadotLogoWrapper>
            <StyledPolkadotLogo />
            <Text secondary variant="t100">
              Continue in Polkadot extension
            </Text>
          </PolkadotLogoWrapper>
        </CSSTransition>
        {!polkadotLogoVisible && status !== ExtrinsicStatus.Completed && (
          <StyledLottie
            loop={stepDetails?.animation.loop}
            animationData={stepDetails?.animation.data}
            play
            onComplete={() =>
              !stepDetails?.animation.loop && status === ExtrinsicStatus.Unsigned && setPolkadotLogoVisible(true)
            }
          />
        )}
        <CSSTransition
          in={status === ExtrinsicStatus.Completed}
          timeout={200}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <SuccessWrapper>
            <SuccessBackground />
            <SuccessIcon>
              <SvgActionCheck width={27} height={27} />
            </SuccessIcon>
          </SuccessWrapper>
        </CSSTransition>
      </StyledTransactionIllustration>
      <Dialog
        title={stepDetails?.title}
        primaryButton={
          status === ExtrinsicStatus.VoucherSizeLimitExceeded
            ? {
                text: 'Open Discord',
                to: JOYSTREAM_STORAGE_DISCORD_URL,
              }
            : undefined
        }
        secondaryButton={{
          text:
            status &&
            [ExtrinsicStatus.Error, ExtrinsicStatus.VoucherSizeLimitExceeded, ExtrinsicStatus.Completed].includes(
              status
            )
              ? 'Close'
              : 'Cancel',
          onClick: onClose,
          disabled: !canCancel,
        }}
        description={stepDetails?.description}
      />
    </StyledModal>
  )
}
