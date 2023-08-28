import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LineChart } from '@/components/_charts/LineChart'
import { CommonProps } from '@/components/_crt/BuySaleTokenModal/steps/types'
import { generateChartData } from '@/components/_crt/CreateTokenDrawer/steps/TokenIssuanceStep/TokenIssuanceStep.utils'
import { TooltipBox } from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { cVar, media, sizes } from '@/styles'
import { formatNumber } from '@/utils/number'
import { formatDate } from '@/utils/time'

export const getTokenDetails = (_: string) => ({
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
  const [isChecked, setIsChecked] = useState(false)
  const [checkboxError, setCheckboxError] = useState('')

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
            customTicker={`$${title}`}
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
  }, [cliffTime, firstPayout, title, tokenAmount, vestingTime])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Buy tokens',
      onClick: () => {
        if (isChecked) {
          onSubmit()
        } else {
          setCheckboxError('Terms & Conditions have to be accepted to continue')
        }
      },
    })
  }, [isChecked, onSubmit, setPrimaryButtonProps])

  const chartData = useMemo(() => {
    return generateChartData(cliffTime, vestingTime, firstPayout)
  }, [cliffTime, firstPayout, vestingTime])

  return (
    <Container>
      <FlexBox flow="column" gap={0}>
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
              enableCrosshair={false}
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
      <CheckboxWrapper isAccepted={isChecked}>
        <Checkbox
          onChange={(val) => {
            setIsChecked(val)
            setCheckboxError('')
          }}
          caption={checkboxError}
          error={!!checkboxError}
          value={isChecked}
          label="I have saved my wallet seed phrase safely"
        />
      </CheckboxWrapper>
    </Container>
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

export const CheckboxWrapper = styled.div<{ isAccepted: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 1px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ isAccepted }) => (isAccepted ? cVar('colorBackground') : cVar('colorBackgroundElevated'))};
  padding: ${sizes(4)} var(--local-size-dialog-padding);

  ${media.sm} {
    bottom: 87px;
  }
`

const Container = styled.div`
  display: flex;
  max-height: calc(100% - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--local-size-dialog-padding);
  padding-bottom: 0;
  margin-bottom: 55px;
`
