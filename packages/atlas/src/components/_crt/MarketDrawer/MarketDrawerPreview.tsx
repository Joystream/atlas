import { Datum } from '@nivo/line'

import { SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LineChart, defaultChartTheme } from '@/components/_charts/LineChart'
import { TooltipBox } from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { ChartBox } from '@/components/_crt/MarketDrawer/MarketDrawer.styles'
import { cVar } from '@/styles'

type MarketDrawerPreviewProps = {
  tokenName: string
}
export const MarketDrawerPreview = ({ tokenName }: MarketDrawerPreviewProps) => {
  const chartData: Datum[] = [
    { x: '1k', y: 1 },
    { x: '10k', y: 8 },
    { x: '50k', y: 32 },
    { x: '100k', y: 64 },
    { x: '500k', y: 96 },
    { x: '1m', y: 128 },
    { x: '10m', y: 128 },
  ]

  return (
    <>
      <ChartBox>
        <LineChart
          curve="natural"
          enablePointLabel
          tooltip={(point) => {
            return (
              <TooltipBox>
                <Text variant="t300" as="p">
                  <NumberFormat value={Number(point.data.yFormatted) * 1000} format="short" as="span" withToken />
                </Text>
                <Text variant="t100" as="p" color="colorTextMuted">
                  {point.data.xFormatted} {tokenName} supply
                </Text>
              </TooltipBox>
            )
          }}
          yScale={{
            type: 'log',
            base: 2,
            min: 1,
            max: 'auto',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickValues: [1, 8, 32, 64, 128],
            ticksPosition: 'before',
            format: (tick) => `${tick}K`,
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
          gridYValues={[1, 8, 32, 64, 128]}
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
    </>
  )
}
