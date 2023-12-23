import { FC, useState } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { Banner } from '@/components/Banner'
import { CarouselProps } from '@/components/Carousel'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section } from '@/components/Section/Section'
import { StyledSvgAlertsInformative24 } from '@/components/Tooltip/Tooltip.styles'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'
import { breakpoints } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { FeatureNftModal } from './FeatureNftModal'
import { FeaturedNftsWrapper } from './FeaturedNftsSection.styles'

export const responsive: CarouselProps['breakpoints'] = {
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
  const [isFeatureNftModalOpen, setIsFeatureNfrModalOpen] = useState(false)
  const { currentBlock } = useJoystreamStore()
  const { trackFeaturedNFTNext, trackFeaturedNFTPrev } = useSegmentAnalytics()

  const { nfts, loading } = useNfts({
    variables: {
      where: {
        isFeatured_eq: true,
      },
    },
  })
  const nftsToSort = nfts || []

  // 1. English auctions(not upcoming) first - sorted by blocks left
  const englishAuctions = nftsToSort
    .filter(
      (nft) =>
        nft.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
        nft.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeEnglish' &&
        nft.transactionalStatus.auction.startsAtBlock < currentBlock &&
        nft.transactionalStatus.auction.auctionType.plannedEndAtBlock > currentBlock
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
  const openAuctionsAndBuyNowAuctions = nftsToSort
    .filter(
      (nft) =>
        nft.transactionalStatus?.__typename === 'TransactionalStatusBuyNow' ||
        (nft.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
          nft.transactionalStatus.auction.auctionType.__typename === 'AuctionTypeOpen' &&
          nft.transactionalStatus.auction.startsAtBlock < currentBlock)
    )
    .sort((a, b) => b.video.viewsNum - a.video.viewsNum)

  // 3. Upcoming auctions - sorted by planned start
  const plannedAuctions = nftsToSort
    .filter(
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

  // 4. Not for sale - sorted by popularity

  const notForSale = nftsToSort
    .filter((nft) => nft.transactionalStatus?.__typename === 'TransactionalStatusIdle')
    .sort((a, b) => b.video.viewsNum - a.video.viewsNum)

  const sortedNfts = [...englishAuctions, ...openAuctionsAndBuyNowAuctions, ...plannedAuctions, ...notForSale]

  const items = loading ? createPlaceholderData(10) : sortedNfts ?? []

  const mdMatch = useMediaMatch('md')

  if ((!activeChannel || activeChannel?.totalVideosCreated === 0) && items.length === 0) {
    return null
  }

  return (
    <LimitedWidthContainer big noBottomPadding fullWidth>
      <FeaturedNftsWrapper>
        <FeatureNftModal isOpen={isFeatureNftModalOpen} onClose={() => setIsFeatureNfrModalOpen(false)} />
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
              children: items.map((nft, idx) => <NftTileViewer isInCarousel nftId={nft.id} key={idx} />),
              spaceBetween: mdMatch ? 24 : 16,
              breakpoints: responsive,
            }}
            slideCallbacks={{
              slideLeftCallback: (page) => trackFeaturedNFTPrev(page),
              slideRightCallback: (page) => trackFeaturedNFTNext(page),
            }}
          />
        )}
        {activeChannel && activeChannel.totalVideosCreated > 0 && (
          <Banner
            title="How to get featured?"
            icon={<StyledSvgAlertsInformative24 />}
            description={`The ${atlasConfig.general.appName} team handpicks featured video NFTs as a way to recognize and promote high-quality content. To increase your chances of getting your NFT featured on the marketplace, make sure your NFT is up for sale.`}
            actionButton={{
              text: 'Submit your video NFT to be featured',
              onClick: () => {
                setIsFeatureNfrModalOpen(true)
              },
            }}
          />
        )}
      </FeaturedNftsWrapper>
    </LimitedWidthContainer>
  )
}
