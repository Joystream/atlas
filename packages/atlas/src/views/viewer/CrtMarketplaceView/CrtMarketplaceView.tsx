import styled from '@emotion/styled'
import BN from 'bn.js'

import { CreatorTokenOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetBasicCreatorTokensQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { Section } from '@/components/Section/Section'
import { TopEarningChannels } from '@/components/TopEarningChannels'
import { AllTokensSection } from '@/components/_crt/AllTokensSection'
import { CrtCard, CrtSaleTypes } from '@/components/_crt/CrtCard/CrtCard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { cVar, media, sizes } from '@/styles'

import { responsive } from '../NftMarketplaceView/FeaturedNftsSection/FeaturedNftsSection'

export const CrtMarketplaceView = () => {
  const headTags = useHeadTags('CRT - Marketplace')
  const mdMatch = useMediaMatch('md')
  const { data, loading } = useGetBasicCreatorTokensQuery({
    variables: {
      where: {
        isFeatured_eq: true,
      },
      orderBy: CreatorTokenOrderByInput.CurrentAmmSaleMintedByAmmDesc,
    },
  })

  const filteredTokens = data?.creatorTokens.filter((token) => !!token.trailerVideo.length).slice(0, 10) ?? []

  const featuredCrts =
    data?.creatorTokens.map(
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
          <StyledCrtCard
            key={id}
            status={status}
            channelId={channel?.channel.id ?? ''}
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
    ) ?? []

  return (
    <MarketplaceWrapper>
      {headTags}
      <MarketplaceCarousel type="crt" crts={filteredTokens ?? []} isLoading={loading} />

      {featuredCrts.length > 4 && (
        <Section
          headerProps={{
            start: {
              type: 'title',
              title: 'Featured',
            },
          }}
          contentProps={{
            type: 'carousel',
            children: featuredCrts,
            spaceBetween: mdMatch ? 24 : 16,
            breakpoints: responsive,
          }}
        />
      )}
      <TableFullWitdhtWrapper>
        <LimitedWidthContainer big noBottomPadding>
          <TopEarningChannels withCrtOnly />
        </LimitedWidthContainer>
      </TableFullWitdhtWrapper>
      <AllTokensSection />
    </MarketplaceWrapper>
  )
}

const StyledCrtCard = styled(CrtCard)`
  min-height: 100%;
`

const MarketplaceWrapper = styled.div`
  padding: ${sizes(4)} 0;
  display: grid;
  gap: ${sizes(8)};
  ${media.md} {
    padding: ${sizes(8)} 0;
    gap: ${sizes(16)};
  }
`

const TableFullWitdhtWrapper = styled.div`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(8)} var(--size-global-horizontal-padding);

  ${media.md} {
    padding: ${sizes(16)} var(--size-global-horizontal-padding);
  }
`
