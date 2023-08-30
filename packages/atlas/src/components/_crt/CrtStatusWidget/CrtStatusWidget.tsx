import { FC, useState } from 'react'

import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat, NumberFormatProps } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatDate } from '@/utils/time'

import {
  DetailsBox,
  ExpandableContainer,
  LabelText,
  StatisticsContainer,
  SupplyLine,
  Widget,
} from './CrtStatusWidget.styles'

type Amount = NumberFormatProps['value']
export type CrtStatusWidgetProps = {
  name: string
  creationDate: Date
  supply: Amount
  marketCap: Amount
  revenue: Amount
  revenueShare: Amount
  transactionVolume: Amount
}

export const CrtStatusWidget: FC<CrtStatusWidgetProps> = ({
  name,
  creationDate,
  supply,
  marketCap,
  revenue,
  revenueShare,
  transactionVolume,
}) => {
  const [isExpanded, expand] = useState(true)
  const smMatch = useMediaMatch('sm')

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
            <NumberFormat as="span" variant="t100" format="short" value={supply} customTicker={ticker} withToken />
            <Information />
          </SupplyLine>

          <StatisticsContainer>
            <ExpandableContainer onClick={() => expand(!isExpanded)}>
              <Text as="h3" variant="h500">
                Statistics
              </Text>
              <ExpandButton expanded={isExpanded} />
              <Text as="p" variant="t100">
                Token creation date, Revenue, Volume, Vesting
              </Text>
            </ExpandableContainer>

            {isExpanded && (
              <DetailsBox>
                <DetailsContent
                  avoidIconStyling
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  caption="Token creation date"
                  content={formatDate(creationDate)}
                />
                <DetailsContent
                  avoidIconStyling
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  caption="Market cap"
                  content={marketCap}
                  icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                  withDenomination
                />
                <DetailsContent
                  avoidIconStyling
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  caption="Total revenue"
                  content={revenue}
                  icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                  withDenomination
                />
                <DetailsContent
                  avoidIconStyling
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  caption="Total revenue Shares"
                  content={revenueShare}
                  icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                  withDenomination
                />
                <DetailsContent
                  avoidIconStyling
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  caption="Total Transaction volume"
                  content={transactionVolume}
                  icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                  withDenomination
                />
              </DetailsBox>
            )}
          </StatisticsContainer>
        </>
      }
    />
  )
}
