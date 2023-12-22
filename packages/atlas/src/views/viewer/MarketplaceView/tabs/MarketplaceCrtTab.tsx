import BN from 'bn.js'

import { useGetBasicCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FallbackContainer } from '@/components/AllNftSection'
import { EmptyFallback } from '@/components/EmptyFallback'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section } from '@/components/Section/Section'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { CrtCard, CrtSaleTypes } from '@/components/_crt/CrtCard/CrtCard'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { DEFAULT_NFTS_GRID } from '@/styles'
import { TableFullWitdhtWrapper } from '@/views/viewer/MarketplaceView/MarketplaceView.styles'

export const MarketplaceCrtTab = () => {
  const { data } = useGetBasicCreatorTokenQuery({})
  const children = data?.creatorTokens.map(
    ({ id, symbol, channel, totalSupply, accountsNum, lastPrice, currentAmmSale, description, currentSale }) => {
      const status: CrtSaleTypes = currentSale
        ? {
            type: 'sale' as const,
            tokensSoldPercentage: 69,
          }
        : currentAmmSale
        ? {
            type: 'market' as const,
            transactionVolume: Number(currentAmmSale.burnedByAmm) + Number(currentAmmSale.mintedByAmm),
          }
        : {
            type: 'inactive' as const,
          }
      return (
        <CrtCard
          key={id}
          status={status}
          size="small"
          symbol={symbol ?? 'N/A'}
          avatar={channel?.channel.avatarPhoto?.resolvedUrls[0]}
          marketCap={
            lastPrice && totalSupply ? hapiBnToTokenNumber(new BN(lastPrice).mul(new BN(totalSupply))) ?? 0 : 0
          }
          description={description ?? ''}
          isVerified={false}
          name={symbol ?? 'N/A'}
          channelRevenue={hapiBnToTokenNumber(new BN(channel?.channel.cumulativeRevenue ?? 0))}
          accountsNum={accountsNum}
        />
      )
    }
  )

  return (
    <>
      <Section
        headerProps={{
          start: {
            type: 'title',
            title: 'All NFTs',
          },
        }}
        contentProps={{
          type: 'grid',
          grid: DEFAULT_NFTS_GRID,
          children: children?.length
            ? children
            : [
                <FallbackContainer key="fallback">
                  <EmptyFallback title="No NFTs found" subtitle="Please, try changing your filtering criteria." />
                </FallbackContainer>,
              ],
        }}
      />
      <TableFullWitdhtWrapper>
        <LimitedWidthContainer big noBottomPadding>
          <TopSellingChannelsTable withCrtOnly />
        </LimitedWidthContainer>
      </TableFullWitdhtWrapper>
    </>
  )
}
