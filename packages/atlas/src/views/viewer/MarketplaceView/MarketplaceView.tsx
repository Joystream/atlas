import { FC } from 'react'

import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'
import { MarketplaceWrapper, TableFullWitdhtWrapper } from './MarketplaceView.styles'

const MarketplaceView: FC = () => {
  const headTags = useHeadTags('Marketplace')
  const { nfts, loading } = useFeaturedNftsVideos()

  return (
    <MarketplaceWrapper>
      {headTags}
      <MarketplaceCarousel type="nft" nfts={nfts} isLoading={loading} />
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

export default MarketplaceView
