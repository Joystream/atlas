import { ReactElement, ReactNode, useState } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Color } from '@/components/Text/Text.styles'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type CrtBasicInfoWidgetProps = {
  name?: string
  titleColor?: Color
  details: {
    caption: string
    content: number | string | ReactElement | ReactElement[]
    icon?: ReactNode
    tooltipText?: string
  }[]
}

export const CrtBasicInfoWidget = ({ name, details, titleColor }: CrtBasicInfoWidgetProps) => {
  const [titleRef, setTitleRef] = useState<HTMLSpanElement | null>(null)
  const smMatch = useMediaMatch('sm')
  return (
    <WidgetTile
      title={<span ref={setTitleRef}>${name ?? 'ABC'}</span>}
      titleVariant="h700"
      titleColor={titleColor ?? 'colorTextStrong'}
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
