import { useMemo } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { CommonProps } from '@/components/_crt/BuySaleTokenModal/steps/types'
import { useMountEffect } from '@/hooks/useMountEffect'
import { formatDate } from '@/utils/time'

const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
})

type BuySaleTokenTermsProps = {
  tokenId: string
  onSubmit: () => void
} & CommonProps

export const BuySaleTokenTerms = ({ tokenId, setPrimaryButtonProps, onSubmit }: BuySaleTokenTermsProps) => {
  const { tokensOnSale } = getTokenDetails(tokenId)

  const details = useMemo(
    () => [
      {
        title: 'Your cliff',
        content: (
          <Text variant="h300" as="h1">
            1 month
          </Text>
        ),
        date: new Date(),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'First payout',
        content: (
          <NumberFormat value={0} as="p" variant="t200" withDenomination="before" withToken customTicker="$JBC" />
        ),
        date: new Date(),

        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Your vesting',
        content: <NumberFormat value={tokensOnSale} as="p" variant="t200" withDenomination="before" withToken />,
        date: new Date(),

        tooltipText: 'Lorem ipsum',
      },
    ],
    [tokensOnSale]
  )

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: onSubmit,
    })
  })

  return (
    <>
      <FlexBox flow="column" gap={6}>
        <Text variant="h400" as="h4">
          Holders terms
        </Text>
        <FlexBox gap={4}>
          <div>chart</div>
        </FlexBox>

        <FlexBox flow="column" gap={2}>
          {details.map((row) => (
            <FlexBox key={row.title} justifyContent="space-between" equalChildren>
              <FlexBox width="fit-content" alignItems="center">
                <Text variant="h300" as="p" color="colorText">
                  {row.title}
                </Text>
                <Information text={row.tooltipText} />
              </FlexBox>
              <FlexBox flow="column" alignItems="end">
                {row.content}
                <Text variant="t100" as="p" color="colorText">
                  {formatDate(row.date)}
                </Text>
              </FlexBox>
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </>
  )
}
