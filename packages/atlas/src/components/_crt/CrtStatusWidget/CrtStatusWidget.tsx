import BN from 'bn.js'
import { FC, useRef, useState } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat, NumberFormatProps } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatDate } from '@/utils/time'

import { Drawer, StatisticsContainer, SupplyLine, ToggleContainer, Widget } from './CrtStatusWidget.styles'

type Amount = NumberFormatProps['value']
export type CrtStatusWidgetProps = {
  name: string
  creationDate: Date
  supply: Amount
  marketCap: Amount
  revenue: Amount
  revenueShare: Amount
  transactionVolume: Amount
  status: 'inactive' | 'sale' | 'market'
}

export const CrtStatusWidget: FC<CrtStatusWidgetProps> = ({
  name,
  creationDate,
  supply,
  marketCap,
  revenue,
  revenueShare,
  transactionVolume,
  status,
}) => {
  const drawer = useRef<HTMLDivElement>(null)
  const [isExpanded, expand] = useState(true)
  const smMatch = useMediaMatch('sm')

  const ticker = `$${name}`

  return (
    <Widget
      title={status === 'inactive' ? 'Status' : ''}
      customNode={
        <>
          {status === 'inactive' ? (
            <InactiveDetails symbol={ticker} totalSupply={supply} />
          ) : status === 'sale' ? null : (
            <MarketDetails symbol={ticker} totalSupply={supply} />
          )}

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
            </Drawer>
          </StatisticsContainer>
        </>
      }
    />
  )
}

const InactiveDetails = ({ symbol, totalSupply }: { symbol: string; totalSupply: number | BN }) => {
  return (
    <>
      <Text as="h4" variant="h500">
        No active sale
      </Text>
      <SupplyLine>
        <Text as="span" variant="t100" color="colorText">
          Total supply:
        </Text>
        <NumberFormat as="span" variant="t100" format="short" value={totalSupply} customTicker={symbol} withToken />
        <Information />
      </SupplyLine>
    </>
  )
}

const MarketDetails = ({ symbol, totalSupply }: { symbol: string; totalSupply: number | BN }) => {
  return (
    <>
      <DetailsContent
        caption="PRICE PER UNIT"
        content={1000}
        withDenomination
        tileSize="big"
        tooltipText="Lorem ipsum"
      />
      <FlexBox equalChildren width="100%" gap={2}>
        <Button size="large" variant="secondary">
          Sell
        </Button>
        <Button size="large">Buy</Button>
      </FlexBox>

      <FlexBox width="100%" justifyContent="space-between">
        <SupplyLine>
          <Text as="span" variant="t100" color="colorText">
            Type:
          </Text>
          <Text variant="t100" as="p">
            Market
          </Text>
          <Information />
        </SupplyLine>
        <SupplyLine>
          <Text as="span" variant="t100" color="colorText">
            Total supply:
          </Text>
          <NumberFormat as="span" variant="t100" format="short" value={totalSupply} customTicker={symbol} withToken />
          <Information />
        </SupplyLine>
      </FlexBox>
    </>
  )
}
