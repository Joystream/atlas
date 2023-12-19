import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { AllNftSection } from '@/components/AllNftSection'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable'
import { useHeadTags } from '@/hooks/useHeadTags'
import { FeaturedNftsSection } from '@/views/viewer/MarketplaceView/FeaturedNftsSection/FeaturedNftsSection'
import { TableFullWitdhtWrapper } from '@/views/viewer/MarketplaceView/MarketplaceView.styles'

export const MarketplaceNftTab = () => {
  const headTags = useHeadTags('NFT - Marketplace')

  const { nfts, loading } = useFeaturedNftsVideos()

  return (
    <>
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
    </>
  )
}
