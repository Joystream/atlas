import { useFeaturedNftsVideos } from '@/api/hooks/nfts'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'

export const PlaygroundMarketplaceCarousel = () => {
  const { nfts, loading } = useFeaturedNftsVideos()
  return <MarketplaceCarousel type="nft" nfts={nfts ?? []} isLoading={loading} />
}
