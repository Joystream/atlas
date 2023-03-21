import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { NftCarouselDetails } from '@/components/NftCarousel/components/MarketplaceCarouselCard/NftCarouselDetails'

type CrtCard = {
  type: 'crt'
}

type NftCard = {
  type: 'nft'
  nft: GetFeaturedNftsQuery['ownedNfts'][number]
}

type CardTypes = NftCard | CrtCard

type MarketplaceCarouselCardProps = {
  active: boolean
} & CardTypes

export const MarketplaceCarouselCard = (props: MarketplaceCarouselCardProps) => {
  const informations = () => {
    if (props.type === 'nft') {
      return <NftCarouselDetails {...props} />
    }

    return null
  }
  return informations()
}
