import { FC } from 'react'

import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'
import { StyledLimitedWidth } from './MarketplaceView.styles'

export const MarketplaceView: FC = () => {
  const headTags = useHeadTags('Marketplace')
  const { nfts, loading } = useFeaturedNftsVideos()

  return (
    <StyledLimitedWidth big>
      {headTags}
      <MarketplaceCarousel type="nft" nfts={nfts} isLoading={loading} />
      <FeaturedNftsSection />
      <TopSellingChannelsTable />
      <AllNftSection />
    </StyledLimitedWidth>
  )
}
