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
import { Input } from '@/components/_inputs/Input'
import { TokenInput, TokenInputProps } from '@/components/_inputs/TokenInput'
import { Spinner } from '@/components/_loaders/Spinner'
import { useSnackbar } from '@/providers/snackbars'
import { square } from '@/styles'
import {
  Currency,
  JOYSTREAM_CHANGENOW_LEGACY_TICKER,
  JOYSTREAM_CHANGENOW_TICKER,
  changeNowService,
} from '@/utils/ChangeNowService'
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
  destinationAddress: string
  serverError?: string
}

type FormStepProps = {
  onSubmit: (data: FormData) => void
  initialValues: FormData | null
} & CommonProps

export const FormStep = ({ setPrimaryButtonProps, onSubmit, type, initialValues }: FormStepProps) => {
  const { displaySnackbar } = useSnackbar()
  const [isLoadingRate, setIsLoadingRate] = useState<'to' | 'from' | null>(null)
  const debouncedExchangeEstimation = useRef<DebouncedFunc<
    (amount: number, type: 'from' | 'to') => Promise<void>
  > | null>(null)
  const { data } = useQuery('changenow-currency', () => changeNowService.getAvailableCurrencies(), {
    onSuccess: (data) => {
      const currencyOptions = data.map((curr) => ({
        ...curr,
        value: curr.legacyTicker,
        label: curr.ticker.toUpperCase(),
        caption: curr.name,
        nodeStart: curr.image ? <img src={curr.image} alt={curr.ticker} /> : <SvgJoyTokenPrimary16 />,
      }))
      debouncedExchangeEstimation.current = debounce(async (amount: number, direction: 'from' | 'to') => {
        const isDirectionFrom = direction === 'from'
        setIsLoadingRate(isDirectionFrom ? 'to' : 'from')
        const formLegacyTicker = watch(type === 'sell' ? 'to.currency' : 'from.currency')
        const currency = currencyOptions?.filter((currency) => formLegacyTicker === currency.legacyTicker)?.[0]
        if (!currency) {
          setIsLoadingRate(null)
          return
        }
        if (currency.ticker === JOYSTREAM_CHANGENOW_TICKER) {
          setError('serverError', {
            message: 'Pick different currency',
            type: type === 'sell' ? 'to' : 'from',
          })
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
            setError('serverError', {
              message: changeNowService.sanitizeApiErrorMessage(e.response.data.message),
              type: direction,
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

      const hasInitialValues = !!initialValues
      if (hasInitialValues && debouncedExchangeEstimation.current) {
        debouncedExchangeEstimation.current(initialValues?.from.amount, 'from')
      }
    },
  })

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
      destinationAddress: '',
    },
  })

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Next',
      disabled: !!isLoadingRate,
      onClick: () => {
        handleSubmit(onSubmit)()
      },
    })
  }, [onSubmit, setPrimaryButtonProps, handleSubmit, isLoadingRate])

  const currencyOptions = useMemo(() => {
    return data?.map((curr) => ({
      ...curr,
      value: curr.legacyTicker,
      label: curr.ticker.toUpperCase(),
      caption: curr.name,
      nodeStart: curr.image ? <img src={curr.image} alt={curr.ticker} /> : <SvgJoyTokenPrimary16 />,
    }))
  }, [data])

  useEffect(() => {
    if (initialValues?.validUntil && new Date(initialValues.validUntil).getTime() < Date.now() && currencyOptions) {
      debouncedExchangeEstimation.current?.(initialValues.from.amount, 'from')
    }
  }, [currencyOptions, initialValues?.from.amount, initialValues?.validUntil])

  const [from, to] = watch(['from', 'to'])

  return (
    <FlexBox width="100%" gap={10} flow="column">
      <Controller
        name="from"
        control={control}
        rules={{
          validate: async (value) => {
            if (!value.amount) {
              return 'Please provide amount'
            }

            if (!value.currency) {
              return 'Please choose currency'
            }
          },
        }}
        render={({ field: { value, onChange } }) => {
          return (
            <FormField
              label="Paying"
              error={
                errors.serverError
                  ? errors.serverError?.type === 'from'
                    ? errors.serverError?.message
                    : undefined
                  : errors.from?.message
              }
            >
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

      <FlexBox flow="column" gap={4}>
        <Controller
          name="to"
          control={control}
          rules={{
            validate: async (value) => {
              if (!value.amount) {
                return 'Please provide amount'
              }

              if (!value.currency) {
                return 'Please choose currency'
              }
            },
          }}
          render={({ field: { value, onChange } }) => {
            return (
              <FormField
                label="Receiving"
                error={
                  errors.serverError
                    ? errors.serverError?.type === 'to'
                      ? errors.serverError?.message
                      : undefined
                    : errors.to?.message
                }
              >
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
            Estimated rate: 1 {from.currency.toUpperCase()} ~ {to.amount / from.amount || 'N/A'}{' '}
            {to.currency.toUpperCase()}
          </Text>
        )}
      </FlexBox>

      {type === 'sell' ? (
        <Controller
          name="destinationAddress"
          control={control}
          rules={{
            validate: async (value) => {
              if (type === 'sell') {
                if (!value) {
                  return 'You must provide destination address'
                }
                // const { data } = await changeNowService.validateCurrencyAddress(formValues.to.currency ?? '', value)
                //
                // if (!data.result) {
                //   return 'Address is invalid'
                // }
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormField
              label="Recipient wallet"
              tooltip={{
                text: 'This is an address where the funds will be send after receiving your payment. Make sure that the address is on the same network as destination currency.',
              }}
              error={errors.destinationAddress?.message}
            >
              <Input placeholder="Enter payout address" {...field} />
            </FormField>
          )}
        />
      ) : null}
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
  grid-template-columns: 1fr 170px;
  width: 100%;
  grid-gap: 2px;
`
