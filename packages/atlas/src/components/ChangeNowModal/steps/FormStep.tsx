import styled from '@emotion/styled'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { SvgJoyTokenPrimary16 } from '@/assets/icons'
import { CommonProps } from '@/components/ChangeNowModal/steps/types'
import { FlexBox } from '@/components/FlexBox'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput, TokenInputProps } from '@/components/_inputs/TokenInput'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'
import { Currency, changeNowService } from '@/utils/ChangeNowService'

type CurrencyInputValues = {
  amount: number
  currency: string | undefined
}

export type FormData = {
  from: CurrencyInputValues
  to: CurrencyInputValues
  estimatedArrival: string
}

type FormStepProps = {
  onSubmit: (data: FormData) => void
  initialValues: FormData | null
} & CommonProps

export const FormStep = ({ goToStep, setPrimaryButtonProps, onSubmit, type, initialValues }: FormStepProps) => {
  const { displaySnackbar } = useSnackbar()
  const { data, isLoading } = useQuery('changenow-currency', () => changeNowService.getAvailableCurrencies())

  const { control, watch, handleSubmit } = useForm<FormData>({
    defaultValues: initialValues ?? {
      from: {
        amount: undefined,
        currency: type === 'sell' ? 'joy' : undefined,
      },
      to: {
        amount: undefined,
        currency: type === 'buy' ? 'joy' : undefined,
      },
    },
  })

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Next',
      onClick: () =>
        handleSubmit(onSubmit, (errors) => {
          console.log(errors, 'Xd')
        })(),
    })
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

  const handleInputChange = useCallback(
    async (amount: number, type: 'from' | 'to') => {
      const formLegacyTickers = watch(['from.currency', 'to.currency'])
      const matchingCurrencies = currencyOptions?.filter((currency) =>
        formLegacyTickers.includes(currency.legacyTicker)
      )
      const currency = matchingCurrencies?.find((curr) => curr.legacyTicker !== 'joy')
      console.log('currs:', currency, matchingCurrencies, formLegacyTickers)
      if (matchingCurrencies?.length !== 2 || !currency) {
        return
      }
      const [, toLegacyTicker] = formLegacyTickers
      try {
        const { data } = await changeNowService.getEstimatedExchangeAmount(
          amount,
          currency,
          toLegacyTicker === 'joy' ? 'buy' : 'sell'
        )

        const { fromAmount, toAmount } = data
        console.log('data', data)
      } catch (e) {
        console.error('Failed to get reate estimation: ', e)
        displaySnackbar({
          title: 'Failed to get rate estimation',
          iconType: 'error',
        })
      }
    },
    [currencyOptions, displaySnackbar, watch]
  )

  return (
    <FlexBox width="100%" gap={10} flow="column">
      <Controller
        name="from"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormField
              label="Paying"
              // error={errors.amount?.message}
            >
              <CurrencyInput
                placeholder="10"
                currencies={currencyOptions}
                value={value.amount}
                initialCurrency={
                  initialValues?.from.currency && currencyOptions
                    ? currencyOptions.find((curr) => curr.legacyTicker === initialValues.from.currency)
                    : undefined
                }
                lockedCurrency={type === 'sell' ? 'joy' : undefined}
                onChange={(amount) => {
                  onChange({ ...value, amount })
                  if (amount) {
                    handleInputChange(amount, 'from')
                  }
                }}
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
              label="Receiving"
              // error={errors.amount?.message}
            >
              <CurrencyInput
                placeholder="10"
                currencies={currencyOptions}
                initialCurrency={
                  initialValues?.to.currency && currencyOptions
                    ? currencyOptions.find((curr) => curr.legacyTicker === initialValues.to.currency)
                    : undefined
                }
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
  initialCurrency?: ComboBoxProps<{ value: string } & Currency>['initialSelectedItem']
  lockedCurrency?: string
  onCurrencySelect: (value: string) => void
} & TokenInputProps

const CurrencyInput = ({
  currencies,
  onCurrencySelect,
  lockedCurrency,
  initialCurrency,
  ...tokenProps
}: CurrencyInputProps) => {
  const [sel, setSel] = useState<string | undefined>(initialCurrency?.value)
  const selected = currencies?.find((opt) => opt.value.toLowerCase() === (lockedCurrency ?? sel)?.toLowerCase())
  return (
    <InputGrid>
      <TokenInput {...tokenProps} nodeStart={<div />} nodeEnd={<div />} />
      <ComboBox
        nodeStart={selected?.nodeStart ?? initialCurrency?.nodeStart ?? <div />}
        value={selected?.label ?? sel}
        selectedItem={selected}
        initialSelectedItem={initialCurrency}
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
