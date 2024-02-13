import { FC, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionCheck, SvgLogoPolkadot } from '@/assets/icons'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import { ErrorCode } from '@/joystream-lib/errors'
import { ExtrinsicStatus } from '@/joystream-lib/types'
import { useOverlayManager } from '@/providers/overlayManager'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { getExtrinsicStatusDetails } from './TransactionModal.constants'
import {
  Step,
  StepsBar,
  StyledDialog,
  StyledIconWrapper,
  StyledModal,
  StyledTransactionIllustration,
  SuccessBackground,
  SuccessIcon,
  SuccessWrapper,
  WalletInfoWrapper,
  WalletLogo,
} from './TransactionModal.styles'

export type TransactionModalProps = {
  status: ExtrinsicStatus | null
  onClose: () => void
  className?: string
  errorCode?: ErrorCode | null
}

export const TransactionModal: FC<TransactionModalProps> = ({ onClose, status, className, errorCode }) => {
  const [walletLogoVisible, setWalletLogoVisible] = useState(false)
  const { decrementOverlaysOpenCount } = useOverlayManager()
  const [initialStatus, setInitialStatus] = useState<number | null>(null)
  const { wallet } = useWallet()
  const nonUploadTransaction = initialStatus === ExtrinsicStatus.Unsigned
  const error = status === ExtrinsicStatus.Error
  const stepDetails =
    status != null
      ? getExtrinsicStatusDetails(
          status === ExtrinsicStatus.Completed ? ExtrinsicStatus.Syncing : status,
          errorCode,
          wallet?.title
        )
      : null

  useEffect(() => {
    if (status !== null && initialStatus === null) {
      setInitialStatus(status)
    }
    if (status === null) {
      setInitialStatus(null)
    }
    if (status) {
      setWalletLogoVisible(false)
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
    ].includes(status)

  const transactionSteps = createPlaceholderData(nonUploadTransaction ? 3 : 4)

  useEffect(() => {
    return () => {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount])

  // @ts-ignore different wallet types before lib integration
  const walletLogo = wallet?.logo ? wallet.logo.src : wallet.metadata.logoUrl || null

  return (
    <StyledModal show={!!stepDetails} className={className}>
      <StepsBar>
        {transactionSteps.map((_, idx) => (
          <Step
            loop={stepDetails?.animation?.loop}
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
          in={walletLogoVisible}
          timeout={200}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <WalletInfoWrapper>
            <StyledIconWrapper
              icon={walletLogo ? <WalletLogo src={walletLogo} alt={wallet?.logo?.alt} /> : <SvgLogoPolkadot />}
            />
            <Text as="span" color="colorText" variant="t100">
              Continue in {wallet?.title}
            </Text>
          </WalletInfoWrapper>
        </CSSTransition>
        {!walletLogoVisible && status !== ExtrinsicStatus.Completed && stepDetails && (
          <LottiePlayer
            loop={stepDetails.animation.loop}
            data={stepDetails.animation.data}
            size={stepDetails.animation.size}
            onComplete={() =>
              !stepDetails?.animation?.loop && status === ExtrinsicStatus.Unsigned && setWalletLogoVisible(true)
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
      <StyledDialog
        title={stepDetails?.title}
        secondaryButton={{
          text: status && [ExtrinsicStatus.Error, ExtrinsicStatus.Completed].includes(status) ? 'Close' : 'Cancel',
          onClick: onClose,
          disabled: !canCancel,
        }}
      >
        <Text as="span" variant="t200" color="colorText">
          {stepDetails?.description}
        </Text>
      </StyledDialog>
    </StyledModal>
  )
}
