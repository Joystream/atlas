import BN from 'bn.js'
import { FC, useCallback, useMemo, useRef, useState } from 'react'

import { useGetHistoricalTokenAllocationQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenSilver24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { BuyFromMarketButton } from '@/components/_crt/BuyFromMarketButton/BuyFromMarketButton'
import { SellOnMarketButton } from '@/components/_crt/SellOnMarketButton/SellOnMarketButton'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { calcBuyMarketPricePerToken } from '@/utils/crts'
import { formatDate } from '@/utils/time'

import { Drawer, StatisticsContainer, SupplyLine, ToggleContainer, Widget } from './CrtStatusWidget.styles'

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
  const status = token.ammCurves.some((curve) => !curve.finalized) ? 'market' : 'inactive'

  return (
    <Widget
      title={status === 'inactive' ? 'Status' : ''}
      customNode={
        <>
          {status === 'inactive' ? (
            <InactiveDetails symbol={ticker} totalSupply={+token.totalSupply} />
          ) : status === 'market' ? (
            <MarketDetails token={token} symbol={ticker} totalSupply={+token.totalSupply} />
          ) : null}

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

const MarketDetails = ({
  symbol,
  totalSupply,
  token,
}: {
  symbol: string
  totalSupply: number | BN
  token: FullCreatorTokenFragment
}) => {
  const calculateSlippageAmount = useCallback(
    (amount: number) => {
      const currentAmm = token?.ammCurves.find((amm) => !amm.finalized)
      return calcBuyMarketPricePerToken(
        currentAmm?.mintedByAmm,
        currentAmm?.ammSlopeParameter,
        currentAmm?.ammInitPrice,
        amount
      )
    },
    [token]
  )
  return (
    <>
      <DetailsContent
        caption="PRICE PER UNIT"
        content={calculateSlippageAmount(1) ?? 0}
        icon={<SvgJoyTokenSilver24 />}
        withDenomination
        tileSize="big"
        tooltipText="Lorem ipsum"
      />
      <FlexBox equalChildren width="100%" gap={2}>
        <SellOnMarketButton tokenId={token.id} />
        <BuyFromMarketButton tokenId={token.id} />
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
