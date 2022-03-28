import { AllNftFieldsFragment } from '@/api/queries'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: AllNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock, currentBlockMsTimestamp } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const isOwner = nft?.ownerMember?.id === activeMembership?.id
  const isBuyNow = nft && nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const auction =
    (nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction) ||
    null
  const isAuction = !!auction
  const isUserTopBidder = auction?.lastBid?.bidder.id === activeMembership?.id

  const userBid = [...(auction?.bids ?? [])]
    .reverse()
    .find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)
  const userBidUnlockBlock =
    auction?.auctionType.__typename === 'AuctionTypeOpen' && userBid
      ? userBid?.createdInBlock + auction.auctionType.bidLockingTime
      : undefined

  const userBidUnlockBlockTimestamp = userBidUnlockBlock && convertBlockToMsTimestamp(userBidUnlockBlock)
  const startsAtDateBlockTimestamp = isAuction && convertBlockToMsTimestamp(auction?.startsAtBlock)
  const plannedEndDAteBlockTimesamp =
    auction?.plannedEndAtBlock && convertBlockToMsTimestamp(auction?.plannedEndAtBlock)

  const userBidUnlockDate = userBidUnlockBlockTimestamp ? new Date(userBidUnlockBlockTimestamp) : undefined
  const startsAtDate = startsAtDateBlockTimestamp ? new Date(startsAtDateBlockTimestamp) : undefined

  const canBuyNow = nft && !isOwner && (isBuyNow || !!Number(auction?.buyNowPrice))

  const canMakeBid = nft && !isOwner && isAuction

  const canCancelSale =
    isOwner && auction?.auctionType.__typename === 'AuctionTypeEnglish'
      ? !auction?.bids.length
      : auction?.auctionType.__typename === 'AuctionTypeOpen' || isBuyNow

  const canWithdrawBid =
    auction?.isCompleted ||
    (auction?.auctionType.__typename === 'AuctionTypeOpen' && userBid && currentBlock >= (userBidUnlockBlock ?? 0))
  const canPutOnSale = nft && isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusIdle'

  const auctionPlannedEndDate = plannedEndDAteBlockTimesamp ? new Date(plannedEndDAteBlockTimesamp) : undefined

  const isExpired = !!auction?.plannedEndAtBlock && currentBlock && currentBlock >= auction.plannedEndAtBlock

  const isRunning = !!auction?.startsAtBlock && currentBlock && currentBlock >= auction.startsAtBlock && !isExpired

  const isUpcoming = !!auction?.startsAtBlock && currentBlock && currentBlock <= auction.startsAtBlock

  const needsSettling = auction?.lastBid && isExpired

  const englishTimerState: EnglishTimerState = isExpired
    ? 'expired'
    : isRunning
    ? 'running'
    : isUpcoming
    ? 'upcoming'
    : null

  return {
    timerLoading: !currentBlockMsTimestamp,
    canBuyNow: !!canBuyNow,
    canMakeBid: !!canMakeBid,
    canCancelSale: !!canCancelSale,
    canPutOnSale: !!canPutOnSale,
    needsSettling: !!needsSettling,
    canWithdrawBid: !!canWithdrawBid,
    auctionPlannedEndDate: auctionPlannedEndDate,
    //TODO: bidFromPreviousAuction
    bidFromPreviousAuction: undefined,
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
    userBidUnlockDate,
    auction,
    startsAtDate,
  }
}
