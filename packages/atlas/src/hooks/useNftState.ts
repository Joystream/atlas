import { AllNftFieldsFragment } from '@/api/queries'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: AllNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const isOwner = nft?.ownerMember?.id === activeMembership?.id
  const isBuyNow = nft && nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const auction =
    (nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction) ||
    null
  const isAuction = !!auction
  const isUserTopBidder = auction?.lastBid?.bidder.id === activeMembership?.id

  const userBid = auction?.bids.find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)

  const startsAtDate = isAuction ? new Date(convertBlockToMsTimestamp(auction.startsAtBlock)) : undefined

  const canBuyNow = nft && !isOwner && (isBuyNow || !!auction?.buyNowPrice)

  const canMakeBid = nft && !isOwner && isAuction

  const canCancelSale =
    isOwner && auction?.auctionType.__typename === 'AuctionTypeEnglish'
      ? !auction?.bids.length
      : auction?.auctionType.__typename === 'AuctionTypeOpen' || isBuyNow

  const canWithdrawBid =
    auction?.isCompleted ||
    (auction?.auctionType.__typename === 'AuctionTypeOpen' &&
      userBid &&
      auction.auctionType.bidLockingTime + userBid.createdInBlock > currentBlock)

  const canPutOnSale = nft && isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusIdle'

  const auctionPlannedEndDate = auction?.plannedEndAtBlock
    ? new Date(convertBlockToMsTimestamp(auction.plannedEndAtBlock))
    : undefined

  const isExpired = !!auction?.plannedEndAtBlock && currentBlock >= auction.plannedEndAtBlock

  const isRunning = !!auction?.startsAtBlock && currentBlock >= auction.startsAtBlock && !isExpired

  const isUpcoming = !!auction?.startsAtBlock && currentBlock <= auction.startsAtBlock

  const needsSettling = auction?.lastBid && isExpired

  const englishTimerState: EnglishTimerState = isExpired
    ? 'expired'
    : isRunning
    ? 'running'
    : isUpcoming
    ? 'upcoming'
    : null
  return {
    canBuyNow: !!canBuyNow,
    canMakeBid: !!canMakeBid,
    canCancelSale: !!canCancelSale,
    canPutOnSale: !!canPutOnSale,
    needsSettling: !!needsSettling,
    canWithdrawBid: !!canWithdrawBid,
    auctionPlannedEndDate: auctionPlannedEndDate,
    //TODO: bidFromPreviousAuction
    bidFromPreviousAuction: userBid,
    isUserTopBidder,
    isOwner,
    isBuyNow,
    isAuction,
    isExpired,
    isRunning,
    englishTimerState,
    isUpcoming,
    videoId: nft?.video.id,
    userBid,
    auction,
    startsAtDate,
  }
}
