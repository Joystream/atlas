import { FC } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { Banner } from '@/components/Banner'
import { Section } from '@/components/Section/Section'
import { StyledSvgAlertsInformative24 } from '@/components/Tooltip/Tooltip.styles'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { createPlaceholderData } from '@/utils/data'

import { FeaturedNftsWrapper } from './FeaturedNftsSection.styles'

export const FeaturedNftsSection: FC = () => {
  const { activeChannel } = useUser()

  const { nfts, loading } = useNfts({
    variables: {
      limit: 50,
      orderBy: [OwnedNftOrderByInput.VideoViewsNumDesc],
      where: {
        isFeatured_eq: true,
        transactionalStatus: {
          isTypeOf_in: ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'],
          auction: {
            isCompleted_eq: false,
          },
        },
      },
    },
  })

  const items = loading ? createPlaceholderData(10) : nfts ?? []

  const mdMatch = useMediaMatch('md')

  return (
    <FeaturedNftsWrapper>
      {items.length >= 4 && (
        <Section
          headerProps={{
            start: {
              type: 'title',
              title: 'Featured',
            },
          }}
          contentProps={{
            type: 'carousel',
            children: items.map((nft, idx) => <NftTileViewer nftId={nft.id} key={`${nft.id}-${idx}`} />),
            canOverflowContainer: true,
            spaceBetween: mdMatch ? 24 : 16,
            minSlideWidth: 300,
            slidesPerView: 'auto',
          }}
        />
      )}
      {activeChannel && activeChannel.totalVideosCreated > 0 && (
        <Banner
          title="How to get featured?"
          icon={<StyledSvgAlertsInformative24 />}
          description="The Gleev team handpicks featured video NFTs as a way to recognize and promote high-quality content. To increase your chances of getting your NFT featured on the marketplace, upload videos related to web3 & crypto and make sure your NFT is up for sale."
          actionButton={{
            text: 'Submit your video NFT to be featured',
            onClick: () => {
              // todo
            },
          }}
        />
      )}
    </FeaturedNftsWrapper>
  )
}
