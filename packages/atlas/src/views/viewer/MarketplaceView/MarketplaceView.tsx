import { FC } from 'react'

import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { Text } from '@/components/Text'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'
import { StyledLimitedWidth } from './MarketplaceView.styles'

export const MarketplaceView: FC = () => {
  const headTags = useHeadTags('Marketplace')
  const { nfts, loading } = useFeaturedNftsVideos(5)
  const lgMatch = useMediaMatch('lg')

  return (
    <StyledLimitedWidth big>
      {headTags}
      <Text as="h1" variant={lgMatch ? 'h700' : 'h600'}>
        Marketplace
      </Text>
      <MarketplaceCarousel type="nft" nfts={nfts} isLoading={loading} />
      <FeaturedNftsSection />
      <TopSellingChannelsTable />
      <AllNftSection />
    </StyledLimitedWidth>
  )
}
