import { formatDuration } from 'date-fns'
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
import { useSubsribeAccountBalance } from '@/hooks/useSubsribeAccountBalance'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatDurationShort } from '@/utils/time'

import {
  ActionBarCell,
  ActiveBidWrapper,
  BidderName,
  BuyNowInfo,
  Content,
  CurrentBidAvatar,
  CurrentBidJoyToken,
  CurrentBidWrapper,
  Divider,
  EndingTime,
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
  Timer,
} from './NftPurchaseBottomDrawer.styles'

const TRANSACTION_FEE = 0
//TODO this is temporary, we should get platform royalty from the chain
const PLATFORM_ROYALTY = 1

export const NftPurchaseBottomDrawer: React.FC = () => {
  const { displaySnackbar } = useSnackbar()
  const [type, setType] = useState<'english_auction' | 'open_auction' | 'buy_now'>('english_auction')
  const [showBuyNowInfo, setBuyNowInfo] = useState(false)
  const { currentAction, closeNftAction, currentNftId, isBuyNowClicked } = useNftActions()
  const { nft, nftStatus, loading, refetch } = useNft(currentNftId || '')
  const { isLoadingAsset: thumbnailLoading, url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)
  const { url: creatorAvatarUrl } = useAsset(nft?.video.channel.avatarPhoto)
  const { url: ownerMemberAvatarUrl } = useMemberAvatar(nft?.ownerMember)
  const mdMatch = useMediaMatch('md')
  const { convertToUSD } = useTokenPrice()
  const accountBalance = useSubsribeAccountBalance()
  const timestamp = useMsTimestamp({ shouldStop: !currentAction || type !== 'english_auction' })
  const { convertBlockToMsTimestamp, convertBlocksToDuration } = useBlockTimeEstimation()

  const { joystream, proxyCallback, currentBlock } = useJoystream()
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
  const topBidder = isAuction && nftStatus.topBidder
  const topBidAmount = (isAuction && nftStatus.topBidAmount) || 0
  const minimalBidStep = (isAuction && nftStatus.minimalBidStep) || 0
  const endAtBlock = isAuction && nftStatus.auctionPlannedEndBlock

  const minimumBid = startingPrice > topBidAmount ? startingPrice : topBidAmount + minimalBidStep

  const endTime = endAtBlock && convertBlockToMsTimestamp(endAtBlock)

  const timeLeftSeconds = endTime ? Math.trunc((endTime - timestamp) / 1000) : 0

  const creatorRoyalty = nft?.creatorRoyalty || 0
  const ownerRoyalty = 100 - creatorRoyalty - PLATFORM_ROYALTY

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
            title: 'You have successfully bought NFT.',
            iconType: 'success',
          })
        } else {
          displaySnackbar({
            title: 'Your bid has been placed.',
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
  const timeLeftUnderMinute = timeLeftSeconds && timeLeftSeconds < 60
  const auctionEnded = type === 'english_auction' && timeLeftSeconds === 0
  const insufficientFoundsError = errors.bid && errors.bid.type === 'bidTooHigh'
  const primaryButtonText = type === 'buy_now' || bid >= auctionBuyNowPrice || isBuyNowClicked ? 'Buy NFT' : 'Place bid'
  const blocksLeft = endAtBlock && endAtBlock - currentBlock

  const isOpen = currentAction === 'purchase'

  const hasErrors = !!Object.keys(errors).length

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={() => {
        reset()
        closeNftAction()
      }}
      coverTopbar
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
              <Text variant="h600">{type !== 'buy_now' && !isBuyNowClicked ? 'Place a bid' : 'Buy NFT'}</Text>
              {type === 'english_auction' && (
                <FlexWrapper>
                  <EndingTime>
                    <Text variant="h300" secondary>
                      Ending in:
                    </Text>
                    <Timer
                      variant="h200"
                      margin={{ left: 4, right: 2 }}
                      color={timeLeftUnderMinute ? cVar('colorTextError', true) : undefined}
                      secondary={auctionEnded}
                    >
                      {!auctionEnded
                        ? !timeLeftUnderMinute
                          ? formatDurationShort(timeLeftSeconds, true)
                          : 'Under 1 min'
                        : 'Auction ended'}
                    </Timer>
                  </EndingTime>
                  <FlexWrapper>
                    {blocksLeft && (
                      <Text variant="t100" secondary margin={{ left: 2, right: 1 }}>
                        {pluralizeNoun(blocksLeft > 0 ? blocksLeft : 0, 'block')}
                      </Text>
                    )}
                    {endAtBlock && (
                      <Information
                        text="Auctions are run and settled on-chain and use blocks of operations rather than clock time."
                        footer={<Text variant="t100">Auctions closing block: {endAtBlock}</Text>}
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
                  {topBidder ? (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Current bid
                        </Text>
                        <FlexWrapper>
                          <CurrentBidAvatar size="bid" />
                          <BidderName variant="h400">{topBidder.handle}</BidderName>
                        </FlexWrapper>
                      </ActionBarCell>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Bid amount
                        </Text>
                        <FlexWrapper>
                          <CurrentBidJoyToken size={24} variant="silver" />
                          <Text variant="h400">{topBidAmount}</Text>
                        </FlexWrapper>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  ) : (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Current bid
                        </Text>
                        <Text variant="h400">Nobody has bid yet</Text>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  )}
                </CurrentBidWrapper>
                {!auctionEnded && (
                  <MinimumBidWrapper>
                    <MinimumBid>
                      <Text variant="h300" secondary>
                        Minimum bid:
                      </Text>
                      <JoyTokenIcon variant="silver" size={24} /> <Text variant="h400">{minimumBid}</Text>
                    </MinimumBid>
                    {auctionBuyNowPrice > 0 && (
                      <div>
                        <Text variant="t100" secondary>
                          Buy now: {auctionBuyNowPrice} tJOY
                        </Text>
                      </div>
                    )}
                  </MinimumBidWrapper>
                )}
                <TextField
                  {...register('bid', {
                    valueAsNumber: true,
                    validate: {
                      bidTooLow: (value) =>
                        Number(value) >= minimumBid ? true : 'Your bid must be higher than minimum bid',
                      bidTooHigh: (value) =>
                        accountBalance
                          ? Number(value) + TRANSACTION_FEE > accountBalance
                            ? 'Insufficient funds.'
                            : true
                          : true,
                    },
                  })}
                  disabled={auctionEnded}
                  placeholder={auctionEnded ? 'Auction ended' : `Min. ${minimumBid} tJOY`}
                  nodeStart={<JoyTokenIcon variant="silver" size={24} />}
                  nodeEnd={!!bid && <Pill variant="overlay" label={`${convertToUSD(bid)}`} />}
                  type="number"
                  error={!!errors.bid}
                  helperText={errors.bid && errors.bid.message}
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
              <Text variant="h400">Payment split</Text>
              <Information
                placement="top"
                text="Payment split shows royalties that will go to each party after next sale of this NFT"
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
                  <SvgJoystreamLogoShort />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    {PLATFORM_ROYALTY}%
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
              {accountBalance ? (
                <Text variant="t100" secondary color={insufficientFoundsError ? cVar('colorTextError') : undefined}>
                  {accountBalance} tJOY
                </Text>
              ) : (
                <SkeletonLoader width={82} height={16} />
              )}
            </Row>
            <Row>
              <Text variant="t100" secondary>
                {type === 'buy_now' || isBuyNowClicked
                  ? 'Price'
                  : bid
                  ? 'Your bid'
                  : 'You need to fill out the amount first'}
              </Text>
              {(bid > 0 || isBuyNowClicked || type === 'buy_now') && (
                <Text variant="t100" secondary>
                  {type !== 'buy_now' ? (isBuyNowClicked ? auctionBuyNowPrice : bid) : buyNowPrice} tJOY
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
                    {TRANSACTION_FEE} tJOY
                  </Text>
                </Row>
                <Row>
                  <Text variant="h500" secondary>
                    You will pay
                  </Text>
                  <Text variant="h500">
                    {(type === 'buy_now' ? buyNowPrice : Number(bid) || 0) + TRANSACTION_FEE} tJOY
                  </Text>
                </Row>
              </>
            )}
            {type === 'open_auction' && bidLockingTime && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  if your bid was not successful, it can be withdrawn in{' '}
                  {formatDuration({
                    seconds: bidLockingTime / 1000,
                  })}
                </Text>
              </Messages>
            )}
            {type === 'english_auction' && !isBuyNowClicked && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  After placing your bid, you will not be able to withdraw it
                </Text>
              </Messages>
            )}
            {type === 'english_auction' && !isBuyNowClicked && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  After winning the auction, you will need to pay a small transaction fee to settle the auction.
                </Text>
              </Messages>
            )}
          </InnerContainer>
        </PlaceBidWrapper>
      </Content>
    </BottomDrawer>
  )
}
