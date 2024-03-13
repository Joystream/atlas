import { Datum } from '@nivo/line'
import BN from 'bn.js'
import { useMemo } from 'react'

import { SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat, formatNumberShort, formatNumberShortInt } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LineChart, defaultChartTheme } from '@/components/_charts/LineChart'
import { TooltipBox } from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useTokenPrice } from '@/providers/joystream'
import { cVar } from '@/styles'
import { calcBuyMarketPricePerToken, calculateSlopeNumberForAmm } from '@/utils/crts'

import { ChartBox } from './MarketDrawer.styles'

type MarketDrawerPreviewProps = {
  tokenName: string
  startingPrice: number
  totalSupply: number
  holdersRevenueShare: number
}

const issuedTokens = [0, 10, 10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5]

export const MarketDrawerPreview = ({ tokenName, holdersRevenueShare, totalSupply }: MarketDrawerPreviewProps) => {
  const { tokenPrice } = useTokenPrice()
  const slopeNumber = useMemo(() => {
    return calculateSlopeNumberForAmm(totalSupply, holdersRevenueShare, tokenPrice ?? 1)
  }, [holdersRevenueShare, tokenPrice, totalSupply])

  const chartData: Datum[] = useMemo(() => {
    return issuedTokens.map((num) => ({
      x: formatNumberShort(num),
      y: hapiBnToTokenNumber(
        calcBuyMarketPricePerToken(String(num), String(Math.round(HAPI_TO_JOY_RATE * slopeNumber)), '0') ?? new BN(0)
      ),
    }))
  }, [slopeNumber])

  const getTickValues = () => [
    ...new Set(
      issuedTokens.map((elem) => {
        const floor = hapiBnToTokenNumber(
          calcBuyMarketPricePerToken(String(elem), String(Math.round(HAPI_TO_JOY_RATE * slopeNumber)), '0') ?? new BN(0)
        )
        return floor * 1.5
      })
    ),
  ]

  return (
    <>
      <ChartBox>
        <FlexBox gap={2} flow="column">
          <Text variant="h100" as="h1">
            HOW TOKEN PRICE RISES WITH GROWING TOTAL SUPPLY
          </Text>
          <Text variant="t200" as="p" color="colorTextMuted">
            Chart shows price for 1 token at different supply levels created by the market.
          </Text>
        </FlexBox>
        <div className="chart-box">
          <LineChart
            curve="natural"
            enablePointLabel
            tooltip={(point) => {
              return (
                <TooltipBox>
                  <Text variant="t300" as="p">
                    <NumberFormat value={Number(point.data.yFormatted)} format="short" as="span" withToken />
                  </Text>
                  <Text variant="t100" as="p" color="colorTextMuted">
                    {point.data.xFormatted} ${tokenName} supply
                  </Text>
                </TooltipBox>
              )
            }}
            yScale={{
              type: 'log',
              base: 2,
              min: 'auto',
              max: 'auto',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickValues: 5,
              ticksPosition: 'before',
              format: (tick) => formatNumberShortInt(tick),
              // eslint-disable-next-line
              // @ts-ignore
              renderTick: ({ x, y, textX, textY, opacity, textBaseline, value, format }) => {
                const iconX = textX - 18
                const iconY = textY - 8
                return (
                  <g transform={`translate(${x - 24},${y})`} style={{ opacity }}>
                    <SvgJoyTokenMonochrome16 x={iconX} y={iconY} />
                    <text
                      // eslint-disable-next-line
                      // @ts-ignore
                      alignmentBaseline={textBaseline}
                      textAnchor="start"
                      transform={`translate(${textX},${textY})`}
                      style={defaultChartTheme.axis.ticks.text}
                    >
                      {format && format(value)}
                    </text>
                  </g>
                )
              },
            }}
            gridYValues={getTickValues()}
            data={[
              {
                id: 1,
                color: cVar('colorCoreBlue500'),
                data: chartData,
              },
            ]}
            enableCrosshair={false}
          />
        </div>
      </ChartBox>
    </>
  )
}
