import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useNft } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { NftCard } from '@/components/NftCard'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { TextField } from '@/components/_inputs/TextField'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useSubsribeAccountBalance } from '@/hooks/useSubsribeAccountBalance'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { cVar } from '@/styles'
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

const TRANSACTION_FEE = 19
const PLATFORM_ROYALTY = 0

export const NftPurchaseBottomDrawer: React.FC = () => {
  const [type, setType] = useState<'english_auction' | 'open_auction' | 'buy_now'>('english_auction')
  const [showBuyNowInfo, setBuyNowInfo] = useState(false)
  const { currentAction, closeNftAction, currentNftId } = useNftActions()
  const { nft, loading } = useNft(currentNftId || '')
  const { isLoadingAsset: thumbnailLoading, url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)
  const { url: avatarUrl } = useAsset(nft?.video.channel.avatarPhoto)
  const { url: memberAvatarUrl } = useMemberAvatar(nft?.ownerMember)
  const mdMatch = useMediaMatch('md')
  const { convertToUSD } = useTokenPrice()
  const accountBalance = useSubsribeAccountBalance()
  const timestamp = useMsTimestamp({ shouldStop: !currentAction || type !== 'english_auction' })
  const { convertDurationToBlocks, convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()

  const {
    watch,
    setValue,
    handleSubmit: createSubmitHandler,
    getValues,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<{ bid: string }>({ mode: 'onChange', defaultValues: { bid: '' } })

  const isAuction = nft?.transactionalStatus.__typename === 'TransactionalStatusAuction'

  const isBuyNow = nft?.transactionalStatus.__typename === 'TransactionalStatusBuyNow'

  const isEnglishAuction =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeEnglish'

  const isOpenAuction =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen'

  useEffect(() => {
    if (!currentAction) {
      reset({ bid: '' })
    }
  }, [currentAction, reset])

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

  const auctionBuyNowPrice =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction?.buyNowPrice
      ? nft.transactionalStatus.auction?.buyNowPrice
      : 0

  const buyNowPrice =
    nft?.transactionalStatus.__typename === 'TransactionalStatusBuyNow' && nft.transactionalStatus.price
      ? nft.transactionalStatus.price
      : 0

  const minimumBid =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.startingPrice
      ? nft.transactionalStatus.auction?.startingPrice
      : 0

  const lastBid =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' && nft.transactionalStatus.auction?.lastBid
      ? nft.transactionalStatus.auction.lastBid
      : null

  const lastBidAmount = lastBid?.amount || 0

  const bidStep =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.minimalBidStep
      ? nft.transactionalStatus.auction?.minimalBidStep
      : 0

  const calculatedMinimumBid = minimumBid > lastBidAmount ? minimumBid : lastBidAmount + bidStep

  const endAtBlock =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
    nft.transactionalStatus.auction?.plannedEndAtBlock
      ? nft.transactionalStatus.auction?.plannedEndAtBlock
      : null

  const endTime = endAtBlock && convertBlockToMsTimestamp(endAtBlock)
  const timeLeftSeconds = endTime ? Math.trunc((endTime - timestamp) / 1000) : 0

  const creatorRoyalty = nft?.creatorRoyalty || 0
  const ownerRoyalty = 100 - creatorRoyalty - PLATFORM_ROYALTY

  // check if input value isn't bigger than fixed price
  useEffect(() => {
    if (type === 'buy_now') {
      return
    }
    const subscription = watch(({ bid }) => {
      if (Number(bid) >= auctionBuyNowPrice) {
        setBuyNowInfo(true)
      } else {
        setBuyNowInfo(false)
      }
      if (Number(bid) > auctionBuyNowPrice) {
        setValue('bid', auctionBuyNowPrice.toString())
      }
    })

    return () => subscription.unsubscribe()
  }, [auctionBuyNowPrice, setValue, type, watch])

  const handleSubmit = useCallback(
    () =>
      createSubmitHandler((data) => {
        if (!joystream || !currentNftId || !activeMemberId) return
        if (isAuction) {
          handleTransaction({
            txFactory: async (updateStatus) =>
              (await joystream.extrinsics).makeNftBid(
                currentNftId,
                activeMemberId,
                Number(data.bid),
                proxyCallback(updateStatus)
              ),
            successMessage: {
              title: 'Bid placed',
              description: 'Good job',
            },
          })
        }
        if (isBuyNow) {
          handleTransaction({
            txFactory: async (updateStatus) =>
              (await joystream.extrinsics).buyNftNow(currentNftId, activeMemberId, proxyCallback(updateStatus)),
            // onTxSync: async (_) => onSuccess(),
            successMessage: {
              title: 'NFT bought',
              description: 'Good job',
            },
          })
        }
      }),
    [
      activeMemberId,
      createSubmitHandler,
      currentNftId,
      handleTransaction,
      isAuction,
      isBuyNow,
      joystream,
      proxyCallback,
    ]
  )

  const placedBid = Number(getValues().bid)
  const timeLeftUnderMinute = timeLeftSeconds && timeLeftSeconds < 60
  const auctionEnded = type !== 'open_auction' && timeLeftSeconds === 0
  const insufficientFoundsError = errors.bid && errors.bid.type === 'bidTooHigh'
  const primaryButtonText = type === 'buy_now' || placedBid >= auctionBuyNowPrice ? 'Buy NFT' : 'Place bid'
  const blocksLeft = (endTime && convertDurationToBlocks(endTime - timestamp)) || 0

  const isOpen = currentAction === 'purchase'
  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={closeNftAction}
      coverTopbar
      actionBar={{
        primaryButton: {
          text: primaryButtonText,
          disabled: !isValid,
          onClick: handleSubmit(),
        },
      }}
    >
      <Content>
        <NftPreview>
          <NftCard
            title={nft?.video.title}
            thumbnail={{
              loading: thumbnailLoading,
              thumbnailUrl: thumbnailUrl,
            }}
            creator={{ name: nft?.video.channel.title, assetUrl: avatarUrl }}
            owner={{ name: nft?.ownerMember?.handle, assetUrl: memberAvatarUrl }}
            loading={loading}
            fullWidth={!mdMatch}
          />
        </NftPreview>
        <PlaceBidWrapper>
          <InnerContainer>
            <Header>
              <Text variant="h600">{type !== 'buy_now' ? 'Place a bid' : 'Buy NFT'}</Text>
              {type !== 'open_auction' && (
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
                    <Text variant="t100" secondary margin={{ left: 2, right: 1 }}>
                      {blocksLeft > 0 ? blocksLeft : 0} {blocksLeft === 1 ? 'block' : 'blocks'}
                    </Text>
                    <Information
                      text="Auctions are run and settled on-chain and use blocks of operations rather than clock time."
                      footer={<Text variant="t100">Auctions closing block: 123115234</Text>}
                      placement="top"
                    />
                  </FlexWrapper>
                </FlexWrapper>
              )}
            </Header>
            {type !== 'buy_now' ? (
              <>
                <CurrentBidWrapper>
                  {lastBid ? (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Current bid
                        </Text>
                        <FlexWrapper>
                          <CurrentBidAvatar size="bid" />
                          <BidderName variant="h400">{lastBid?.bidder.handle}</BidderName>
                        </FlexWrapper>
                      </ActionBarCell>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Bid amount
                        </Text>
                        <FlexWrapper>
                          <CurrentBidJoyToken size={24} variant="silver" />
                          <Text variant="h400">{lastBid?.amount}</Text>
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
                      <JoyTokenIcon variant="silver" size={24} /> <Text variant="h400">{calculatedMinimumBid}</Text>
                    </MinimumBid>
                    <div>
                      <Text variant="t100" secondary>
                        Buy now: {auctionBuyNowPrice} tJOY
                      </Text>
                    </div>
                  </MinimumBidWrapper>
                )}
                <TextField
                  {...register('bid', {
                    required: true,
                    validate: {
                      bidTooLow: (value) =>
                        Number(value) >= calculatedMinimumBid ? true : 'Your bid must be higher than minimum bid',
                      bidTooHigh: (value) =>
                        accountBalance
                          ? Number(value) + TRANSACTION_FEE > accountBalance
                            ? 'Insufficient funds.'
                            : true
                          : true,
                    },
                  })}
                  disabled={auctionEnded}
                  placeholder={auctionEnded ? 'Auction ended' : `Min. ${calculatedMinimumBid} tJOY`}
                  nodeStart={<JoyTokenIcon variant="silver" size={24} />}
                  nodeEnd={!!placedBid && <Pill variant="overlay" label={`${convertToUSD(placedBid)}`} />}
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
                  <JoyTokenIcon variant="silver" size={24} /> <Text variant="h400">{buyNowPrice}</Text>
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
                  <Avatar size="bid" />
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
                  <Avatar size="bid" />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    ${creatorRoyalty}%
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
                {!placedBid && type !== 'buy_now' ? 'You need to fill out the amount first' : 'Your bid'}
              </Text>
              {placedBid && (
                <Text variant="t100" secondary>
                  {type !== 'buy_now' ? placedBid : buyNowPrice} tJOY
                </Text>
              )}
            </Row>
            {(placedBid || type === 'buy_now') && (
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
                    {(type === 'buy_now' ? buyNowPrice : Number(placedBid) || 0) + TRANSACTION_FEE} tJOY
                  </Text>
                </Row>
              </>
            )}
            {type !== 'buy_now' && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  if your bid was not successful, it can be withdrawn in {'{X}'} hours
                </Text>
              </Messages>
            )}
          </InnerContainer>
        </PlaceBidWrapper>
      </Content>
    </BottomDrawer>
  )
}
