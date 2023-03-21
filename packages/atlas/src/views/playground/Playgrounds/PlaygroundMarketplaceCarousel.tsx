import { useFeaturedNfts } from '@/api/hooks/nfts'
import { MarketplaceCarousel } from '@/components/NftCarousel/MarketplaceCarousel'

export const PlaygroundMarketplaceCarousel = () => {
  const { nfts } = useFeaturedNfts()
  return <MarketplaceCarousel type="nft" nfts={nfts} />
}
