import { useFeaturedNfts } from '@/api/hooks/nfts'
import { NftCarousel } from '@/components/NftCarousel/NftCarousel'

export const PlaygroundMarketplaceCarousel = () => {
  const { nfts } = useFeaturedNfts()
  return <NftCarousel type="nft" nfts={nfts} />
}
