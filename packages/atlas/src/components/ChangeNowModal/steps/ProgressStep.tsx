import styled from '@emotion/styled'
import QRCode from 'qrcode.react'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { SvgActionChevronR, SvgAlertsSuccess24 } from '@/assets/icons'
import { TransactionData } from '@/components/ChangeNowModal/steps/SummaryStep'
import { FlexBox } from '@/components/FlexBox'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { atlasConfig } from '@/config'
import { cVar, sizes, square } from '@/styles'
import { changeNowService } from '@/utils/ChangeNowService'

import { CommonProps } from './types'

const sellSteps = [
  [
    'Awaiting payment',
    'Transaction is being confirmed by ChangeNOW. If automatic transaction failed create a new exchange after 20 minutes or make a transfer manually.',
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

export const ProgressStep = ({ transactionData, type, setPrimaryButtonProps }: ProgressStepProps) => {
  const [retry, setRetry] = useState(true)
  const isSellingJoy = type === 'sell'
  const steps = isSellingJoy ? sellSteps : buySteps
  const { data } = useQuery(
    ['getTransactionStatus', transactionData.id],
    () => changeNowService.getTransactionStatus(transactionData.id).then((res) => res.data),
    {
      refetchInterval: retry ? 10_000 : undefined,
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
        step = 0
        extraContent = (
          <FlexBox flow="column" gap={4}>
            <FlexBox flow="column">
              <FlexBox alignItems="center">
                <Text variant="h400" as="h4" color="colorText">
                  Amount to send:
                </Text>
                <Text variant="h400" as="h4">
                  {data.amountFrom ?? data.expectedAmountFrom}{' '}
                  {isSellingJoy ? atlasConfig.joystream.tokenTicker : data.fromCurrency.toUpperCase()}
                </Text>
              </FlexBox>

              <FlexBox alignItems="center">
                <Text variant="h400" as="h4" color="colorText">
                  Payment address:
                </Text>
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
        setPrimaryButtonProps({
          text: 'Close',
          onClick: () => undefined,
        })
        step = steps.length
        extraContent = successText
    }
    return [step, steps[step]?.[1], extraContent]
  }, [data, isSellingJoy, setPrimaryButtonProps, steps])

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
        <CopyAddressButton address={transactionData.id} />
      </FlexBox>
    </FlexBox>
  )
}

const StyledStep = styled(Step)`
  width: auto;
  margin-left: ${sizes(2)};
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
