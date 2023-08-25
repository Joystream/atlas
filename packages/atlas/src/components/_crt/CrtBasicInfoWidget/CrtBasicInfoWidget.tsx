import { ReactElement, ReactNode } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { WidgetTile } from '@/components/WidgetTile'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type CrtBasicInfoWidgetProps = {
  name?: string
  details: {
    caption: string
    content: number | string | ReactElement | ReactElement[]
    icon: ReactNode
    tooltipText?: string
  }[]
}

export const CrtBasicInfoWidget = ({ name, details }: CrtBasicInfoWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <WidgetTile
      title={`$${name ?? 'ABC'}`}
      titleVariant="h700"
      titleColor="colorTextStrong"
      customNode={
        <FlexBox gap={5}>
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
