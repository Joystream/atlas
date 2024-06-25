import styled from '@emotion/styled'
import { isAxiosError } from 'axios'
import { DebouncedFunc, debounce } from 'lodash-es'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { SvgActionChangePrice } from '@/assets/icons'
import { CurrencyInput } from '@/components/ChangeNowModal/steps/FormStep'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ComboBoxProps } from '@/components/_inputs/ComboBox'
import { FormField } from '@/components/_inputs/FormField'
import { Select } from '@/components/_inputs/Select'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'
import { square } from '@/styles'
import { guardarianService } from '@/utils/GuardarianService'
import { GuardarianCurrencies } from '@/utils/GuardarianService/GuardarianService.types'
import { SentryLogger } from '@/utils/logs'

export type GuardarianForm = {
  from: {
    currency?: string // currency?: GuardarianFiatCurrency | GuardarianCryptoCurrency
    amount?: number
    network?: string
  }
  to: {
    currency?: string // currency?: GuardarianFiatCurrency | GuardarianCryptoCurrency
    amount?: number
    network?: string
  }
  isBuyingCrypto?: boolean
  serverError?: string
}

type GuardarianModalFormProps = {
  onSubmit: (form: GuardarianForm) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
}

export const GuardarianModalFormStep = ({ onSubmit, setActionButtonHandler }: GuardarianModalFormProps) => {
  const { displaySnackbar } = useSnackbar()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    setError,
    getValues,
  } = useForm<GuardarianForm>({
    defaultValues: {
      from: {
        amount: undefined,
        currency: undefined,
        network: undefined,
      },
      to: {
        amount: undefined,
        currency: undefined,
        network: undefined,
      },
      isBuyingCrypto: true,
    },
  })
  const isBuyingCrypto = watch('isBuyingCrypto')
  const debouncedExchangeEstimation = useRef<DebouncedFunc<
    (amount: number, type: 'from' | 'to') => Promise<void>
  > | null>(null)
  const [isLoadingRate, setIsLoadingRate] = useState<'to' | 'from' | null>(null)
  const { data: currencies } = useQuery({
    queryKey: 'guardarianCurrencies',
    queryFn: () => guardarianService.getAvailableCurrencies(),
    onSuccess: () => {
      debouncedExchangeEstimation.current = debounce(async (amount: number, direction: 'from' | 'to') => {
        const isDirectionFrom = direction === 'from'
        setIsLoadingRate(isDirectionFrom ? 'to' : 'from')
        const { to, from } = getValues()
        if (!to.currency || !from.currency || !from.amount || !to.amount) {
          setIsLoadingRate(null)
          return
        }

        try {
          const { data } = await guardarianService.getEstimatedExchangeAmount(
            amount,
            from as { currency: string },
            to as { currency: string },
            isDirectionFrom ? 'direct' : 'reverse'
          )

          const { value: estimation } = data

          setValue(
            // Not sure why, buy using `xx.amount` wasn't updating the component, hence the spread
            isDirectionFrom ? 'to' : 'from',
            {
              ...(isDirectionFrom ? to : from),
              amount: +estimation,
            },
            { shouldTouch: true }
          )
        } catch (e) {
          if (isAxiosError(e) && e.response?.data.message && e.response.status === 400) {
            setError('serverError', {
              message: e.response.data.message,
              type: direction,
            })
            return
          }
          SentryLogger.error('Failed to get exchange estimation: ', 'GuardarianModal:FormStep', e)

          displaySnackbar({
            title: 'Failed to get rate estimation',
            iconType: 'error',
          })
        } finally {
          setIsLoadingRate(null)
        }
      }, 500)
    },
  })

  const fiatOptions: ComboBoxProps<{ value: string } & GuardarianCurrencies['fiat_currencies'][number]>['items'] =
    useMemo(
      () =>
        currencies?.fiat_currencies.map((fiat) => ({
          ...fiat,
          label: fiat.name,
          value: fiat.ticker,
        })),
      [currencies?.fiat_currencies]
    ) ?? []

  const cryptoOptions: ComboBoxProps<{ value: string } & GuardarianCurrencies['crypto_currencies'][number]>['items'] =
    useMemo(
      () =>
        currencies?.crypto_currencies.map((crypto) => ({
          ...crypto,
          label: crypto.name,
          value: crypto.ticker,
        })),
      [currencies?.crypto_currencies]
    ) ?? []

  const cryptoCurrnecy = watch(isBuyingCrypto ? 'to.currency' : 'from.currency')
  const cryptoNetworks = cryptoOptions
    .find((c) => c.ticker === cryptoCurrnecy)
    ?.networks.map((n) => ({ ...n, label: n.network, value: n.network }))

  useMountEffect(() => {
    setActionButtonHandler(handleSubmit(onSubmit))
  })

  return (
    <FlexBox flow="column" gap={4}>
      <Text as="h3" variant="h500">
        Transaction details
      </Text>
      <Text as="p" variant="t300" color="colorText">
        Please fill out the form to perform a transaction. We don't require KYC to transactions under 700 USD.
      </Text>

      <Controller
        control={control}
        name="from"
        rules={{
          required: 'Field is required',
        }}
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <FormField
                error={errors.from?.message}
                label={isBuyingCrypto ? 'Select your currency' : 'Select your crypo'}
              >
                <CurrencyInput
                  disabled={isLoadingRate === 'from'}
                  isLoading={isLoadingRate === 'from'}
                  currencies={isBuyingCrypto ? fiatOptions : cryptoOptions}
                  currency={value.currency}
                  value={value.amount}
                  onChange={(amount) => {
                    onChange({ ...value, amount })
                    clearErrors()
                    if (amount) {
                      debouncedExchangeEstimation.current?.(amount, 'from')
                    }
                  }}
                  onCurrencySelect={(currency) => {
                    onChange({ ...value, currency, network: undefined })
                    clearErrors()
                    if (value.amount) {
                      debouncedExchangeEstimation.current?.(value.amount, 'from')
                    }
                  }}
                />
              </FormField>
              {(cryptoNetworks?.length ?? 0) > 1 && !isBuyingCrypto ? (
                <Select
                  value={value.network}
                  onChange={(network) => {
                    clearErrors()
                    onChange({ ...value, network })
                    if (value.amount) {
                      debouncedExchangeEstimation.current?.(value.amount, 'from')
                    }
                  }}
                  items={cryptoNetworks!}
                />
              ) : null}
            </>
          )
        }}
      />

      <FlexBox padding={2} width="100%" justifyContent="end">
        <Controller
          control={control}
          name="isBuyingCrypto"
          render={({ field: { value, onChange } }) => (
            <SwapButton
              variant="tertiary"
              onClick={() => {
                const { from, to } = watch()
                setValue('to', { ...from })
                setValue('from', { ...to })
                if (to.amount) {
                  debouncedExchangeEstimation.current?.(to.amount, 'from')
                }
                onChange(!value)
              }}
              icon={<SvgActionChangePrice />}
              size="large"
            />
          )}
        />
      </FlexBox>

      <Controller
        control={control}
        name="to"
        rules={{
          required: 'Field is required',
        }}
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <FormField
                error={errors.to?.message}
                label={isBuyingCrypto ? 'Select your crypo' : 'Select your currency'}
              >
                <CurrencyInput
                  disabled={isLoadingRate === 'to'}
                  isLoading={isLoadingRate === 'to'}
                  currency={value.currency}
                  currencies={isBuyingCrypto ? cryptoOptions : fiatOptions}
                  value={value.amount}
                  onChange={(amount) => {
                    onChange({ ...value, amount })
                    clearErrors()
                    if (amount) {
                      debouncedExchangeEstimation.current?.(amount, 'to')
                    }
                  }}
                  onCurrencySelect={(currency) => {
                    onChange({ ...value, currency, network: undefined })
                    clearErrors()
                    if (value.amount) {
                      debouncedExchangeEstimation.current?.(value.amount, 'to')
                    }
                  }}
                />
              </FormField>
              {(cryptoNetworks?.length ?? 0) > 1 && isBuyingCrypto ? (
                <Select
                  value={value.network}
                  onChange={(network) => {
                    clearErrors()
                    onChange({ ...value, network })
                    const from = watch('from')
                    if (value.amount) {
                      debouncedExchangeEstimation.current?.(value.amount, 'to')
                    }

                    if (from.amount) {
                      debouncedExchangeEstimation.current?.(from.amount, 'from')
                    }
                  }}
                  items={cryptoNetworks!}
                />
              ) : null}
            </>
          )
        }}
      />

      {errors.serverError?.message ? (
        <Text as="p" color="colorTextError" variant="t300">
          {errors.serverError.message}
        </Text>
      ) : null}
    </FlexBox>
  )
}

const SwapButton = styled(Button)`
  position: absolute;

  svg {
    ${square(24)}
  }
`
