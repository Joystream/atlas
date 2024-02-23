import styled from '@emotion/styled'
import { isAxiosError } from 'axios'
import { DebouncedFunc, debounce } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { SvgJoyTokenPrimary16 } from '@/assets/icons'
import { CommonProps } from '@/components/ChangeNowModal/steps/types'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput, TokenInputProps } from '@/components/_inputs/TokenInput'
import { Spinner } from '@/components/_loaders/Spinner'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'
import { square } from '@/styles'
import { Currency, JOYSTREAM_CHANGENOW_LEGACY_TICKER, changeNowService } from '@/utils/ChangeNowService'
import { SentryLogger } from '@/utils/logs'

type CurrencyInputValues = {
  amount: number
  currency: string | undefined
}

export type FormData = {
  from: CurrencyInputValues
  to: CurrencyInputValues
  estimatedArrival: string | null
  rateId: string | null
  validUntil: string | null
}

type FormStepProps = {
  onSubmit: (data: FormData) => void
  initialValues: FormData | null
} & CommonProps

export const FormStep = ({ goToStep, setPrimaryButtonProps, onSubmit, type, initialValues }: FormStepProps) => {
  const { displaySnackbar } = useSnackbar()
  const [isLoadingRate, setIsLoadingRate] = useState<'to' | 'from' | null>(null)
  const { data, isLoading } = useQuery('changenow-currency', () => changeNowService.getAvailableCurrencies())

  const {
    control,
    watch,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<FormData>({
    defaultValues: initialValues ?? {
      from: {
        amount: undefined,
        currency: type === 'sell' ? JOYSTREAM_CHANGENOW_LEGACY_TICKER : undefined,
      },
      to: {
        amount: undefined,
        currency: type !== 'sell' ? JOYSTREAM_CHANGENOW_LEGACY_TICKER : undefined,
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

  const debouncedExchangeEstimation = useRef<DebouncedFunc<
    (amount: number, type: 'from' | 'to') => Promise<void>
  > | null>(null)

  useEffect(() => {
    if (currencyOptions) {
      debouncedExchangeEstimation.current = debounce(async (amount: number, direction: 'from' | 'to') => {
        const isDirectionFrom = direction === 'from'
        setIsLoadingRate(isDirectionFrom ? 'to' : 'from')
        const formLegacyTicker = watch(type === 'sell' ? 'to.currency' : 'from.currency')
        const currency = currencyOptions?.filter((currency) => formLegacyTicker === currency.legacyTicker)?.[0]
        if (!currency) {
          setIsLoadingRate(null)
          return
        }
        try {
          const { data } = await changeNowService.getEstimatedExchangeAmount(
            amount,
            currency,
            type === 'sell' ? 'sell' : 'buy',
            isDirectionFrom ? 'direct' : 'reverse'
          )

          const { toAmount, fromAmount } = data
          setValue(isDirectionFrom ? 'to.amount' : 'from.amount', isDirectionFrom ? toAmount : fromAmount)
          setValue('estimatedArrival', data.transactionSpeedForecast)
          setValue('rateId', data.rateId)
          setValue('validUntil', data.validUntil)
        } catch (e) {
          if (isAxiosError(e) && e.response?.data.message && e.response.status === 400) {
            setError(`${direction}`, {
              message: changeNowService.sanitizeApiErrorMessage(e.response.data.message),
              type: 'custom',
            })
            return
          }
          SentryLogger.error('Failed to get reate estimation: ', 'ChangeNowModal:FormStep', e)

          displaySnackbar({
            title: 'Failed to get rate estimation',
            iconType: 'error',
          })
        } finally {
          setIsLoadingRate(null)
        }
      }, 500)
    }
  }, [currencyOptions, displaySnackbar, setError, setValue, type, watch])

  const [from, to] = watch(['from', 'to'])

  return (
    <FlexBox width="100%" gap={10} flow="column">
      <Controller
        name="from"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormField label="Paying" error={errors.from?.message}>
              <CurrencyInput
                placeholder="10"
                currencies={currencyOptions}
                disabled={isLoadingRate === 'from'}
                isLoading={isLoadingRate === 'from'}
                value={value.amount}
                initialCurrency={
                  initialValues?.from.currency && currencyOptions
                    ? currencyOptions.find((curr) => curr.legacyTicker === initialValues.from.currency)
                    : undefined
                }
                lockedCurrency={type === 'sell' ? JOYSTREAM_CHANGENOW_LEGACY_TICKER : undefined}
                onChange={(amount) => {
                  onChange({ ...value, amount })
                  clearErrors()
                  if (amount) {
                    debouncedExchangeEstimation.current?.(amount, 'from')
                  }
                }}
                onCurrencySelect={(currency) => {
                  onChange({ ...value, currency })
                  clearErrors()
                  if (value.amount) {
                    debouncedExchangeEstimation.current?.(value.amount, 'from')
                  }
                }}
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
            <FormField label="Receiving" error={errors.to?.message}>
              <CurrencyInput
                placeholder="10"
                disabled={isLoadingRate === 'to'}
                currencies={currencyOptions}
                isLoading={isLoadingRate === 'to'}
                initialCurrency={
                  initialValues?.to.currency && currencyOptions
                    ? currencyOptions.find((curr) => curr.legacyTicker === initialValues.to.currency)
                    : undefined
                }
                value={value.amount}
                lockedCurrency={type === 'buy' ? JOYSTREAM_CHANGENOW_LEGACY_TICKER : undefined}
                onChange={(amount) => {
                  onChange({ ...value, amount })
                  clearErrors()
                  if (amount) {
                    debouncedExchangeEstimation.current?.(amount, 'to')
                  }
                }}
                onCurrencySelect={(currency) => {
                  onChange({ ...value, currency })
                  clearErrors()
                  if (value.amount) {
                    debouncedExchangeEstimation.current?.(value.amount, 'to')
                  }
                }}
              />
            </FormField>
          )
        }}
      />
      {from.currency && to.currency && (
        <Text variant="t200" as="p" color={isLoadingRate ? 'colorTextMuted' : 'colorText'}>
          Estimated rate: 1 {from.currency.toUpperCase()} ~ {to.amount / from.amount} {to.currency.toUpperCase()}
        </Text>
      )}
    </FlexBox>
  )
}

type CurrencyInputProps = {
  currencies: ComboBoxProps<{ value: string } & Currency>['items']
  initialCurrency?: ComboBoxProps<{ value: string } & Currency>['initialSelectedItem']
  lockedCurrency?: string
  onCurrencySelect: (value: string) => void
  isLoading?: boolean
} & TokenInputProps

const CurrencyInput = ({
  currencies,
  onCurrencySelect,
  lockedCurrency,
  isLoading,
  initialCurrency,
  ...tokenProps
}: CurrencyInputProps) => {
  const [sel, setSel] = useState<string | undefined>(initialCurrency?.value)
  const selected = currencies?.find((opt) => opt.value.toLowerCase() === (lockedCurrency ?? sel)?.toLowerCase())
  return (
    <InputGrid>
      <TokenInput {...tokenProps} nodeStart={<div />} nodeEnd={isLoading ? <StyledSpinner /> : <div />} />
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

const StyledSpinner = styled(Spinner)`
  ${square(24)};

  margin: 0;
`

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  width: 100%;
  grid-gap: 2px;
`
