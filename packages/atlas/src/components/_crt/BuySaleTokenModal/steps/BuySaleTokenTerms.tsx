import styled from '@emotion/styled'
import { useMemo } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LineChart } from '@/components/_charts/LineChart'
import { CommonProps } from '@/components/_crt/BuySaleTokenModal/steps/types'
import { generateChartData } from '@/components/_crt/CreateTokenDrawer/steps/TokenIssuanceStep/TokenIssuanceStep.utils'
import { TooltipBox } from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar, media } from '@/styles'
import { formatNumber } from '@/utils/number'
import { formatDate } from '@/utils/time'

const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
  cliffTime: 1,
  vestingTime: 6,
  firstPayout: 25,
})

type BuySaleTokenTermsProps = {
  tokenId: string
  tokenAmount: number
  onSubmit: () => void
} & CommonProps

export const BuySaleTokenTerms = ({
  tokenId,
  setPrimaryButtonProps,
  onSubmit,
  tokenAmount,
}: BuySaleTokenTermsProps) => {
  const { title, cliffTime, vestingTime, firstPayout } = getTokenDetails(tokenId)

  const details = useMemo(() => {
    const currentDate = new Date()
    return [
      {
        title: 'Your cliff',
        content: (
          <Text variant="h300" as="h1">
            {cliffTime} month{cliffTime > 1 ? 's' : ''}
          </Text>
        ),
        date: new Date(),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'First payout',
        content: (
          <NumberFormat
            value={(tokenAmount * firstPayout) / 100}
            as="p"
            variant="t200"
            withDenomination="before"
            withToken
            customTicker="$JBC"
          />
        ),
        date: new Date(new Date(currentDate.setMonth(currentDate.getMonth() + cliffTime))),

        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Your vesting',
        content: (
          <Text variant="h300" as="h1">
            {vestingTime} month{vestingTime > 1 ? 's' : ''}
          </Text>
        ),
        date: new Date(new Date(currentDate.setMonth(currentDate.getMonth() + cliffTime + vestingTime))),

        tooltipText: 'Lorem ipsum',
      },
    ]
  }, [cliffTime, firstPayout, tokenAmount, vestingTime])

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Buy tokens',
      onClick: onSubmit,
    })
  })

  const chartData = useMemo(() => {
    return generateChartData(cliffTime, vestingTime, firstPayout)
  }, [cliffTime, firstPayout, vestingTime])

  return (
    <>
      <FlexBox flow="column" gap={6}>
        <Text variant="h400" as="h4">
          Holders terms
        </Text>
        <FlexBox flow="column" gap={4}>
          <ChartBox>
            <LineChart
              enablePointLabel
              tooltip={(point) => {
                const currentDate = new Date()
                const timeInMonths = point.data.x === 'Now' ? 0 : +(point.data.x as string).split('M')[0]
                return (
                  <TooltipBox>
                    <Text variant="t300" as="p">
                      {formatNumber(((tokenAmount ?? 0) * (point.data.y as number)) / 100)} ${title}
                    </Text>
                    <Text variant="t100" as="p" color="colorTextMuted">
                      {point.data.x !== 'Now'
                        ? formatDate(new Date(currentDate.setMonth(currentDate.getMonth() + timeInMonths)))
                        : 'Now'}
                    </Text>
                  </TooltipBox>
                )
              }}
              yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickValues: [0, 25, 50, 75, 100],
                format: (tick) => `${tick}%`,
              }}
              gridYValues={[0, 25, 50, 75, 100]}
              data={[
                {
                  id: 1,
                  color: cVar('colorTextPrimary'),
                  data: chartData,
                },
              ]}
            />
          </ChartBox>

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
      </FlexBox>
    </>
  )
}

const ChartBox = styled.div`
  width: calc(100% + 125px);
  height: 300px;
  margin-left: -25px;

  ${media.sm} {
    width: calc(100% + 125px);
  }
`
