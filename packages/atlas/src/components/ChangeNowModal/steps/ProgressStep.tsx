import styled from '@emotion/styled'
import QRCode from 'qrcode.react'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { SvgActionChevronR, SvgAlertsSuccess24 } from '@/assets/icons'
import { TransactionData } from '@/components/ChangeNowModal/steps/SummaryStep'
import { FlexBox } from '@/components/FlexBox'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { atlasConfig } from '@/config'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, sizes, square } from '@/styles'
import { changeNowService } from '@/utils/ChangeNowService'

import { ChangeNowModalStep, CommonProps } from './types'

const sellSteps = [
  [
    'Awaiting payment',
    'Transaction is being processed by ChangeNOW. If automatic transaction failed create a new exchange after 20 minutes or make a transfer manually.',
  ],
  ['Confirming payment', 'We have seen your transaction. It is now being confirmed by ChangeNOW.'],
  ['Exchanging', 'Your transaction has been confirmed. The exchange process is currently underway.'],
  ['Sending funds', 'The exchange is complete. Your funds are now being sent to your wallet.'],
]

const buySteps = [
  ['Awaiting payment', 'Send funds to address below'],
  ['Confirming payment', 'We have seen your transaction. It is now being confirmed by ChangeNOW.'],
  ['Exchanging', 'Your transaction has been confirmed. The exchange process is currently underway.'],
  ['Sending funds', 'The exchange is complete. Your funds are now being sent to your wallet.'],
]

const StyledSvgAlertsSuccess24 = styled(SvgAlertsSuccess24)`
  ${square(24)}
`

const successText = (
  <FlexBox>
    <StyledSvgAlertsSuccess24 />
    <Text variant="h400" as="h3">
      Success! Your swap is completed. You can view all details on your swap dashboard.
    </Text>
  </FlexBox>
)

type ProgressStepProps = {
  transactionData: TransactionData
} & CommonProps

export const ProgressStep = ({
  transactionData,
  type,
  setPrimaryButtonProps,
  goToStep,
  onClose,
}: ProgressStepProps) => {
  const [retry, setRetry] = useState(true)
  const isSellingJoy = type === 'sell'
  const steps = isSellingJoy ? sellSteps : buySteps
  const { trackChangenowTokenSold, trackChangenowTokenBought } = useSegmentAnalytics()
  const { memberId } = useUser()
  const { data } = useQuery(
    ['getTransactionStatus', transactionData.id],
    () => changeNowService.getTransactionStatus(transactionData.id).then((res) => res.data),
    {
      refetchInterval: retry ? 20_000 : undefined,
      onSuccess: (data) => {
        if (data.status === 'failed') {
          goToStep(ChangeNowModalStep.FAILED)
        }
      },
    }
  )

  // [currentStep, description, extra content]
  const [currentStep, description, extraContent] = useMemo(() => {
    if (!data) return [-1, '', null]

    let step = -1
    let extraContent = null
    switch (data.status) {
      case 'new':
      case 'waiting':
        step = transactionData.hasAutomaticTransactionSucceeded ? 1 : 0
        // hasAutomaticTransactionSucceeded will only be true if tx succeeded and user is selling joys
        extraContent = transactionData.hasAutomaticTransactionSucceeded ? null : (
          <FlexBox flow="column" gap={4}>
            <FlexBox flow="column">
              <FlexBox alignItems="center">
                <SingleRowText variant="h400" as="h4" color="colorText">
                  Amount to send:
                </SingleRowText>
                <Text variant="h400" as="h4">
                  {data.amountFrom ?? data.expectedAmountFrom}{' '}
                  {isSellingJoy ? atlasConfig.joystream.tokenTicker : data.fromCurrency.toUpperCase()}
                </Text>
              </FlexBox>

              <FlexBox alignItems="center">
                <SingleRowText variant="h400" as="h4" color="colorText">
                  Payment address:
                </SingleRowText>
                <CopyAddressButton size="big" address={data.payinAddress} truncate={false} />
              </FlexBox>
            </FlexBox>

            <QrCodeContainer>
              <QRCode value={data.payinAddress} />
            </QrCodeContainer>
          </FlexBox>
        )
        break
      case 'confirming':
        step = 1
        break
      case 'exchanging':
        step = 2
        break
      case 'sending':
        step = 3
        break
      case 'finished':
        setRetry(false)
        isSellingJoy
          ? trackChangenowTokenSold(atlasConfig.joystream.tokenTicker, memberId || 'N/A', data.amountTo)
          : trackChangenowTokenBought(atlasConfig.joystream.tokenTicker, memberId || 'N/A', data.amountFrom)
        setPrimaryButtonProps({
          text: 'Close',
          onClick: () => onClose(),
        })
        step = steps.length
        extraContent = successText
    }
    return [step, steps[step]?.[1], extraContent]
  }, [
    data,
    isSellingJoy,
    memberId,
    onClose,
    setPrimaryButtonProps,
    steps,
    trackChangenowTokenBought,
    trackChangenowTokenSold,
    transactionData.hasAutomaticTransactionSucceeded,
  ])

  return (
    <FlexBox gap={6} flow="column">
      <StepperContainer>
        {steps.map(([stepText], idx) => (
          <>
            {idx > 0 ? <SvgActionChevronR className="chevron" /> : null}
            <StyledStep
              number={idx + 1}
              hideStepNumberText={currentStep !== idx}
              title={currentStep === idx ? stepText : ''}
              variant={currentStep < idx ? 'future' : currentStep === idx ? 'current' : 'completed'}
            />
          </>
        ))}
      </StepperContainer>
      <Text variant="h400" as="h4">
        {description}
      </Text>
      {extraContent}
      <FlexBox justifyContent="space-between" alignItems="center">
        <Text variant="t200" as="p" color="colorText">
          Exchange ID:
        </Text>
        <TextButton
          variant="secondary"
          onClick={() => window.open(`https://changenow.io/exchange/txs/${transactionData.id}`, '_blank')}
        >
          {transactionData.id}
        </TextButton>
      </FlexBox>
    </FlexBox>
  )
}

const StyledStep = styled(Step)`
  width: auto;
  margin-left: ${sizes(2)};
`

const SingleRowText = styled(Text)`
  white-space: nowrap;
`

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${cVar('colorBackgroundAlpha')};
  width: calc(100% + ${sizes(12)});
  margin: ${sizes(-6)} ${sizes(-6)} 0 ${sizes(-6)};
  padding: ${sizes(4)};

  .chevron {
    ${square(16)}
    path {
      fill: ${cVar('colorTextMuted')};
    }
  }
`

const QrCodeContainer = styled.div`
  display: grid;
  width: 100%;
  place-items: center;
  padding: ${sizes(6)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};

  canvas {
    border: 10px solid white;
  }
`
