import BN from 'bn.js'
import { FC, useMemo, useRef, useState } from 'react'

import { useGetHistoricalTokenAllocationQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { formatDate } from '@/utils/time'

import { Drawer, LabelText, StatisticsContainer, SupplyLine, ToggleContainer, Widget } from './CrtStatusWidget.styles'

export type CrtStatusWidgetProps = {
  token: FullCreatorTokenFragment
}
// todo: total revenue
export const CrtStatusWidget: FC<CrtStatusWidgetProps> = ({ token }) => {
  const drawer = useRef<HTMLDivElement>(null)
  const [isExpanded, expand] = useState(false)
  const smMatch = useMediaMatch('sm')
  const { data } = useGetHistoricalTokenAllocationQuery({
    variables: {
      tokenId: token.id,
    },
    skip: !token.id,
  })

  const totalVolume = useMemo(() => {
    return token.ammCurves.reduce((prev, next) => prev + Number(next.mintedByAmm) + Number(next.burnedByAmm), 0)
  }, [token.ammCurves])

  const ticker = `$${name}`

  return (
    <Widget
      title="Status"
      customNode={
        <>
          <Text as="h4" variant="h500">
            No active sale
          </Text>

          <SupplyLine>
            <LabelText as="span" variant="t100">
              Total supply:
            </LabelText>
            <NumberFormat
              as="span"
              variant="t100"
              format="short"
              value={+token.totalSupply}
              customTicker={ticker}
              withToken
            />
            <Information />
          </SupplyLine>

          <StatisticsContainer>
            <ToggleContainer onClick={() => expand(!isExpanded)}>
              <Text as="h3" variant="h500">
                Statistics
              </Text>
              <ExpandButton expanded={isExpanded} />
              <Text as="p" variant="t100">
                Token creation date, Revenue, Volume, Vesting
              </Text>
            </ToggleContainer>

            <Drawer ref={drawer} maxHeight={drawer.current?.scrollHeight} isExpanded={isExpanded}>
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="Token creation date"
                content={formatDate(new Date(token.createdAt))}
              />
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="Market cap"
                content={
                  token.lastPrice && token.totalSupply
                    ? hapiBnToTokenNumber(new BN(token.lastPrice).muln(+token.totalSupply))
                    : 0
                }
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="Total revenue"
                content={0}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="Total revenue Shares"
                content={data?.getCumulativeHistoricalShareAllocation.cumulativeHistoricalAllocation ?? 0}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="Total Transaction volume"
                content={token.lastPrice ? hapiBnToTokenNumber(new BN(token.lastPrice).muln(totalVolume)) : 0}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
            </Drawer>
          </StatisticsContainer>
        </>
      }
    />
  )
}
