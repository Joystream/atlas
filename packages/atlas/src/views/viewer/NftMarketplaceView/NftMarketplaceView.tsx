import styled from '@emotion/styled'

import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'
import { cVar, media, sizes } from '@/styles'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'

export const NftMarketplaceView = () => {
  const headTags = useHeadTags('NFT - Marketplace')

  const { nfts, loading } = useFeaturedNftsVideos()

  return (
    <MarketplaceWrapper>
      {headTags}
      <MarketplaceCarousel type="nft" nfts={nfts ?? []} isLoading={loading} />
      <FeaturedNftsSection />
      <TableFullWitdhtWrapper>
        <LimitedWidthContainer big noBottomPadding>
          <TopSellingChannelsTable />
        </LimitedWidthContainer>
      </TableFullWitdhtWrapper>
      <LimitedWidthContainer big noBottomPadding fullWidth>
        <AllNftSection />
      </LimitedWidthContainer>
    </MarketplaceWrapper>
  )
}

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
