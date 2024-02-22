import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { SvgActionArrowRight, SvgJoyTokenPrimary24 } from '@/assets/icons'
import { CommonProps } from '@/components/ChangeNowModal/steps/types'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, sizes } from '@/styles'
import { changeNowService } from '@/utils/ChangeNowService'
import { shortenString } from '@/utils/misc'

import { FormData } from './FormStep'

export type SummaryStepProps = {
  formData: FormData
} & CommonProps

export const SummaryStep = ({ formData, setPrimaryButtonProps }: SummaryStepProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const { activeMembership } = useUser()
  const { data: currencies } = useQuery('changenow-currency', () => changeNowService.getAvailableCurrencies())

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Next',
      onClick: () => {
        if (termsAccepted) {
          // transction
        } else {
          setError('You have to accept terms of service')
        }
      },
    })
  }, [setPrimaryButtonProps, termsAccepted])

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
          {shortenString(activeMembership?.controllerAccount ?? '', 3, 3)}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Estimated Arrival
        </Text>
        <Text variant="t200" as="p">
          {new Date(formData.estimatedArrival).toDateString()}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="t200" as="p" color="colorText">
          Estimated Rate
        </Text>
        <Text variant="t200" as="p">
          1 {fromTicker} ~ {formData.to.amount / formData.from.amount} {toTicker}
        </Text>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <Text variant="h300" as="h1" color="colorText">
          You will receive
        </Text>
        <Text variant="h300" as="h1">
          {formData.to.amount} {toTicker}
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
