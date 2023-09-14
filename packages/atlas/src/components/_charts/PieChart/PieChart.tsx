import styled from '@emotion/styled'
import { PieSvgProps, ResponsivePie } from '@nivo/pie'
import { MayHaveLabel } from '@nivo/pie/dist/types/types'
import { animated } from '@react-spring/web'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

type Datum = {
  id: string
  value: number
} & MayHaveLabel
type ReponsiveProps = Omit<PieSvgProps<Datum>, 'width' | 'height'>

const defaultJoystreamProps: Omit<ReponsiveProps, 'data'> = {
  isInteractive: true,
  enableArcLinkLabels: false,
  // arcLabelsTextColor: 'inherit',
  arcLabelsRadiusOffset: 0.5,
  arcLabelsComponent: (datum) => {
    return (
      <animated.g transform={datum.style.transform}>
        <foreignObject height={30} width={100}>
          <Text variant="h100" as="h1">
            {datum.datum.formattedValue}
          </Text>
        </foreignObject>
      </animated.g>
    )
  },
  colors: ['#9FACFF', '#7174FF', '#BECAFF', '#1B186C'],
  theme: {
    tooltip: {
      container: {
        background: cVar('colorBackgroundStrong'),
      },
    },
  },
}

export type PieChartProps = {
  // tooltip?: (point: Datum) => ReactNode
} & ReponsiveProps
export const PieChart = (props: PieChartProps) => {
  return (
    <ResponsivePie
      {...defaultJoystreamProps}
      {...props}
      // tooltip={(point) => (
      //   <ChartTooltip>{props.tooltip ? props.tooltip(point.point) : String(point.point.data.y)}</ChartTooltip>
      // )}
    />
  )
}

const ChartTooltip = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  padding: ${sizes(1)} ${sizes(2)};
  border-radius: ${cVar('radiusSmall')};
`
