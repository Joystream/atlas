import { FC, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import { SvgActionCheck } from '@/components/_icons'
import { JOYSTREAM_STORAGE_DISCORD_URL } from '@/config/urls'
import { ErrorCode, ExtrinsicStatus } from '@/joystream-lib'
import { useUser, useUserStore } from '@/providers/user'
import { transitions } from '@/styles'

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
  const [polkadotLogoVisible, setPolkadotLogoVisible] = useState(false)
  const [initialStatus, setInitialStatus] = useState<number | null>(null)
  const userWalletName = useUserStore((state) => state.wallet?.title)
  const nonUploadTransaction = initialStatus === ExtrinsicStatus.Unsigned
  const error = status === ExtrinsicStatus.Error
  const stepDetails =
    status != null
      ? getExtrinsicStatusDetails(
          status === ExtrinsicStatus.Completed ? ExtrinsicStatus.Syncing : status,
          errorCode,
          userWalletName
        )
      : null
  const { channelId } = useUser()
  const wallet = useUserStore((state) => state.wallet)

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
    ].includes(status)

  const transactionSteps = Array.from({ length: nonUploadTransaction ? 3 : 4 })

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
          in={polkadotLogoVisible}
          timeout={200}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <WalletInfoWrapper>
            <StyledIconWrapper icon={<WalletLogo src={wallet?.logo.src} alt={wallet?.logo.alt} />} />
            <Text as="span" color="colorText" variant="t100">
              Continue in {wallet?.title}
            </Text>
          </WalletInfoWrapper>
        </CSSTransition>
        {!polkadotLogoVisible && status !== ExtrinsicStatus.Completed && stepDetails && (
          <LottiePlayer
            loop={stepDetails.animation.loop}
            data={stepDetails.animation.data}
            size={stepDetails.animation.size}
            onComplete={() =>
              !stepDetails?.animation?.loop && status === ExtrinsicStatus.Unsigned && setPolkadotLogoVisible(true)
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
        primaryButton={
          status === ExtrinsicStatus.Error && errorCode === ErrorCode.VoucherSizeLimitExceeded
            ? {
                text: 'Open Discord',
                to: JOYSTREAM_STORAGE_DISCORD_URL,
              }
            : undefined
        }
        secondaryButton={{
          text: status && [ExtrinsicStatus.Error, ExtrinsicStatus.Completed].includes(status) ? 'Close' : 'Cancel',
          onClick: onClose,
          disabled: !canCancel,
        }}
      >
        <Text as="span" variant="t200" color="colorText">
          {status === ExtrinsicStatus.Error && errorCode === ErrorCode.VoucherSizeLimitExceeded && channelId
            ? `${stepDetails?.description} Channel ID: ${channelId}`
            : stepDetails?.description}
        </Text>
      </StyledDialog>
    </StyledModal>
  )
}
