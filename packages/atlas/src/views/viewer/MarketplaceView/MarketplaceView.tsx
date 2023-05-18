import { FC } from 'react'

import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'
import { FullWidthWrapper, MarketplaceWrapper, TableFullWitdhtWrapper } from './MarketplaceView.styles'

export const MarketplaceView: FC = () => {
  const headTags = useHeadTags('Marketplace')
  const { nfts, loading } = useFeaturedNftsVideos()

  return (
    <MarketplaceWrapper>
      {headTags}
      <FullWidthWrapper>
        <MarketplaceCarousel type="nft" nfts={nfts} isLoading={loading} />
      </FullWidthWrapper>
      <LimitedWidthContainer big noBottomPadding>
        <FeaturedNftsSection />
      </LimitedWidthContainer>
      <TableFullWitdhtWrapper>
        <LimitedWidthContainer big noBottomPadding>
          <TopSellingChannelsTable />
        </LimitedWidthContainer>
      </TableFullWitdhtWrapper>
      <LimitedWidthContainer big noBottomPadding>
        <AllNftSection />
      </LimitedWidthContainer>
    </MarketplaceWrapper>
  )
}
