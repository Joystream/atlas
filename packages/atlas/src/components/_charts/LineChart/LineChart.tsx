import styled from '@emotion/styled'
import { LineSvgProps, Point, ResponsiveLine } from '@nivo/line'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

const defaultJoystreamProps: Omit<LineSvgProps, 'data'> = {
  isInteractive: true,
  useMesh: true,
  enablePoints: false,
  lineWidth: 2,
  margin: { top: 50, right: 110, bottom: 50, left: 60 },
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
    stacked: false,
    reverse: false,
  },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 10,
    tickPadding: 10,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickValues: 6,
  },
  colors: (d) => d.color,
  theme: {
    tooltip: {
      container: {
        background: cVar('colorBackgroundStrong'),
      },
    },
    axis: {
      ticks: {
        line: {
          stroke: cVar('colorBackgroundAlpha'),
        },
        text: {
          fill: cVar('colorTextMuted'),
          font: cVar('typographyDesktopT100'),
        },
      },
    },
    grid: {
      line: {
        stroke: cVar('colorBackgroundAlpha'),
      },
    },
  },
}
export type LineChartProps = {
  tooltip?: (point: Point) => string
} & Omit<LineSvgProps, 'tooltip'>
export const LineChart = (props: LineChartProps) => {
  return (
    <ResponsiveLine
      {...defaultJoystreamProps}
      {...props}
      tooltip={(point) => (
        <ChartTooltip>
          <Text variant="t100" as="p" color="colorTextStrong">
            {props.tooltip ? props.tooltip(point.point) : String(point.point.data.y)}
          </Text>
        </ChartTooltip>
      )}
    />
  )
}

const ChartTooltip = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  padding: ${sizes(1)} ${sizes(2)};
`
