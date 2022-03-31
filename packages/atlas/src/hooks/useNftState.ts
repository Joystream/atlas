import { AllNftFieldsFragment } from '@/api/queries'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { NftSaleType } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: AllNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock, currentBlockMsTimestamp } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const isOwner = nft?.ownerMember?.id === activeMembership?.id
  const isBuyNow = nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const isIdle = nft?.transactionalStatus?.__typename === 'TransactionalStatusIdle'
  const auction =
    (nft && nft.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction) ||
    null
  const englishAuction = auction?.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
  const openAuction = auction?.auctionType.__typename === 'AuctionTypeOpen' && auction.auctionType
  const isAuction = !!auction
  const isUserTopBidder = auction?.topBid?.bidder.id === activeMembership?.id
  const saleType: NftSaleType | null = isIdle ? null : isBuyNow ? 'buyNow' : englishAuction ? 'english' : 'open'

  const userBid = [...(auction?.bids ?? [])]
    .reverse()
    .find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)
  const userBidUnlockBlock = openAuction && userBid ? userBid?.createdInBlock + openAuction.bidLockDuration : undefined
  const userBidUnlockBlockTimestamp = userBidUnlockBlock && convertBlockToMsTimestamp(userBidUnlockBlock)
  const userBidUnlockDate = userBidUnlockBlockTimestamp ? new Date(userBidUnlockBlockTimestamp) : undefined

  const startsAtDateBlockTimestamp = isAuction && convertBlockToMsTimestamp(auction?.startsAtBlock)
  const startsAtDate = startsAtDateBlockTimestamp ? new Date(startsAtDateBlockTimestamp) : undefined

  const plannedEndDateBlockTimestamp = englishAuction && convertBlockToMsTimestamp(englishAuction.plannedEndAtBlock)
  const auctionPlannedEndDate = plannedEndDateBlockTimestamp ? new Date(plannedEndDateBlockTimestamp) : undefined

  const isExpired = englishAuction && currentBlock && currentBlock >= englishAuction.plannedEndAtBlock
  const isRunning = !!auction?.startsAtBlock && currentBlock && currentBlock >= auction.startsAtBlock && !isExpired
  const isUpcoming = !!auction?.startsAtBlock && currentBlock && currentBlock <= auction.startsAtBlock
  const needsSettling = auction?.topBid && isExpired

  const canBuyNow = !isOwner && (isBuyNow || !!auction?.buyNowPrice) && isRunning
  const canMakeBid = !isOwner && isAuction && isRunning
  const canPutOnSale = isOwner && isIdle
  const canCancelSale = isOwner && ((englishAuction && !auction.bids.length) || openAuction || isBuyNow)
  const canWithdrawBid = auction?.isCompleted || (openAuction && userBid && currentBlock >= (userBidUnlockBlock ?? 0))

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
    auctionPlannedEndDate,
    plannedEndAtBlock: auction?.plannedEndAtBlock,
    startsAtBlock: auction?.startsAtBlock,
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
    saleType,
  }
}
