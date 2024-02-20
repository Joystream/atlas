import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import {
  SvgActionArrowRight,
  SvgActionChevronR,
  SvgActionClock,
  SvgActionCreatorToken,
  SvgActionHide,
  SvgActionLock,
  SvgAlertsInformative32,
  SvgAlertsSuccess24,
  SvgJoyTokenPrimary16,
  SvgJoyTokenPrimary24,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { TokenInput, TokenInputProps } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { cVar, sizes, square } from '@/styles'
import { Currency, changeNowService } from '@/utils/ChangeNowService'
import { shortenString } from '@/utils/misc'

import { FormField } from '../_inputs/FormField'

const PROS = [
  [<SvgActionLock key="lock" />, 'No sign up'],
  [<SvgActionHide key="hide" />, 'No KYC'],
  [<SvgActionClock key="clock" />, 'Only 2-3 minutes'],
  [<SvgActionCreatorToken key="token" />, '900+ cryptos supported'],
]

enum ChangeNowModalStep {
  INFO,
  FORM,
}

type ChangeNowModalProps = {
  type: 'buy' | 'sell' | 'refill'
}

// const options = [
//   { value: 'btc', label: 'BTC', caption: 'Bitcoin', nodeStart: <SvgActionHide /> },
//   { value: 'eth', label: 'ETH', caption: 'Ethereum', nodeStart: <SvgActionLock /> },
// ]

type CurrencyInputValues = {
  amount: number
  currency: string | undefined
}

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

export const ChangeNowModal = ({ type }: ChangeNowModalProps) => {
  const [step, setStep] = useState()
  const txStep = 3
  const [, txDescription] = steps[txStep] ?? []

  return (
    <DialogModal
      title={type === 'refill' && step === ChangeNowModalStep.INFO ? <SvgAlertsInformative32 /> : 'Buy JOY'}
      show
      dividers
      onExitClick={() => undefined}
      primaryButton={{
        text: 'Buy JOY',
      }}
      secondaryButton={{
        text: 'Cancel',
      }}
    >
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
    </DialogModal>
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

const SummaryStep = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)

  return (
    <FlexBox gap={6} flow="column">
      <Container>
        <Text variant="t400" as="p">
          25
          <SvgJoyTokenPrimary24 />
          JOY
        </Text>
        <SvgActionArrowRight />
        <Text variant="t400" as="p">
          25
          <SvgJoyTokenPrimary24 />
          JOY
        </Text>
      </Container>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Recipient wallet address
        </Text>
        <Text variant="t200" as="p">
          {shortenString('093890128389123', 3, 3)}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Estimated Arrival
        </Text>
        <Text variant="t200" as="p">
          {shortenString('093890128389123', 3, 3)}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Estimated Rate
        </Text>
        <Text variant="t200" as="p">
          {shortenString('093890128389123', 3, 3)}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="h300" as="h1" color="colorText">
          You will receive
        </Text>
        <Text variant="h300" as="h1">
          {shortenString('093890128389123', 3, 3)}
        </Text>
      </FlexBox>

      <Checkbox
        value={termsAccepted}
        onChange={(value) => setTermsAccepted(value)}
        label={
          <FlexBox>
            I accept the
            <TextButton to={absoluteRoutes.viewer.index()}>Terms of service</TextButton>
          </FlexBox>
        }
      />
    </FlexBox>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${sizes(4)};
  align-items: center;
  justify-content: space-around;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  width: 100%;

  p {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const FormStep = () => {
  const type: string = 'sell'
  const { data, isLoading } = useQuery('changenow-currency', () =>
    changeNowService.getAvailableCurrencies().then((res) => res.data)
  )
  const { control } = useForm<{
    from: CurrencyInputValues
    to: CurrencyInputValues
  }>({
    defaultValues: {
      from: {
        amount: undefined,
        currency: type === 'sell' ? 'joy' : undefined,
      },
      to: {
        amount: undefined,
        currency: type === 'buy' ? 'joy' : undefined,
      },
    },

    // toAmount: 0,
    // fromAmount: 0,
    // toCurrency: type === 'buy' ? 'joy' : undefined,
    // fromCurreny: type === 'sell' ? 'joy' : undefined,
  })

  const currencyOptions = useMemo(() => {
    return data?.map((curr) => ({
      ...curr,
      value: curr.legacyTicker,
      label: curr.ticker.toUpperCase(),
      caption: curr.name,
      nodeStart: curr.image ? <img src={curr.image} alt={curr.ticker} /> : <SvgJoyTokenPrimary16 />,
    }))
  }, [data])
  return (
    <FlexBox width="100%" gap={10} flow="column">
      <Controller
        name="from"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormField
              label="Send"
              // error={errors.amount?.message}
            >
              <CurrencyInput
                placeholder="10"
                currencies={currencyOptions}
                value={value.amount}
                lockedCurrency={type === 'sell' ? 'joy' : undefined}
                onChange={(amount) => onChange({ ...value, amount })}
                onCurrencySelect={(currency) => onChange({ ...value, currency })}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="to"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormField
              label="Receive"
              // error={errors.amount?.message}
            >
              <CurrencyInput
                placeholder="10"
                currencies={currencyOptions}
                value={value.amount}
                lockedCurrency={type === 'buy' ? 'joy' : undefined}
                onChange={(amount) => onChange({ ...value, amount })}
                onCurrencySelect={(currency) => onChange({ ...value, currency })}
              />
            </FormField>
          )
        }}
      />
    </FlexBox>
  )
}

type CurrencyInputProps = {
  currencies: ComboBoxProps<{ value: string } & Currency>['items']
  lockedCurrency?: string
  onCurrencySelect: (value: string) => void
} & TokenInputProps

const CurrencyInput = ({ currencies, onCurrencySelect, lockedCurrency, ...tokenProps }: CurrencyInputProps) => {
  const [sel, setSel] = useState<string | undefined>(undefined)
  const selected = currencies?.find((opt) => opt.value.toLowerCase() === (lockedCurrency ?? sel)?.toLowerCase())
  return (
    <InputGrid>
      <TokenInput {...tokenProps} nodeStart={<div />} nodeEnd={<div />} />
      <ComboBox
        nodeStart={selected?.nodeStart ?? <div />}
        value={selected?.label ?? sel}
        disabled={!!lockedCurrency}
        placeholder="BTC"
        onSelectedItemChange={(e) => {
          setSel(e?.legacyTicker ?? '')
          onCurrencySelect(e?.legacyTicker ?? '')
        }}
        items={currencies}
      />
    </InputGrid>
  )
}

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  width: 100%;
  grid-gap: 2px;
`

const InfomationStep = () => {
  return (
    <>
      <FlexBox gap={6} flow="column">
        <FlexBox flow="column">
          <Text variant="h500" as="h3">
            Buy JOY
          </Text>
          <Text variant="t200" color="colorText" as="h3">
            You need additional funds. Buy JOY effortlessly using ChangeNOW extension.
          </Text>
        </FlexBox>

        <FlexBox gap={2} flow="column">
          {PROS.map(([icon, text], idx) => (
            <ProsItem key={idx}>
              {icon}
              <Text variant="t300" as="p">
                {text}
              </Text>
            </ProsItem>
          ))}
        </FlexBox>
      </FlexBox>
    </>
  )
}

const ProsItem = styled.div`
  display: flex;
  padding: ${sizes(3)};
  gap: ${sizes(2)};
  align-items: center;
  width: 100%;
  border-radius: ${cVar('radiusSmall')};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
`
