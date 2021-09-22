import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ActionDialog, ActionDialogProps } from '@/components/ActionDialog'
import { ExtrinsicStatus } from '@/joystream-lib'
import { Text } from '@/shared/components/Text'
import { SvgGlyphCheck } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import { TRANSACTION_STEPS_DETAILS } from './TransactionDialog.constants'
import {
  PolkadotLogoWrapper,
  Step,
  StepsBar,
  StyledLottie,
  StyledPolkadotLogo,
  StyledSvgOutlineError,
  StyledTransactionIllustration,
  Success,
  SuccessIcon,
  TextContainer,
} from './TransactionDialog.style'

import { StyledDescriptionText, StyledTitleText } from '../MessageDialog/MessageDialog.style'

export type TransactionDialogProps = Pick<ActionDialogProps, 'className'> & {
  status: ExtrinsicStatus | null
  onClose: () => void
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ status, onClose, ...actionDialogProps }) => {
  const [polkadotLogoVisible, setPolkadotLogoVisible] = useState(false)
  const initialStatusRef = useRef<number | null>(null)
  const nonUploadTransaction = initialStatusRef.current === ExtrinsicStatus.Unsigned
  const error = status === ExtrinsicStatus.Error
  const stepDetails =
    status != null
      ? TRANSACTION_STEPS_DETAILS[status === ExtrinsicStatus.Completed ? ExtrinsicStatus.Syncing : status]
      : null

  useEffect(() => {
    if (status !== null && initialStatusRef.current === null) {
      initialStatusRef.current = status
    }
    if (status === null) {
      initialStatusRef.current = null
    }
    if (status) {
      setPolkadotLogoVisible(false)
    }
  }, [status])

  useEffect(() => {
    if (status === ExtrinsicStatus.Completed) {
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [status, onClose])

  const canCancel =
    status === ExtrinsicStatus.ProcessingAssets ||
    status === ExtrinsicStatus.Unsigned ||
    status === ExtrinsicStatus.Completed ||
    status === ExtrinsicStatus.Error

  const transactionSteps = Object.values(TRANSACTION_STEPS_DETAILS).slice(nonUploadTransaction ? 2 : 1)

  return (
    <ActionDialog
      showDialog={!!stepDetails}
      secondaryButton={{
        text: status === ExtrinsicStatus.Completed || status === ExtrinsicStatus.Error ? 'Close' : 'Cancel',
        onClick: onClose,
        disabled: !canCancel,
      }}
      exitButton={false}
      illustration
      {...actionDialogProps}
    >
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
            <Text secondary variant="caption">
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
          <Success>
            <SuccessIcon>
              <SvgGlyphCheck width={27} height={27} />
            </SuccessIcon>
          </Success>
        </CSSTransition>
      </StyledTransactionIllustration>
      <TextContainer>
        {error && <StyledSvgOutlineError />}
        <StyledTitleText variant="h4">{stepDetails?.title}</StyledTitleText>
        <StyledDescriptionText variant="body2">{stepDetails?.description}</StyledDescriptionText>
      </TextContainer>
    </ActionDialog>
  )
}
