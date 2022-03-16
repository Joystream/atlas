import { AllNftFieldsFragment } from '@/api/queries'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: AllNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const userBid =
    nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction'
      ? nft.transactionalStatus?.auction?.bids.find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)
      : undefined

  const isOwner = nft?.ownerMember?.id === activeMembership?.id

  const isBuyNow = nft && nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const auction =
    (nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction) ||
    null
  const isAuction = !!auction

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

  const auctionPlannedEndDate =
    auction?.plannedEndAtBlock && new Date(convertBlockToMsTimestamp(auction.plannedEndAtBlock))

  const isExpired = !!auction?.plannedEndAtBlock && auction.plannedEndAtBlock <= currentBlock

  const isRunning = !!auction?.startsAtBlock && currentBlock >= auction.startsAtBlock

  const isUpcoming = !!auction?.startsAtBlock && currentBlock <= auction?.startsAtBlock

  const needsSettling = auction?.lastBid && isExpired

  return {
    canBuyNow: !!canBuyNow || false,
    canMakeBid: !!canMakeBid || false,
    canCancelSale: canCancelSale || false,
    canPutOnSale: !!canPutOnSale || false,
    needsSettling: !!needsSettling || false,
    canWithdrawBid: !!canWithdrawBid || false,
    auctionPlannedEndDate: auctionPlannedEndDate || undefined,
    isOwner,
    isBuyNow,
    isAuction,
    isExpired,
    isRunning,
    isUpcoming,
    videoId: nft?.video.id,
    userBid,
    auction,
  }
}
