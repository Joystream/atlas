import { GetBasicCreatorTokensQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'

import { CrtCarouselDetails } from './types/CrtCarouselDetails'
import { NftCarouselDetails } from './types/NftCarouselDetails'

type CrtCard = {
  type: 'crt'
  crt: GetBasicCreatorTokensQuery['creatorTokens'][number]
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

  if (props.type === 'crt') {
    return <CrtCarouselDetails {...props} />
  }

  return null
}
