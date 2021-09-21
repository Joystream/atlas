import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ActionDialog, ActionDialogProps } from '@/components/ActionDialog'
import { ExtrinsicStatus } from '@/joystream-lib'
import errorAnimation from '@/shared/assets/animations/stepper/error.json'
import firstStepAnimation from '@/shared/assets/animations/stepper/step1.json'
import secondStepAnimation from '@/shared/assets/animations/stepper/step2.json'
import thirdStepAnimation from '@/shared/assets/animations/stepper/step3.json'
import fourthStepAnimation from '@/shared/assets/animations/stepper/step4.json'
import { Text } from '@/shared/components/Text'
import { Tooltip } from '@/shared/components/Tooltip'
import { SvgGlyphCheck } from '@/shared/icons'
import { transitions } from '@/shared/theme'

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

const TRANSACTION_STEPS_DETAILS = {
  [ExtrinsicStatus.ProcessingAssets]: {
    title: 'Processing your assets',
    description:
      "Please wait till all your assets get processed. This can take up to 1 minute, depending on asset size and your machine's computing power.",
    tooltip: 'Processing',
    animation: {
      data: firstStepAnimation,
      size: {
        width: 216,
        height: 216,
      },
      loop: true,
    },
  },
  [ExtrinsicStatus.Unsigned]: {
    title: 'Sign in Polkadot',
    description: 'Please sign the transaction using the Polkadot browser extension.',
    tooltip: 'Signature',
    animation: {
      data: secondStepAnimation,
      size: {
        width: 288,
        height: 216,
      },
      loop: false,
    },
  },
  [ExtrinsicStatus.Signed]: {
    title: 'Processing transaction',
    description:
      'Your transaction has been signed and sent. Please wait for the blockchain confirmation. This should take about 15 seconds.',
    tooltip: 'Confirmation',
    animation: {
      data: thirdStepAnimation,
      size: {
        width: 216,
        height: 216,
      },
      loop: true,
    },
  },
  [ExtrinsicStatus.Syncing]: {
    title: 'Propagating changes',
    description:
      "Your transaction has been accepted and included into the blockchain. Please wait till it's picked up by the indexing node. This should take up to 15 seconds.",
    tooltip: 'Propagation',
    animation: {
      data: fourthStepAnimation,
      size: {
        width: 144,
        height: 144,
      },
      loop: true,
    },
  },
  [ExtrinsicStatus.Error]: {
    title: 'Something went wrong...',
    description:
      'An unexpected error was encountered. If this persists, our Discord community may be a good place to find some help.',
    tooltip: 'Propagation',
    animation: {
      data: errorAnimation,
      size: {
        width: 288,
        height: 264,
      },
      loop: false,
    },
  },
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
        {transactionSteps.map(({ tooltip }, idx) => (
          <Tooltip key={idx} text={tooltip} placement="top-end">
            <Step
              loop={stepDetails?.animation.loop}
              past={
                status !== null &&
                !error &&
                idx < status - (nonUploadTransaction ? 1 : 0) &&
                status - (nonUploadTransaction ? 1 : 0) !== idx
              }
              isActive={status !== null && !error && status - (nonUploadTransaction ? 1 : 0) === idx}
            />
          </Tooltip>
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
              Continue in Polkadot
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
