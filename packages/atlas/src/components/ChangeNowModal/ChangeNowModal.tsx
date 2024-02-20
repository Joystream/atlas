import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import {
  SvgActionClock,
  SvgActionCreatorToken,
  SvgActionHide,
  SvgActionLock,
  SvgAlertsInformative32,
  SvgJoyTokenPrimary16,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { TokenInput, TokenInputProps } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar, sizes } from '@/styles'
import { Currency, changeNowService } from '@/utils/ChangeNowService'

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

export const ChangeNowModal = ({ type }: ChangeNowModalProps) => {
  const [step, setStep] = useState()
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
    <DialogModal
      title={type === 'refill' && step === ChangeNowModalStep.INFO ? <SvgAlertsInformative32 /> : 'Buy JOY'}
      show
      onExitClick={() => undefined}
      primaryButton={{
        text: 'Buy JOY',
      }}
      secondaryButton={{
        text: 'Cancel',
      }}
    >
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
    </DialogModal>
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
