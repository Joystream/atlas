import BN from 'bn.js'
import { FC, useCallback, useMemo, useRef, useState } from 'react'

import { useGetHistoricalTokenAllocationQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenSilver24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { BuyFromMarketButton } from '@/components/_crt/BuyFromMarketButton/BuyFromMarketButton'
import { SellOnMarketButton } from '@/components/_crt/SellOnMarketButton/SellOnMarketButton'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { calcBuyMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
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
    onError: (error) => {
      SentryLogger.error('Failed to fetch token allocation query', 'CrtStatusWidget', error)
    },
  })

  const totalVolume = useMemo(() => {
    return token.ammCurves.reduce((prev, next) => prev + Number(next.mintedByAmm) + Number(next.burnedByAmm), 0)
  }, [token.ammCurves])

  const status = token.ammCurves.some((curve) => !curve.finalized) ? 'market' : 'inactive'

  return (
    <Widget
      title={status === 'inactive' ? 'Status' : ''}
      customNode={
        <>
          {status === 'inactive' ? <InactiveDetails /> : status === 'market' ? <MarketDetails token={token} /> : null}

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

const InactiveDetails = () => {
  return (
    <Text as="h4" variant="h500">
      No active sale
    </Text>
  )
}

const MarketDetails = ({ token }: { token: FullCreatorTokenFragment }) => {
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
    <FlexBox flow="column" gap={3}>
      <DetailsContent
        caption="PRICE PER UNIT"
        content={calculateSlippageAmount(1) ?? 0}
        icon={<SvgJoyTokenSilver24 />}
        withDenomination
        tileSize="big"
        tooltipText="Price per unit is calculated for current market supply and can quickly change."
      />
      <FlexBox equalChildren width="100%" gap={2}>
        <SellOnMarketButton tokenId={token.id} />
        <BuyFromMarketButton tokenId={token.id} />
      </FlexBox>

      <SupplyLine>
        <Text as="span" variant="t100" color="colorText">
          Type:
        </Text>
        <Text variant="t100" as="p">
          Market
        </Text>
        <Information text="An automated market maker (AMM) is an algorithm that helps to buy and sell tokens by using price curves which automatically set prices and match buyers and sellers." />
      </SupplyLine>
    </FlexBox>
  )
}
