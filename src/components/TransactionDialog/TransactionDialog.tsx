import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ActionDialogProps } from '@/components/ActionDialog'
import { ActionDialog } from '@/components/ActionDialog'
import { ExtrinsicStatus } from '@/joystream-lib'
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
        width: 216,
        height: 216,
      },
      loop: true,
    },
  },
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ status, onClose, ...actionDialogProps }) => {
  const [polkadotLogoVisible, setPolkadotLogoVisible] = useState(false)
  const stepDetails =
    status != null && status !== ExtrinsicStatus.Error
      ? TRANSACTION_STEPS_DETAILS[status === ExtrinsicStatus.Completed ? ExtrinsicStatus.Syncing : status]
      : null

  useEffect(() => {
    if (status) {
      setPolkadotLogoVisible(false)
    }
  }, [status])

  const canCancel =
    status === ExtrinsicStatus.ProcessingAssets ||
    status === ExtrinsicStatus.Unsigned ||
    status === ExtrinsicStatus.Completed

  const transactionSteps = Object.values(TRANSACTION_STEPS_DETAILS)

  return (
    <ActionDialog
      showDialog={!!stepDetails}
      secondaryButton={{ text: 'Cancel', onClick: onClose, disabled: !canCancel }}
      exitButton={false}
      illustration
      {...actionDialogProps}
    >
      <StepsBar>
        {transactionSteps.map(({ tooltip }, idx) => (
          <Tooltip key={idx} text={tooltip} placement="top-end">
            <Step
              loop={stepDetails?.animation.loop}
              past={!!status && idx < status && status !== idx}
              isActive={!!status && status === idx}
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
            size={stepDetails?.animation.size}
            onComplete={() => !stepDetails?.animation.loop && setPolkadotLogoVisible(true)}
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
        <StyledTitleText variant="h4">{stepDetails?.title}</StyledTitleText>
        <StyledDescriptionText variant="body2">{stepDetails?.description}</StyledDescriptionText>
      </TextContainer>
    </ActionDialog>
  )
}
