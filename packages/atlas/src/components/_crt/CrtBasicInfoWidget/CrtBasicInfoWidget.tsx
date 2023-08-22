import styled from '@emotion/styled'

import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { WidgetTile } from '@/components/WidgetTile'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { sizes } from '@/styles'

type CrtBasicInfoWidgetProps = {
  name?: string
  totalRevenue?: string
  revenueShare?: number
  creatorReward?: number
}

export const CrtBasicInfoWidget = ({ creatorReward, revenueShare, totalRevenue, name }: CrtBasicInfoWidgetProps) => {
  const smMatch = useMediaMatch('sm')

  return (
    <WidgetTile
      title={`$${name || 'ABC'}`}
      titleVariant="h700"
      customNode={
        <DetailsBox>
          {totalRevenue && (
            <DetailsContent
              avoidIconStyling
              tileSize={smMatch ? 'big' : 'bigSmall'}
              caption="TOTAL REVENUE"
              content={totalRevenue}
              icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
              withDenomination
            />
          )}
          {revenueShare && (
            <DetailsContent
              avoidIconStyling
              tileSize={smMatch ? 'big' : 'bigSmall'}
              caption="REVENUE SHARE"
              content={`${revenueShare}%`}
              icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
              withDenomination
            />
          )}
          {creatorReward && (
            <DetailsContent
              avoidIconStyling
              tileSize={smMatch ? 'big' : 'bigSmall'}
              caption="CREATOR REWARD"
              content={`${creatorReward}%`}
              icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
              withDenomination
            />
          )}
        </DetailsBox>
      }
    />
  )
}

const DetailsBox = styled.div`
  display: flex;
  gap: ${sizes(4)};
`
