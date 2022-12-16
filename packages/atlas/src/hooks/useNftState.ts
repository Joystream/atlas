import BN from 'bn.js'

import { BasicNftFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { NftSaleType } from '@/joystream-lib/types'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: BasicNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock, currentBlockMsTimestamp } = useJoystreamStore()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const auction =
    (nft?.transactionalStatus?.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction) || null

  const hasTimersLoaded = !!currentBlock && !!currentBlockMsTimestamp
  const isOwner = nft?.owner.__typename === 'NftOwnerMember' ? nft.owner.member.id === activeMembership?.id : false
  const isBuyNow = nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const isIdle = nft?.transactionalStatus?.__typename === 'TransactionalStatusIdle'
  const englishAuction = auction?.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
  const openAuction = auction?.auctionType.__typename === 'AuctionTypeOpen' && auction.auctionType
  const isAuction = !!auction
  const isUserTopBidder = auction?.topBid?.bidder.id === activeMembership?.id
  const saleType: NftSaleType | null = isIdle ? null : isBuyNow ? 'buyNow' : englishAuction ? 'english' : 'open'

  const rawUserBid = (auction?.bids || []).find((bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id)
  const userBid = rawUserBid && {
    ...rawUserBid,
    amount: new BN(rawUserBid.amount),
  }

  const userBidUnlockBlock = openAuction && userBid ? userBid?.createdInBlock + openAuction.bidLockDuration : undefined
  const userBidUnlockBlockTimestamp = userBidUnlockBlock && convertBlockToMsTimestamp(userBidUnlockBlock)
  const userBidUnlockDate = userBidUnlockBlockTimestamp ? new Date(userBidUnlockBlockTimestamp) : undefined
  const userBidAmount = userBid?.amount
  const userBidCreatedAt = userBid?.createdAt ? new Date(userBid?.createdAt) : undefined

  const startsAtDateBlockTimestamp = isAuction && convertBlockToMsTimestamp(auction?.startsAtBlock)
  const startsAtDate = startsAtDateBlockTimestamp ? new Date(startsAtDateBlockTimestamp) : undefined

  const plannedEndDateBlockTimestamp = englishAuction && convertBlockToMsTimestamp(englishAuction.plannedEndAtBlock)
  const auctionPlannedEndDate = plannedEndDateBlockTimestamp ? new Date(plannedEndDateBlockTimestamp) : undefined

  const isExpired = englishAuction && currentBlock && currentBlock >= englishAuction.plannedEndAtBlock
  const isRunning = !!auction?.startsAtBlock && currentBlock && currentBlock >= auction.startsAtBlock && !isExpired
  const isUpcoming = !!auction?.startsAtBlock && currentBlock && currentBlock <= auction.startsAtBlock
  const needsSettling = auction?.topBid && isExpired

  let isUserWhitelisted = undefined

  if (activeMembership && auction) {
    isUserWhitelisted =
      auction.whitelistedMembers.length === 0 || isOwner
        ? true
        : auction.whitelistedMembers.some((whitelisted) => whitelisted.member.id === activeMembership.id)
  }

  const canBuyNow = !isOwner && ((!!Number(auction?.buyNowPrice) && isRunning) || isBuyNow) && isUserWhitelisted
  const canMakeBid = !isOwner && isAuction && isRunning && isUserWhitelisted
  const canPutOnSale = isOwner && isIdle
  const canCancelSale = isOwner && ((englishAuction && !auction.bids.length) || openAuction || isBuyNow)
  const canWithdrawBid = auction?.isCompleted || (openAuction && userBid && currentBlock >= (userBidUnlockBlock ?? 0))
  const canChangePrice = isBuyNow && isOwner
  const canReviewBid = isOwner && openAuction && auction?.topBid && !auction?.topBid.isCanceled

  const canChangeBid = !auction?.isCompleted && auction?.auctionType.__typename === 'AuctionTypeOpen' && userBid

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
    canChangeBid: !!canChangeBid,
    canMakeBid: !!canMakeBid,
    canCancelSale: !!canCancelSale,
    canPutOnSale: !!canPutOnSale,
    canChangePrice: canChangePrice,
    canReviewBid,
    needsSettling: !!needsSettling,
    canWithdrawBid: !!canWithdrawBid,
    auctionPlannedEndDate,
    plannedEndAtBlock:
      auction?.auctionType.__typename === 'AuctionTypeEnglish' ? auction?.auctionType.plannedEndAtBlock : undefined,
    startsAtBlock: auction?.startsAtBlock,
    isUserTopBidder,
    isUserWhitelisted,
    isOwner,
    isBuyNow,
    isAuction,
    isExpired,
    isRunning,
    englishTimerState,
    isUpcoming,
    videoId: nft?.id,
    userBid,
    userBidUnlockDate,
    userBidCreatedAt,
    userBidAmount,
    bids: auction?.bids,
    auction,
    startsAtDate,
    saleType,
    hasTimersLoaded,
  }
}
