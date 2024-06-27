import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { SvgActionArrowRight, SvgJoyTokenPrimary24 } from '@/assets/icons'
import { ChangeNowModalStep, CommonProps } from '@/components/ChangeNowModal/steps/types'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, sizes } from '@/styles'
import { changeNowService } from '@/utils/ChangeNowService'
import { formatJoystreamAddress } from '@/utils/address'
import { shortenString } from '@/utils/misc'
import { formatSmallDecimal } from '@/utils/number'
import { formatDurationShort, getTimeDiffInSeconds } from '@/utils/time'

import { FormData } from './FormStep'

export type SummaryStepProps = {
  formData: FormData
  setTransactionData: (id: TransactionData) => void
} & CommonProps

export type TransactionData = {
  id: string
  hasAutomaticTransactionSucceeded?: boolean
}

export const SummaryStep = ({
  formData,
  setPrimaryButtonProps,
  goToStep,
  type,
  setTransactionData,
}: SummaryStepProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeDiff, setTimeDiff] = useState<number | undefined>(undefined)
  const { activeMembership } = useUser()
  const { currentUser } = useAuth()
  const { data: currencies } = useQuery('changenow-currency', () => changeNowService.getAvailableCurrencies())
  const { estimatedArrival, to, from, rateId, validUntil } = formData
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { joystream, proxyCallback } = useJoystream()

  const onTransactionSubmit = useCallback(async () => {
    const fromCurrency = currencies?.find((curr) => curr.legacyTicker === from.currency)
    const toCurrency = currencies?.find((curr) => curr.legacyTicker === to.currency)

    if (!activeMembership || !rateId || !fromCurrency || !toCurrency) {
      return
    }
    const isSellingJoy = type === 'sell'
    const refundAddress = isSellingJoy ? activeMembership.controllerAccount.id : undefined
    setLoading(true)
    const txData = await changeNowService
      .createExchangeTransaction({
        refundAddress,
        type: isSellingJoy ? 'sell' : 'buy',
        amount: isSellingJoy ? from.amount : to.amount,
        currency: isSellingJoy ? toCurrency : fromCurrency,
        contactEmail: currentUser?.email,
        addressToBePaid: isSellingJoy ? formData.destinationAddress : activeMembership.controllerAccount.id,
        rateId: rateId,
        userId: currentUser?.id,
      })
      .then((res) => res.data)
      .catch(() => {
        setLoading(false)
        displaySnackbar({
          title: 'Transaction creation failed',
          description: 'Please try again, if the problem persists contact support.',
        })
      })

    if (!txData) {
      setLoading(false)
      return
    }

    setTransactionData({
      id: txData.id,
    })

    if (isSellingJoy) {
      if (!joystream) {
        return
      }

      await handleTransaction({
        disableQNSync: true,
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).sendFunds(
            formatJoystreamAddress(txData.payinAddress),
            tokenNumberToHapiBn(txData.fromAmount).toString(),
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => {
          setTransactionData({
            id: txData.id,
            hasAutomaticTransactionSucceeded: true,
          })
          goToStep(ChangeNowModalStep.PROGRESS)
        },
        onError: () => {
          setLoading(false)
        },
      })
    } else {
      goToStep(ChangeNowModalStep.PROGRESS)
    }
  }, [
    activeMembership,
    currencies,
    currentUser?.email,
    currentUser?.id,
    displaySnackbar,
    formData.destinationAddress,
    from.amount,
    from.currency,
    goToStep,
    handleTransaction,
    joystream,
    proxyCallback,
    rateId,
    setTransactionData,
    to.amount,
    to.currency,
    type,
  ])

  useEffect(() => {
    setPrimaryButtonProps({
      text: !loading ? 'Next' : 'Waiting...',
      disabled: loading,
      onClick: async () => {
        if (termsAccepted && validUntil) {
          const timeDiff = getTimeDiffInSeconds(new Date(validUntil))
          if (timeDiff < 10) {
            goToStep(ChangeNowModalStep.SWAP_EXPIRED)
            return
          }
          onTransactionSubmit()
        } else {
          setError('You have to accept terms of service')
        }
      },
    })
  }, [goToStep, loading, onTransactionSubmit, setPrimaryButtonProps, termsAccepted, validUntil])

  useMountEffect(() => {
    if (!validUntil) {
      return
    }

    const id = setInterval(() => {
      setTimeDiff(getTimeDiffInSeconds(new Date(validUntil)))
    }, 1_000)

    return () => {
      clearInterval(id)
    }
  })

  const [fromCurrency, toCurrency] = useMemo(() => {
    const from = currencies?.find((curr) => curr.legacyTicker === formData.from.currency)
    const to = currencies?.find((curr) => curr.legacyTicker === formData.to.currency)

    return [from, to]
  }, [currencies, formData.from.currency, formData.to.currency])
  const fromTicker = (fromCurrency?.legacyTicker ?? '').toUpperCase()
  const toTicker = (toCurrency?.legacyTicker ?? '').toUpperCase()

  return (
    <FlexBox gap={6} flow="column">
      <Container>
        <Text variant="t400" as="p">
          {formData.from.amount}
          {fromCurrency?.image ? <img src={fromCurrency.image} alt={fromCurrency.ticker} /> : <SvgJoyTokenPrimary24 />}
          {fromTicker}
        </Text>
        <SvgActionArrowRight />
        <Text variant="t400" as="p">
          {formData.to.amount}
          {toCurrency?.image ? <img src={toCurrency.image} alt={toCurrency.ticker} /> : <SvgJoyTokenPrimary24 />}
          {toTicker}
        </Text>
      </Container>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Recipient wallet address
        </Text>
        <Text variant="t200" as="p">
          {shortenString(
            type === 'sell' ? formData.destinationAddress : activeMembership?.controllerAccount.id ?? '',
            6,
            6
          )}
        </Text>
      </FlexBox>

      {estimatedArrival ? (
        <FlexBox width="100%" justifyContent="space-between">
          <Text variant="t200" as="p" color="colorText">
            Estimated Arrival
          </Text>
          <Text variant="t200" as="p">
            {new Date(estimatedArrival).toDateString()}
          </Text>
        </FlexBox>
      ) : null}

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Rate valid for
        </Text>
        <Text variant="t200" as="p" color={timeDiff !== undefined && timeDiff < 10 ? 'colorTextError' : undefined}>
          {timeDiff !== undefined ? formatDurationShort(timeDiff) : '-'}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Estimated Rate
        </Text>
        <Text variant="t200" as="p">
          1 {fromTicker} ~ {formatSmallDecimal(to.amount / from.amount)} {toTicker}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="h300" as="h1" color="colorText">
          You will receive
        </Text>
        <Text variant="h300" as="h1">
          {to.amount} {toTicker}
        </Text>
      </FlexBox>

      <Checkbox
        value={termsAccepted}
        onChange={(value) => {
          setTermsAccepted(value)
          if (value) {
            setError('')
          }
        }}
        label={
          <FlexBox>
            I accept the
            <TextButton to={absoluteRoutes.viewer.index()}>Terms of service</TextButton>
          </FlexBox>
        }
        caption={error}
        error={!!error}
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
