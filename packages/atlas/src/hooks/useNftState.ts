import { useBids } from '@/api/hooks/bids'
import { AllNftFieldsFragment } from '@/api/queries'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { NftSaleType } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

export type EnglishTimerState = 'expired' | 'running' | 'upcoming' | null

export const useNftState = (nft?: AllNftFieldsFragment | null) => {
  const { activeMembership } = useUser()
  const { currentBlock, currentBlockMsTimestamp } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  // TODO: refetch after we withdrawBid but how?
  const { bids: userBids } = useBids(
    {
      where: {
        isCanceled_eq: false,
        nft: { id_eq: nft?.id },
        bidder: { id_eq: activeMembership?.id },
      },
    },
    {
      skip: !nft?.id || !activeMembership?.id,
      onError: (error) =>
        SentryLogger.error('Failed to fetch member bids', 'useNftState', error, {
          data: {
            nft: nft?.id,
            member: activeMembership?.id,
          },
        }),
    }
  )

  const auction = nft?.transactionalStatusAuction || null

  const unwithdrawnUserBids = userBids?.filter(
    (bid) =>
      bid.auction.auctionType.__typename === 'AuctionTypeOpen' &&
      bid.auction.id !== auction?.id &&
      bid.auction.winningMemberId !== activeMembership?.id
  )

  console.log({ unwithdrawnUserBids, userBids })

  const hasTimersLoaded = !!currentBlock && !!currentBlockMsTimestamp
  const isOwner = nft?.ownerMember?.id === activeMembership?.id
  const isBuyNow = nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'
  const isIdle = nft?.transactionalStatus?.__typename === 'TransactionalStatusIdle'
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

  let isUserWhitelisted = undefined

  if (activeMembership && auction) {
    isUserWhitelisted =
      auction.whitelistedMembers.length === 0
        ? true
        : auction.whitelistedMembers.some((member) => member.id === activeMembership.id)
  }

  const canBuyNow = !isOwner && (isBuyNow || !!Number(auction?.buyNowPrice)) && isRunning
  const canMakeBid = !isOwner && isAuction && isRunning && isUserWhitelisted
  const canPutOnSale = isOwner && isIdle
  const canCancelSale = isOwner && ((englishAuction && !auction.bids.length) || openAuction || isBuyNow)
  const canWithdrawBid = auction?.isCompleted || (openAuction && userBid && currentBlock >= (userBidUnlockBlock ?? 0))
  const canChangePrice = isBuyNow && isOwner

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
    needsSettling: !!needsSettling,
    canWithdrawBid: !!canWithdrawBid,
    auctionPlannedEndDate,
    plannedEndAtBlock:
      auction?.auctionType.__typename === 'AuctionTypeEnglish' ? auction?.auctionType.plannedEndAtBlock : undefined,
    startsAtBlock: auction?.startsAtBlock,
    bidFromPreviousAuction: unwithdrawnUserBids?.[0],
    isUserTopBidder,
    isUserWhitelisted,
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
    hasTimersLoaded,
  }
}
