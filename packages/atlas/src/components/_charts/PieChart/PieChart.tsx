import { ComputedDatum, PieSvgProps, ResponsivePie } from '@nivo/pie'
import { MayHaveLabel } from '@nivo/pie/dist/types/types'
import { animated } from '@react-spring/web'
import { useState } from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

type Datum = {
  id: string
  value: number
  index: number
} & MayHaveLabel
type ReponsiveProps = Omit<PieSvgProps<Datum>, 'width' | 'height'>

export const joystreamColors = ['#9FACFF', '#7174FF', '#BECAFF', '#1B186C']

const defaultJoystreamProps: Omit<ReponsiveProps, 'data'> = {
  isInteractive: true,
  enableArcLinkLabels: false,
  arcLabelsRadiusOffset: 0.5,
  arcLabelsComponent: (datum) => {
    return (
      <animated.g transform={datum.style.transform}>
        <foreignObject height={15} width={30}>
          <Text variant="h100" as="h1">
            {datum.datum.formattedValue}
          </Text>
        </foreignObject>
      </animated.g>
    )
  },
  theme: {
    tooltip: {
      container: {
        background: cVar('colorBackgroundStrong'),
      },
    },
  },
}

export type PieChartProps = {
  onDataHover?: (data: ComputedDatum<Datum> | null) => void
  hoveredData?: ComputedDatum<Datum>
  hoverOpacity?: boolean
} & ReponsiveProps
export const PieChart = (props: PieChartProps) => {
  const [hoveredEntry, setHoveredEntry] = useState<ComputedDatum<Datum> | null>(null)

  const getColor = (entry: Omit<ComputedDatum<Datum>, 'color' | 'fill' | 'arc'>) => {
    const color = joystreamColors[entry.data.index % joystreamColors.length]
    if (!props.hoverOpacity || entry.id === (props.hoveredData ? props.hoveredData.id : hoveredEntry?.id)) {
      return color
    } else {
      return `${color}4D`
    }
  }

  return (
    <ResponsivePie
      onMouseEnter={(entry) => {
        setHoveredEntry(entry)
        props.onDataHover?.(entry)
      }}
      onMouseLeave={() => {
        setHoveredEntry(null)
        props.onDataHover?.(null)
      }}
      colors={getColor}
      {...defaultJoystreamProps}
      {...props}
    />
  )
}
