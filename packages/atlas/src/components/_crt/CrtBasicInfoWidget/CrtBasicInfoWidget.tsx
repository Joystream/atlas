import { ReactElement, ReactNode, useRef } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type CrtBasicInfoWidgetProps = {
  name?: string
  details: {
    caption: string
    content: number | string | ReactElement | ReactElement[]
    icon?: ReactNode
    tooltipText?: string
  }[]
}

export const CrtBasicInfoWidget = ({ name, details }: CrtBasicInfoWidgetProps) => {
  const titleRef = useRef<HTMLSpanElement | null>(null)
  const smMatch = useMediaMatch('sm')
  return (
    <WidgetTile
      title={<span ref={titleRef}>${name ?? 'ABC'}</span>}
      titleVariant="h700"
      titleColor="colorTextStrong"
      customNode={
        <FlexBox gap={5}>
          <Tooltip reference={titleRef} text="Token name" placement="top-start" />
          {details.map((detail, idx) => (
            <DetailsContent
              {...detail}
              key={idx}
              avoidIconStyling
              tileSize={smMatch ? 'big' : 'bigSmall'}
              withDenomination
            />
          ))}
        </FlexBox>
      }
    />
  )
}
