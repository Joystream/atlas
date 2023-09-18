import { useState } from 'react'

import { SvgActionChevronR } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { PieChart, joystreamColors } from '@/components/_charts/PieChart'
import { Widget } from '@/components/_crt/CrtStatusWidget/CrtStatusWidget.styles'

const data = [
  {
    id: 'bedeho',
    value: 40,
    index: 0,
  },

  {
    id: 'radek',
    value: 60,
    index: 1,
  },
]
export const CrtHoldersWidget = () => {
  const [hoveredHolder, setHoveredHolder] = useState<any>()
  return (
    <Widget
      title="Holders"
      titleVariant="h500"
      titleColor="colorTextStrong"
      customTopRightNode={
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right">
          Show more
        </TextButton>
      }
      customNode={
        <FlexBox width="100%" gap={12} equalChildren>
          <FlexBox flow="column" width="100%">
            <Text variant="h100" as="h1" color="colorTextMuted">
              TOTAL SUPPLY
            </Text>
            <div style={{ height: 300, width: '100%' }}>
              <PieChart data={data} onDataHover={setHoveredHolder} hoverOpacity hoveredData={hoveredHolder} />{' '}
            </div>{' '}
          </FlexBox>
          <FlexBox flow="column" gap={6}>
            <FlexBox flow="column" gap={2}>
              <Text variant="h100" as="h1" margin={{ bottom: 4 }} color="colorTextMuted">
                YOU OWN
              </Text>
              <MemberLegendEntry
                key={data[0].id}
                memberHandle={data[0].id}
                color={joystreamColors[data[0].index]}
                value={data[0].value}
                isActive={data[0].id === hoveredHolder?.id}
                onMouseEnter={() => setHoveredHolder(data[0])}
                onMouseExit={() => setHoveredHolder(undefined)}
              />
            </FlexBox>
            <FlexBox flow="column" gap={2}>
              <Text variant="h100" as="h1" margin={{ bottom: 4 }} color="colorTextMuted">
                TOP HOLDERS
              </Text>
              {data.map((d) => (
                <MemberLegendEntry
                  key={d.id}
                  memberHandle={d.id}
                  color={joystreamColors[d.index]}
                  value={d.value}
                  isActive={d.id === hoveredHolder?.id}
                  onMouseEnter={() => setHoveredHolder(d)}
                  onMouseExit={() => setHoveredHolder(undefined)}
                />
              ))}
            </FlexBox>
          </FlexBox>
        </FlexBox>
      }
    />
  )
}

type MemberLegendEntryProps = {
  memberHandle: string
  value: number
  color: string
  isActive: boolean
  onMouseEnter: () => void
  onMouseExit: () => void
}

const MemberLegendEntry = ({
  memberHandle,
  value,
  color,
  isActive,
  onMouseExit,
  onMouseEnter,
}: MemberLegendEntryProps) => {
  return (
    <FlexBox
      gap={2}
      alignItems="center"
      style={{ opacity: isActive ? 1 : 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseExit}
    >
      <div style={{ minWidth: 24, minHeight: 24, background: color }} />
      <FlexBox alignItems="center">
        <Avatar />
        <Text variant="t100" as="p">
          {memberHandle}
        </Text>
      </FlexBox>
      <Text variant="t100" as="p">
        {value}%
      </Text>
    </FlexBox>
  )
}
