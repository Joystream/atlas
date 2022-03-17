import { Nft } from '@/api/hooks'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export const useNftState = (nft?: Nft) => {
  const { activeMembership } = useUser()
  const { getCurrentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const userBid =
    nft &&
    nft.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus?.auction?.bids.find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)

  const isOwner = nft?.ownerMember?.id === activeMembership?.id

  const isBuyNow = nft && nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const isAuction = nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction'

  const canBuyNow =
    nft &&
    !isOwner &&
    (isBuyNow ||
      (nft.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
        !!nft.transactionalStatus.auction?.buyNowPrice))

  const canMakeBid = nft && !isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusAuction'

  const canCancelSale =
    nft &&
    isOwner &&
    ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'].includes(nft.transactionalStatus.__typename)

  const canWithdrawBid =
    (nft &&
      nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
      nft.transactionalStatus.auction?.isCompleted) ||
    (nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
      nft?.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen' &&
      userBid &&
      nft?.transactionalStatus.auction.auctionType.bidLockingTime + userBid.createdInBlock > getCurrentBlock())

  const canPutOnSale = nft && isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusIdle'

  const auctionPlannedEndDate =
    nft &&
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.plannedEndAtBlock &&
    new Date(convertBlockToMsTimestamp(nft.transactionalStatus.auction.plannedEndAtBlock))

  const isExpired =
    nft &&
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    !!nft.transactionalStatus.auction?.plannedEndAtBlock &&
    nft.transactionalStatus.auction.plannedEndAtBlock <= getCurrentBlock()

  const isRunning =
    nft &&
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    !!nft.transactionalStatus.auction?.startsAtBlock &&
    getCurrentBlock() >= nft.transactionalStatus.auction.startsAtBlock

  const isUpcoming =
    nft &&
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    !!nft.transactionalStatus.auction?.startsAtBlock &&
    getCurrentBlock() <= nft.transactionalStatus.auction?.startsAtBlock

  const needsSettling =
    nft &&
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    !!nft.transactionalStatus.auction?.lastBid &&
    isExpired

  return {
    canBuyNow: !!canBuyNow || false,
    canMakeBid: !!canMakeBid || false,
    canCancelSale: !!canCancelSale || false,
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
  }
}
