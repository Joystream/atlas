import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useNft } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { TextField } from '@/components/_inputs/TextField'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NftCard } from '@/components/_nft/NftCard'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useNftState } from '@/hooks/useNftState'
import { useSubscribeAccountBalance } from '@/hooks/useSubscribeAccountBalance'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useCurrentBlockStore } from '@/providers/currentBlock'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumberShort, formatTokens } from '@/utils/number'
import { formatDateTime, formatDurationShort } from '@/utils/time'

import {
  ActionBarCell,
  ActiveBidWrapper,
  BidAmount,
  BuyNowInfo,
  Content,
  CurrentBidWrapper,
  Divider,
  FlexWrapper,
  Header,
  InnerContainer,
  Messages,
  MinimumBid,
  MinimumBidWrapper,
  NftPreview,
  PaymentSplitValues,
  PaymentSplitWrapper,
  PlaceBidWrapper,
  Row,
  StyledJoyTokenIcon,
  TokenWrapper,
} from './NftPurchaseBottomDrawer.styles'

const TRANSACTION_FEE = 0

export const NftPurchaseBottomDrawer: React.FC = () => {
  const { displaySnackbar } = useSnackbar()
  const [type, setType] = useState<'english_auction' | 'open_auction' | 'buy_now'>('english_auction')
  const [showBuyNowInfo, setBuyNowInfo] = useState(false)
  const { currentAction, closeNftAction, currentNftId, isBuyNowClicked } = useNftActions()
  const { nft, nftStatus, loading, refetch } = useNft(currentNftId || '')
  const { userBid, canChangeBid, userBidUnlockDate } = useNftState(nft)
  const { isLoadingAsset: thumbnailLoading, url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)
  const { url: creatorAvatarUrl } = useAsset(nft?.video.channel.avatarPhoto)
  const { url: ownerMemberAvatarUrl } = useMemberAvatar(nft?.ownerMember)
  const mdMatch = useMediaMatch('md')
  const { convertToUSD } = useTokenPrice()
  const accountBalance = useSubscribeAccountBalance()
  const timestamp = useMsTimestamp({ shouldStop: !currentAction })
  const { convertBlockToMsTimestamp, convertBlocksToDuration } = useBlockTimeEstimation()

  const {
    joystream,
    proxyCallback,
    chainState: { nftPlatformFeePercentage },
  } = useJoystream()
  const { currentBlock } = useCurrentBlockStore()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()

  const {
    watch,
    setValue,
    handleSubmit: createSubmitHandler,
    register,
    reset,
    formState: { errors },
  } = useForm<{ bid: number }>()

  const isAuction = nftStatus?.status === 'auction'
  const isBuyNow = nftStatus?.status === 'buy-now'
  const isEnglishAuction = nftStatus?.status === 'auction' && nftStatus.type === 'english'
  const isOpenAuction = nftStatus?.status === 'auction' && nftStatus?.type === 'open'

  useEffect(() => {
    if (isBuyNow) {
      setType('buy_now')
    }
    if (isEnglishAuction) {
      setType('english_auction')
    }
    if (isOpenAuction) {
      setType('open_auction')
    }
  }, [isBuyNow, isEnglishAuction, isOpenAuction])

  const auctionBuyNowPrice = (isAuction && nftStatus.buyNowPrice) || 0
  const bidLockingTime = isAuction && nftStatus.bidLockingTime && convertBlocksToDuration(nftStatus.bidLockingTime)
  const buyNowPrice = (isBuyNow && nftStatus.buyNowPrice) || 0
  const startingPrice = isAuction && nftStatus.startingPrice
  const topBidder = isAuction && nftStatus.topBidder ? nftStatus.topBidder : undefined
  const topBidAmount = (isAuction && !nftStatus.topBid?.isCanceled && nftStatus.topBidAmount) || 0
  const minimalBidStep = (isAuction && nftStatus.minimalBidStep) || 0
  const endAtBlock = isAuction && nftStatus.auctionPlannedEndBlock

  const minimumBidEnglishAuction = startingPrice > topBidAmount ? startingPrice : topBidAmount + minimalBidStep
  const minimumBid = type === 'open_auction' ? startingPrice : minimumBidEnglishAuction

  const endTime = endAtBlock && convertBlockToMsTimestamp(endAtBlock)

  const timeLeftSeconds = endTime ? Math.trunc((endTime - timestamp) / 1000) : 0

  const creatorRoyalty = nft?.creatorRoyalty || 0
  const ownerRoyalty = 100 - creatorRoyalty - nftPlatformFeePercentage

  // check if input value isn't bigger than fixed price
  useEffect(() => {
    if (type === 'buy_now' || !auctionBuyNowPrice) {
      return
    }
    const subscription = watch(({ bid }) => {
      if (bid >= auctionBuyNowPrice) {
        setBuyNowInfo(true)
      } else {
        setBuyNowInfo(false)
      }
      if (bid > auctionBuyNowPrice) {
        setValue('bid', auctionBuyNowPrice)
      }
    })

    return () => subscription.unsubscribe()
  }, [auctionBuyNowPrice, setValue, type, watch])

  const handleBuyNow = useCallback(async () => {
    if (!joystream || !currentNftId || !activeMemberId) return
    const completed = await handleTransaction({
      onError: () => refetch(),
      txFactory: async (updateStatus) => {
        if (!isAuction) {
          return (await joystream.extrinsics).buyNftNow(
            currentNftId,
            activeMemberId,
            buyNowPrice,
            proxyCallback(updateStatus)
          )
        } else {
          return (await joystream.extrinsics).makeNftBid(
            currentNftId,
            activeMemberId,
            Number(auctionBuyNowPrice),
            isEnglishAuction ? 'english' : 'open',
            proxyCallback(updateStatus)
          )
        }
      },
      onTxSync: async (_) => refetch(),
    })
    if (completed) {
      closeNftAction()
      displaySnackbar({
        title: 'You have successfully bought NFT.',
        iconType: 'success',
      })
    }
  }, [
    activeMemberId,
    auctionBuyNowPrice,
    buyNowPrice,
    closeNftAction,
    currentNftId,
    displaySnackbar,
    handleTransaction,
    isAuction,
    joystream,
    isEnglishAuction,
    proxyCallback,
    refetch,
  ])

  const handleBidOnAuction = useCallback(() => {
    const submit = createSubmitHandler(async (data) => {
      if (!joystream || !currentNftId || !activeMemberId) return
      const completed = await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).makeNftBid(
            currentNftId,
            activeMemberId,
            Number(data.bid),
            isEnglishAuction ? 'english' : 'open',
            proxyCallback(updateStatus)
          ),
        onTxSync: (_) => refetch(),
      })
      if (completed) {
        if (Number(data.bid) === auctionBuyNowPrice) {
          displaySnackbar({
            title: 'You have bought this NFT successfully',
            iconType: 'success',
          })
        } else {
          displaySnackbar({
            title: 'Your bid has been placed',
            description: 'We will notify you about any changes.',
            iconType: 'success',
          })
        }
        closeNftAction()
      }
    })
    submit()
  }, [
    activeMemberId,
    auctionBuyNowPrice,
    closeNftAction,
    createSubmitHandler,
    currentNftId,
    displaySnackbar,
    handleTransaction,
    isEnglishAuction,
    joystream,
    proxyCallback,
    refetch,
  ])
  const isBuyNowAffordable = (buyNowPrice || auctionBuyNowPrice) + TRANSACTION_FEE < (accountBalance || 0)
  const bid = watch('bid')
  const timeLeftUnderMinute = !!timeLeftSeconds && timeLeftSeconds < 60
  const auctionEnded = type === 'english_auction' && timeLeftSeconds <= 0
  const insufficientFoundsError = errors.bid && errors.bid.type === 'bidTooHigh'

  const primaryButtonText =
    type === 'buy_now' || (auctionBuyNowPrice && auctionBuyNowPrice <= bid) || isBuyNowClicked
      ? 'Buy NFT'
      : canChangeBid
      ? 'Change bid'
      : 'Place bid'
  const blocksLeft = endAtBlock && endAtBlock - currentBlock

  const isOpen = currentAction === 'purchase'

  useEffect(() => {
    if (!isOpen) {
      setValue('bid', NaN)
    }
  }, [isOpen, setValue])

  const hasErrors = !!Object.keys(errors).length

  const { isLoadingAsset: userBidAvatarLoading, url: userBidAvatarUrl } = useMemberAvatar(userBid?.bidder)
  const { isLoadingAsset: topBidderAvatarLoading, url: topBidderAvatarUrl } = useMemberAvatar(topBidder)
  const timeToUnlockSeconds = userBidUnlockDate ? differenceInSeconds(userBidUnlockDate, new Date()) : 0

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={() => {
        reset()
        closeNftAction()
      }}
      actionBar={{
        primaryButton: {
          text: primaryButtonText,
          disabled: isBuyNowClicked || type === 'buy_now' ? !isBuyNowAffordable : hasErrors,
          onClick: () => (isBuyNowClicked || type === 'buy_now' ? handleBuyNow() : handleBidOnAuction()),
        },
      }}
    >
      <Content>
        <NftPreview>
          <NftCard
            title={nft?.video.title}
            thumbnail={{
              loading: thumbnailLoading || loading || !nft,
              thumbnailUrl: thumbnailUrl,
            }}
            creator={{ name: nft?.video.channel.title, assetUrl: creatorAvatarUrl }}
            owner={{ name: nft?.ownerMember?.handle, assetUrl: ownerMemberAvatarUrl }}
            loading={loading}
            fullWidth={!mdMatch}
          />
        </NftPreview>
        <PlaceBidWrapper>
          <InnerContainer>
            <Header>
              <Text variant="h600">
                {type !== 'buy_now' && !isBuyNowClicked ? (canChangeBid ? 'Change bid' : 'Place bid') : 'Buy NFT'}
              </Text>
              {type === 'english_auction' && (
                <FlexWrapper>
                  <Text variant="h200" secondary>
                    Ending in:
                  </Text>
                  <Text
                    variant="h200"
                    margin={{ left: 2, right: 2 }}
                    color={
                      auctionEnded
                        ? cVar('colorTextMuted', true)
                        : timeLeftUnderMinute
                        ? cVar('colorTextError')
                        : undefined
                    }
                  >
                    {!auctionEnded
                      ? !timeLeftUnderMinute
                        ? formatDurationShort(timeLeftSeconds, true)
                        : 'Under 1 min'
                      : 'Auction ended'}
                    <Text variant="h200" as="span" secondary>
                      {' '}
                      / {pluralizeNoun(blocksLeft && blocksLeft > 0 ? blocksLeft : 0, 'block')}
                    </Text>
                  </Text>
                  <FlexWrapper>
                    {endAtBlock && (
                      <Information
                        text={`On blockchain, duration is expressed in number of blocks. This auction ends at block ${endAtBlock}.`}
                        multiline
                        placement="top"
                      />
                    )}
                  </FlexWrapper>
                </FlexWrapper>
              )}
            </Header>
            {type !== 'buy_now' && !isBuyNowClicked ? (
              <>
                <CurrentBidWrapper>
                  {topBidder && !!topBidAmount ? (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h100" secondary margin={{ bottom: 2 }}>
                          Top bid
                        </Text>
                        <FlexWrapper>
                          <Avatar size="bid" assetUrl={topBidderAvatarUrl} loading={topBidderAvatarLoading} />
                          <TokenWrapper>
                            <StyledJoyTokenIcon variant="gray" size={24} />
                          </TokenWrapper>
                          <BidAmount variant="h400">{formatNumberShort(topBidAmount)}</BidAmount>
                        </FlexWrapper>
                        <Text variant="t100" secondary margin={{ top: 1 }}>
                          {topBidder.handle === userBid?.bidder.handle ? 'You' : topBidder.handle}
                        </Text>
                      </ActionBarCell>
                      {userBid && (
                        <ActionBarCell>
                          <Text variant="h100" secondary margin={{ bottom: 2 }}>
                            Your Bid
                          </Text>
                          <FlexWrapper>
                            <Avatar size="bid" assetUrl={userBidAvatarUrl} loading={userBidAvatarLoading} />
                            <TokenWrapper>
                              <StyledJoyTokenIcon variant="gray" size={24} />
                            </TokenWrapper>
                            <BidAmount variant="h400">{formatNumberShort(Number(userBid.amount))}</BidAmount>
                          </FlexWrapper>
                          <Text variant="t100" secondary margin={{ top: 1 }}>
                            You
                          </Text>
                        </ActionBarCell>
                      )}
                    </ActiveBidWrapper>
                  ) : (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h100" secondary margin={{ bottom: 2 }}>
                          Top bid
                        </Text>
                        <Text variant="h400">No bids yet</Text>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  )}
                </CurrentBidWrapper>
                {!auctionEnded && (
                  <MinimumBidWrapper>
                    <MinimumBid>
                      <Text variant="h300" secondary>
                        Minimum bid
                      </Text>
                      <JoyTokenIcon variant="gray" size={24} /> <Text variant="h400">{minimumBid}</Text>
                    </MinimumBid>
                    {auctionBuyNowPrice > 0 && (
                      <Text variant="t100" secondary>
                        Buy now: {formatTokens(auctionBuyNowPrice, true)}
                      </Text>
                    )}
                  </MinimumBidWrapper>
                )}
                <TextField
                  {...register('bid', {
                    valueAsNumber: true,
                    validate: {
                      bidLocked: (value) => {
                        if (isOpenAuction && value < Number(userBid?.amount) && timeToUnlockSeconds > 0) {
                          return `You will be able to change your bid to a lower one after ${
                            userBidUnlockDate && formatDateTime(userBidUnlockDate)
                          }`
                        }
                        return true
                      },
                      bidTooLow: (value) =>
                        Number(value) >= minimumBid ? true : 'Your bid must be higher than the minimum bid',
                      bidTooHigh: (value) => {
                        return Number(value) + TRANSACTION_FEE > (accountBalance || 0)
                          ? 'You do not have enough funds to place this bid'
                          : true
                      },
                    },
                  })}
                  disabled={auctionEnded}
                  placeholder={auctionEnded ? 'Auction ended' : 'Enter your bid'}
                  nodeStart={<JoyTokenIcon variant="gray" size={24} />}
                  nodeEnd={!!bid && <Pill variant="default" label={`${convertToUSD(bid)}`} />}
                  type="number"
                  error={!!errors.bid}
                  helperText={errors.bid && errors.bid.message}
                  onBlur={(event) => {
                    const { target } = event
                    if (Number(target.value) % 1 !== 0) {
                      setValue('bid', Math.floor(Number(event.target.value)))
                    }
                  }}
                />
                {showBuyNowInfo && (
                  <BuyNowInfo variant="t100" margin={{ top: 2 }}>
                    Max bid cannot be more than buy now price. Bidding for amount higher than Buy now will automatically
                    end the auction and make you an owner of that NFT.
                  </BuyNowInfo>
                )}
              </>
            ) : (
              <MinimumBidWrapper>
                <MinimumBid>
                  <Text variant="h300" secondary>
                    Price:
                  </Text>
                  <JoyTokenIcon variant="silver" size={24} />{' '}
                  <Text variant="h400">{buyNowPrice || auctionBuyNowPrice}</Text>
                </MinimumBid>
              </MinimumBidWrapper>
            )}
            <Divider />
            <FlexWrapper>
              <Text variant="h400">Revenue split</Text>
              <Information
                placement="top"
                text="Revenue split shows the proceedings from this sale based on royalties set up by the creator"
                multiline
              />
            </FlexWrapper>
            <PaymentSplitWrapper>
              <div>
                <Text variant="h300" secondary>
                  Owner
                </Text>
                <PaymentSplitValues>
                  <Avatar size="bid" assetUrl={ownerMemberAvatarUrl} />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    {ownerRoyalty}%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text variant="h300" secondary>
                  Creator
                </Text>
                <PaymentSplitValues>
                  <Avatar size="bid" assetUrl={creatorAvatarUrl} />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    {creatorRoyalty}%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text variant="h300" secondary>
                  Platform
                </Text>
                <PaymentSplitValues>
                  <SvgJoystreamLogoShort height={24} viewBox="0 0 26 32" />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    {nftPlatformFeePercentage}%
                  </Text>
                </PaymentSplitValues>
              </div>
            </PaymentSplitWrapper>
            <Divider />
            <Text variant="h400" margin={{ bottom: 4 }}>
              Price breakdown
            </Text>
            <Row>
              <Text variant="t100" secondary color={insufficientFoundsError ? cVar('colorTextError') : undefined}>
                Your balance
              </Text>
              {accountBalance != null ? (
                <Text variant="t100" secondary color={insufficientFoundsError ? cVar('colorTextError') : undefined}>
                  {formatTokens(accountBalance, true)}
                </Text>
              ) : (
                <SkeletonLoader width={82} height={16} />
              )}
            </Row>
            <Row>
              <Text variant="t100" secondary>
                {type === 'buy_now' || isBuyNowClicked ? 'Price' : bid ? 'Your bid' : ''}
              </Text>
              {(bid > 0 || isBuyNowClicked || type === 'buy_now') && (
                <Text variant="t100" secondary>
                  {formatTokens(type !== 'buy_now' ? (isBuyNowClicked ? auctionBuyNowPrice : bid) : buyNowPrice, true)}
                </Text>
              )}
            </Row>
            {(bid || type === 'buy_now') && (
              <>
                <Row>
                  <Text variant="t100" secondary>
                    Transaction fee
                  </Text>
                  <Text variant="t100" secondary>
                    {formatTokens(TRANSACTION_FEE, true)}
                  </Text>
                </Row>
                <Row>
                  <Text variant="h500" secondary>
                    You will pay
                  </Text>
                  <Text variant="h500">
                    {formatTokens((type === 'buy_now' ? buyNowPrice : Number(bid) || 0) + TRANSACTION_FEE, true)}
                  </Text>
                </Row>
              </>
            )}
            {type === 'open_auction' && bidLockingTime && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  Your bid can be withdrawn if it’s not accepted by the owner within{' '}
                  {formatDuration(intervalToDuration({ start: 0, end: bidLockingTime }))} from placing it.
                </Text>
              </Messages>
            )}
            {type === 'english_auction' && !isBuyNowClicked && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  After placing your bid, you will not be able to withdraw it. If someone places higher bid, your bid
                  will be returned automatically.
                </Text>
              </Messages>
            )}
          </InnerContainer>
        </PlaceBidWrapper>
      </Content>
    </BottomDrawer>
  )
}
