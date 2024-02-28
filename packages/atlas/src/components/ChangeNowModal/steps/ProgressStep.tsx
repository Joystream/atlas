import styled from '@emotion/styled'

import { SvgActionChevronR, SvgAlertsSuccess24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { cVar, sizes, square } from '@/styles'

const steps = [
  ['Confirming payment', 'We have seen your transaction. It is now being confirmed by changenow.'],
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

export const ProgressStep = () => {
  const txStep = 0
  const [, txDescription] = steps[txStep] ?? []
  return (
    <FlexBox gap={6} flow="column">
      <StepperContainer>
        {steps.map(([stepText], idx) => (
          <>
            {idx > 0 ? <SvgActionChevronR className="chevron" /> : null}
            <StyledStep
              number={idx + 1}
              hideStepNumberText={txStep !== idx}
              title={txStep === idx ? stepText : ''}
              variant={txStep < idx ? 'future' : txStep === idx ? 'current' : 'completed'}
            />
          </>
        ))}
      </StepperContainer>
      <Text variant="h400" as="h4">
        {txDescription ?? successText}
      </Text>
      <FlexBox justifyContent="space-between" alignItems="center">
        <Text variant="t200" as="p" color="colorText">
          Exchange ID:
        </Text>
        <CopyAddressButton address="dfsdf" />
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
