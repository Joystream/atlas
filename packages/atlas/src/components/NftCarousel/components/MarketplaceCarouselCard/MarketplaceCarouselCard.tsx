import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'
import { NftCarouselDetails } from '@/components/NftCarousel/components/MarketplaceCarouselCard/NftCarouselDetails'

type CrtCard = {
  type: 'crt'
}

type NftCard = {
  type: 'nft'
  nft: GetFeaturedNftsVideosQuery['ownedNfts'][number]
}

type CardTypes = NftCard | CrtCard

type MarketplaceCarouselCardProps = {
  active: boolean
  slideNext: () => void
} & CardTypes

export const MarketplaceCarouselCard = (props: MarketplaceCarouselCardProps) => {
  if (props.type === 'nft') {
    return <NftCarouselDetails {...props} />
  }

  return null
}
