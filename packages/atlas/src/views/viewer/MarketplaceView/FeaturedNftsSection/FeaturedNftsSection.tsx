import { FC } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { Banner } from '@/components/Banner'
import { CarouselProps } from '@/components/Carousel'
import { Section } from '@/components/Section/Section'
import { StyledSvgAlertsInformative24 } from '@/components/Tooltip/Tooltip.styles'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'
import { breakpoints } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { FeaturedNftsWrapper } from './FeaturedNftsSection.styles'

const responsive: CarouselProps['breakpoints'] = {
  [parseInt(breakpoints.xxs)]: {
    slidesPerView: 1.2,
    slidesPerGroup: 1,
  },
  [parseInt(breakpoints.xs)]: {
    slidesPerView: 1.4,
    slidesPerGroup: 1,
  },
  [parseInt(breakpoints.sm)]: {
    slidesPerView: 2.2,
    slidesPerGroup: 2,
  },
  [parseInt(breakpoints.md)]: {
    slidesPerView: 3,
    slidesPerGroup: 3,
  },
  [parseInt(breakpoints.lg)]: {
    slidesPerView: 4,
    slidesPerGroup: 4,
  },
  [parseInt(breakpoints.xl)]: {
    slidesPerView: 5,
    slidesPerGroup: 5,
  },
  [parseInt(breakpoints.xxl)]: {
    slidesPerView: 6,
    slidesPerGroup: 6,
  },
}

export const FeaturedNftsSection: FC = () => {
  const { activeChannel } = useUser()

  const { nfts, loading } = useNfts({
    variables: {
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

  const { currentBlock } = useJoystreamStore()

  // 1. English auctions(not upcoming) first - sorted by blocks left
  const englishAuctions = nfts
    ?.filter(
      (nft) =>
        nft.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
        nft.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeEnglish' &&
        nft.transactionalStatus.auction.startsAtBlock < currentBlock
    )
    .sort((a, b) => {
      const aBlocksLeft =
        ((a.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
          a.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeEnglish' &&
          a.transactionalStatus.auction.auctionType.plannedEndAtBlock) ||
          0) - currentBlock
      const bBlocksLeft =
        ((b.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
          b.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeEnglish' &&
          b.transactionalStatus.auction.auctionType.plannedEndAtBlock) ||
          0) - currentBlock

      return aBlocksLeft - bBlocksLeft
    })

  // 2. Open and buy now auctions(not upcoming) - sorted by popularity
  const openAuctionsAndBuyNowAuctions = nfts
    ?.filter(
      (nft) =>
        nft.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
        nft.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeOpen' &&
        nft.transactionalStatus.auction.startsAtBlock < currentBlock
    )
    .sort((a, b) => b.video.viewsNum - a.video.viewsNum)

  // 3. Upcoming auctions - sorted by planned start
  const plannedAuctions = nfts
    ?.filter(
      (nft) =>
        nft.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
        nft.transactionalStatus.auction.startsAtBlock > currentBlock
    )
    .sort((a, b) => {
      const aPlannedStart =
        ((a.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
          a.transactionalStatus.auction.startsAtBlock) ||
          0) - currentBlock
      const bPlannedStart =
        ((b.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
          b.transactionalStatus.auction.startsAtBlock) ||
          0) - currentBlock

      return aPlannedStart - bPlannedStart
    })

  const sorted = [...(englishAuctions || []), ...(openAuctionsAndBuyNowAuctions || []), ...(plannedAuctions || [])]

  const items = loading ? createPlaceholderData(10) : sorted ?? []

  const mdMatch = useMediaMatch('md')

  if ((!activeChannel || activeChannel?.totalVideosCreated === 0) && items.length === 0) {
    return null
  }

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
            children: items.map((nft, idx) => <NftTileViewer nftId={nft.id} key={idx} />),
            canOverflowContainer: true,
            spaceBetween: mdMatch ? 24 : 16,
            breakpoints: responsive,
          }}
        />
      )}
      {activeChannel && activeChannel.totalVideosCreated > 0 && (
        <Banner
          title="How to get featured?"
          icon={<StyledSvgAlertsInformative24 />}
          description={`The ${
            atlasConfig.general.appName
          } team handpicks featured video NFTs as a way to recognize and promote high-quality content. To increase your chances of getting your NFT featured on the marketplace, ${
            atlasConfig.general.appContentFocus
              ? `upload videos related to ${atlasConfig.general.appContentFocus} and `
              : ''
          }make sure your NFT is up for sale.`}
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
