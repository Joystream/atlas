import styled from '@emotion/styled'
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
      <FullWidthWrapper>
        <MarketplaceCarousel type="nft" nfts={nfts} isLoading={loading} />
      </FullWidthWrapper>
      <FeaturedNftsSection />
      <TopSellingChannelsTable />
      <AllNftSection />
    </StyledLimitedWidth>
  )
}

export const FullWidthWrapper = styled.div`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
  overflow: hidden;
  position: relative;
`
