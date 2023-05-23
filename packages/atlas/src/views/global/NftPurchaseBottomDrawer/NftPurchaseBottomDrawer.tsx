import BN from 'bn.js'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useNft } from '@/api/hooks/nfts'
import { SvgAlertsWarning24 } from '@/assets/icons'
import { SvgJoystreamLogoShort } from '@/assets/logos'
import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NftCard } from '@/components/_nft/NftCard'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { atlasConfig } from '@/config'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useNftState } from '@/hooks/useNftState'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useFee, useJoystream, useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { pluralizeNoun } from '@/utils/misc'
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

export const NftPurchaseBottomDrawer: FC = () => {
  const { displaySnackbar } = useSnackbar()
  const [type, setType] = useState<'english_auction' | 'open_auction' | 'buy_now'>('english_auction')
  const [showBuyNowInfo, setBuyNowInfo] = useState(false)
  const { currentAction, closeNftAction, currentNftId, isBuyNowClicked } = useNftActions()
  const { nft, nftStatus, loading, refetch } = useNft(currentNftId || '')
  const { userBid, canChangeBid, userBidUnlockDate } = useNftState(nft)
  const thumbnailUrl = nft?.video.thumbnailPhoto?.resolvedUrl
  const creatorAvatarUrl = nft?.video.channel.avatarPhoto?.resolvedUrl
  const { url: ownerMemberAvatarUrl } = getMemberAvatar(
    nft?.owner.__typename === 'NftOwnerMember' ? nft.owner.member : null
  )
  const mdMatch = useMediaMatch('md')
  const { accountBalance } = useSubscribeAccountBalance()
  const timestamp = useMsTimestamp({ shouldStop: !currentAction })
  const { convertBlockToMsTimestamp, convertBlocksToDuration } = useBlockTimeEstimation()

  const {
    joystream,
    proxyCallback,
    chainState: { nftPlatformFeePercentage },
  } = useJoystream()
  const { currentBlock } = useJoystreamStore()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()

  const {
    watch,
    setValue,
    handleSubmit: createSubmitHandler,
    reset,
    control,
    formState: { errors },
  } = useForm<{ bid: number }>({ mode: 'onBlur' })

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

  const bid = watch('bid')
  const auctionBuyNowPrice = isAuction ? hapiBnToTokenNumber(nftStatus.buyNowPrice || new BN(0)) : 0
  const bidLockingTime = isAuction && nftStatus.bidLockingTime && convertBlocksToDuration(nftStatus.bidLockingTime)
  const buyNowPrice = isBuyNow ? hapiBnToTokenNumber(nftStatus.buyNowPrice || new BN(0)) : 0
  const startingPrice = isAuction ? hapiBnToTokenNumber(nftStatus.startingPrice, true) : 0
  const topBidder = isAuction && nftStatus.topBidder ? nftStatus.topBidder : undefined
  const topBidAmount =
    isAuction && !nftStatus.topBid?.isCanceled && !!nftStatus.topBidAmount
      ? hapiBnToTokenNumber(nftStatus.topBidAmount)
      : 0
  const minimalBidStep = isAuction && nftStatus.minimalBidStep ? hapiBnToTokenNumber(nftStatus.minimalBidStep) : 0
  const endAtBlock = isAuction && nftStatus.auctionPlannedEndBlock

  const minimumBidEnglishAuction = startingPrice > topBidAmount ? startingPrice : topBidAmount + minimalBidStep
  const minimumBid = type === 'open_auction' ? startingPrice : minimumBidEnglishAuction

  const endTime = endAtBlock && convertBlockToMsTimestamp(endAtBlock)

  const timeLeftSeconds = endTime ? Math.trunc((endTime - timestamp) / 1000) : 0

  const creatorRoyalty = nft?.creatorRoyalty || 0
  const ownerRoyalty = 100 - creatorRoyalty - nftPlatformFeePercentage
  const canBuyNow = type === 'buy_now' || (auctionBuyNowPrice && auctionBuyNowPrice <= bid) || isBuyNowClicked

  const { fullFee: buyNowFee, loading: buyNowFeeLoading } = useFee(
    'buyNftNowTx',
    currentNftId && memberId && canBuyNow
      ? [currentNftId, memberId, tokenNumberToHapiBn(auctionBuyNowPrice || buyNowPrice).toString()]
      : undefined
  )

  const { fullFee: makeBidFee, loading: makeBidFeeLoading } = useFee(
    'makeNftBidTx',
    currentNftId && memberId && watch('bid')
      ? [currentNftId, memberId, tokenNumberToHapiBn(watch('bid')).toString(), isEnglishAuction ? 'english' : 'open']
      : undefined
  )

  const transactionFee = canBuyNow ? buyNowFee : makeBidFee
  const feeLoading = buyNowFeeLoading || makeBidFeeLoading

  const isBuyNowAffordable =
    accountBalance == null ||
    (buyNowPrice || auctionBuyNowPrice) + hapiBnToTokenNumber(transactionFee) < hapiBnToTokenNumber(accountBalance)

  const hasInsufficientFunds =
    isBuyNowClicked || type === 'buy_now' ? !isBuyNowAffordable : errors.bid && errors.bid.type === 'bidTooHigh'

  // check if input value isn't bigger than fixed price
  useEffect(() => {
    if (type === 'buy_now' || !auctionBuyNowPrice) {
      return
    }
    const subscription = watch(({ bid }) => {
      if (bid && bid >= auctionBuyNowPrice) {
        setBuyNowInfo(true)
      } else {
        setBuyNowInfo(false)
      }
      if (bid && bid > auctionBuyNowPrice) {
        setValue('bid', auctionBuyNowPrice)
      }
    })

    return () => subscription.unsubscribe()
  }, [auctionBuyNowPrice, setValue, type, watch])

  const handleBuyNow = useCallback(async () => {
    if (!joystream || !currentNftId || !memberId) return

    const completed = await handleTransaction({
      onError: () => refetch(),
      txFactory: async (updateStatus) => {
        if (!isAuction) {
          return (await joystream.extrinsics).buyNftNow(
            currentNftId,
            memberId,
            tokenNumberToHapiBn(buyNowPrice).toString(),
            proxyCallback(updateStatus)
          )
        } else {
          return (await joystream.extrinsics).makeNftBid(
            currentNftId,
            memberId,
            tokenNumberToHapiBn(auctionBuyNowPrice).toString(),
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
    joystream,
    currentNftId,
    memberId,
    handleTransaction,
    refetch,
    isAuction,
    buyNowPrice,
    proxyCallback,
    auctionBuyNowPrice,
    isEnglishAuction,
    closeNftAction,
    displaySnackbar,
  ])

  const handleBidOnAuction = useCallback(() => {
    const submit = createSubmitHandler(async (data) => {
      if (!joystream || !currentNftId || !memberId) return
      const completed = await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).makeNftBid(
            currentNftId,
            memberId,
            tokenNumberToHapiBn(data.bid).toString(),
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
    memberId,
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
  const timeLeftUnderMinute = !!timeLeftSeconds && timeLeftSeconds < 60
  const auctionEnded = type === 'english_auction' && timeLeftSeconds <= 0

  const primaryButtonText = canBuyNow ? 'Buy NFT' : canChangeBid ? 'Change bid' : 'Place bid'

  const blocksLeft = endAtBlock && endAtBlock - currentBlock

  const isOpen = currentAction === 'purchase'

  useEffect(() => {
    if (!isOpen) {
      setValue('bid', NaN)
    }
  }, [isOpen, setValue])

  const { isLoadingAsset: userBidAvatarLoading, url: userBidAvatarUrl } = getMemberAvatar(userBid?.bidder)
  const { isLoadingAsset: topBidderAvatarLoading, url: topBidderAvatarUrl } = getMemberAvatar(topBidder)
  const timeToUnlockSeconds = userBidUnlockDate ? differenceInSeconds(userBidUnlockDate, new Date()) : 0

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={() => {
        reset()
        closeNftAction()
      }}
      actionBar={{
        fee: transactionFee,
        feeLoading: feeLoading,
        primaryButton: {
          text: primaryButtonText,
          onClick: () =>
            !hasInsufficientFunds
              ? isBuyNowClicked || type === 'buy_now'
                ? handleBuyNow()
                : handleBidOnAuction()
              : displaySnackbar({
                  title: 'Insufficient funds',
                  description: `You don't have enough ${atlasConfig.joystream.tokenTicker} tokens to cover this transaction.`,
                  iconType: 'error',
                }),
        },
      }}
    >
      <Content>
        <NftPreview>
          <NftCard
            title={nft?.video.title}
            thumbnail={{
              loading: loading || !nft,
              thumbnailUrl: thumbnailUrl,
              type: 'video',
            }}
            creator={{ name: nft?.video.channel.title, assetUrl: creatorAvatarUrl }}
            owner={{
              name: (nft?.owner.__typename === 'NftOwnerMember' && nft.owner.member?.handle) || '',
              assetUrl: ownerMemberAvatarUrl,
            }}
            loading={loading}
            fullWidth={!mdMatch}
          />
        </NftPreview>
        <PlaceBidWrapper>
          <InnerContainer>
            <Header>
              <Text as="h1" variant="h600">
                {type !== 'buy_now' && !isBuyNowClicked ? (canChangeBid ? 'Change bid' : 'Place bid') : 'Buy NFT'}
              </Text>
              {type === 'english_auction' && (
                <FlexWrapper>
                  <Text as="span" variant="h200" color="colorText">
                    Ending in:
                  </Text>
                  <Text
                    as="span"
                    variant="h200"
                    margin={{ left: 2, right: 2 }}
                    color={auctionEnded ? 'colorTextMuted' : timeLeftUnderMinute ? 'colorTextError' : undefined}
                  >
                    {!auctionEnded
                      ? !timeLeftUnderMinute
                        ? formatDurationShort(timeLeftSeconds, true)
                        : 'Under 1 min'
                      : 'Auction ended'}
                    <Text variant="h200" as="span" color="colorText">
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
                        <Text as="p" variant="h100" color="colorText" margin={{ bottom: 2 }}>
                          Top bid
                        </Text>
                        <FlexWrapper>
                          <Avatar size={24} assetUrl={topBidderAvatarUrl} loading={topBidderAvatarLoading} />
                          <TokenWrapper>
                            <StyledJoyTokenIcon variant="gray" size={24} />
                          </TokenWrapper>
                          <BidAmount
                            as="span"
                            variant="h400"
                            value={tokenNumberToHapiBn(topBidAmount)}
                            format="short"
                          />
                        </FlexWrapper>
                        <Text as="span" variant="t100" color="colorText" margin={{ top: 1 }}>
                          {topBidder.handle === userBid?.bidder.handle ? 'You' : topBidder.handle}
                        </Text>
                      </ActionBarCell>
                      {userBid && (
                        <ActionBarCell>
                          <Text as="p" variant="h100" color="colorText" margin={{ bottom: 2 }}>
                            Your Bid
                          </Text>
                          <FlexWrapper>
                            <Avatar size={24} assetUrl={userBidAvatarUrl} loading={userBidAvatarLoading} />
                            <TokenWrapper>
                              <StyledJoyTokenIcon variant="gray" size={24} />
                            </TokenWrapper>
                            <BidAmount
                              as="span"
                              variant="h400"
                              value={hapiBnToTokenNumber(new BN(userBid.amount))}
                              format="short"
                            />
                          </FlexWrapper>
                          <Text as="span" variant="t100" color="colorText" margin={{ top: 1 }}>
                            You
                          </Text>
                        </ActionBarCell>
                      )}
                    </ActiveBidWrapper>
                  ) : (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text as="h2" variant="h100" color="colorText" margin={{ bottom: 2 }}>
                          Top bid
                        </Text>
                        <Text as="p" variant="h400">
                          No bids yet
                        </Text>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  )}
                </CurrentBidWrapper>
                {!auctionEnded && (
                  <MinimumBidWrapper>
                    <MinimumBid>
                      <Text as="h2" variant="h300" color="colorText">
                        Minimum bid
                      </Text>
                      <JoyTokenIcon variant="gray" size={24} />{' '}
                      <Text as="span" variant="h400">
                        {minimumBid}
                      </Text>
                    </MinimumBid>
                    {auctionBuyNowPrice > 0 && (
                      <Text as="span" variant="t100" color="colorText">
                        Buy now:{' '}
                        <NumberFormat
                          as="span"
                          variant="t100"
                          value={tokenNumberToHapiBn(auctionBuyNowPrice)}
                          withToken
                        />
                      </Text>
                    )}
                  </MinimumBidWrapper>
                )}
                <FormField error={errors.bid?.message}>
                  <Controller
                    control={control}
                    name="bid"
                    rules={{
                      validate: {
                        bidLocked: (value) => {
                          if (
                            isOpenAuction &&
                            userBid &&
                            value < hapiBnToTokenNumber(userBid.amount) &&
                            timeToUnlockSeconds > 0
                          ) {
                            return `You will be able to change your bid to a lower one after ${
                              userBidUnlockDate && formatDateTime(userBidUnlockDate)
                            }`
                          }
                          return true
                        },
                        bidTooLow: (value) =>
                          value >= minimumBid ? true : 'Your bid must be higher than the minimum bid',
                        bidTooHigh: (value) => {
                          return accountBalance == null ||
                            value + hapiBnToTokenNumber(transactionFee) > hapiBnToTokenNumber(accountBalance)
                            ? 'You do not have enough funds to place this bid'
                            : true
                        },
                      },
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TokenInput
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={auctionEnded}
                        placeholder={auctionEnded ? 'Auction ended' : 'Enter your bid'}
                        error={!!errors.bid}
                      />
                    )}
                  />
                </FormField>
                {showBuyNowInfo && (
                  <BuyNowInfo as="span" variant="t100" margin={{ top: 2 }}>
                    Max bid cannot be more than buy now price. Bidding for amount higher than Buy now will automatically
                    end the auction and make you an owner of that NFT.
                  </BuyNowInfo>
                )}
              </>
            ) : (
              <MinimumBidWrapper>
                <MinimumBid>
                  <Text as="span" variant="h300" color="colorText">
                    Price:
                  </Text>
                  <JoyTokenIcon variant="silver" size={24} />{' '}
                  <Text as="span" variant="h400">
                    {buyNowPrice || auctionBuyNowPrice}
                  </Text>
                </MinimumBid>
              </MinimumBidWrapper>
            )}
            <Divider />
            <FlexWrapper>
              <Text as="h2" variant="h400">
                Revenue split
              </Text>
              <Information
                placement="top"
                text="Revenue split shows the proceedings from this sale based on royalties set up by the creator"
                multiline
              />
            </FlexWrapper>
            <PaymentSplitWrapper>
              <div>
                <Text as="span" variant="h300" color="colorText">
                  Owner
                </Text>
                <PaymentSplitValues>
                  <Avatar size={24} assetUrl={ownerMemberAvatarUrl} />
                  <Text as="span" variant="h400" color="colorText" margin={{ left: 2 }}>
                    {ownerRoyalty}%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text as="span" variant="h300" color="colorText">
                  Creator
                </Text>
                <PaymentSplitValues>
                  <Avatar size={24} assetUrl={creatorAvatarUrl} />
                  <Text as="span" variant="h400" color="colorText" margin={{ left: 2 }}>
                    {creatorRoyalty}%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text as="span" variant="h300" color="colorText">
                  Platform
                </Text>
                <PaymentSplitValues>
                  <SvgJoystreamLogoShort height={24} viewBox="0 0 26 32" />
                  <Text as="span" variant="h400" color="colorText" margin={{ left: 2 }}>
                    {nftPlatformFeePercentage}%
                  </Text>
                </PaymentSplitValues>
              </div>
            </PaymentSplitWrapper>
            <Divider />
            <Text as="h2" variant="h400" margin={{ bottom: 4 }}>
              Price breakdown
            </Text>
            <Row>
              <Text as="span" variant="t100" color={hasInsufficientFunds ? 'colorTextError' : 'colorText'}>
                Your balance
              </Text>
              {accountBalance != null ? (
                <NumberFormat
                  as="span"
                  value={accountBalance}
                  withToken
                  variant="t100"
                  color={hasInsufficientFunds ? 'colorTextError' : 'colorText'}
                />
              ) : (
                <SkeletonLoader width={82} height={16} />
              )}
            </Row>
            <Row>
              <Text as="span" variant="t100" color="colorText">
                {type === 'buy_now' || isBuyNowClicked ? 'Price' : bid ? 'Your bid' : ''}
              </Text>
              {(bid > 0 || isBuyNowClicked || type === 'buy_now') && (
                <NumberFormat
                  as="span"
                  value={type !== 'buy_now' ? (isBuyNowClicked ? auctionBuyNowPrice : bid) : buyNowPrice}
                  withToken
                  variant="t100"
                  color="colorText"
                />
              )}
            </Row>
            {bid || canBuyNow ? (
              <>
                <Row>
                  <Text as="span" variant="t100" color="colorText">
                    Transaction fee
                  </Text>
                  {(canBuyNow ? !buyNowFee.toNumber() : !makeBidFee.toNumber()) ||
                  buyNowFeeLoading ||
                  makeBidFeeLoading ? (
                    <SkeletonLoader width={80} height={16} />
                  ) : (
                    <NumberFormat as="span" value={transactionFee} withToken variant="t100" color="colorText" />
                  )}
                </Row>
                <Row>
                  <Text as="span" variant="h500" color="colorText">
                    You will pay
                  </Text>
                  {(canBuyNow ? !buyNowFee.toNumber() : !makeBidFee.toNumber()) ||
                  buyNowFeeLoading ||
                  makeBidFeeLoading ? (
                    <SkeletonLoader width={112} height={32} />
                  ) : (
                    <NumberFormat
                      as="span"
                      value={
                        (type === 'buy_now' ? buyNowPrice : bid || auctionBuyNowPrice) +
                        hapiBnToTokenNumber(transactionFee)
                      }
                      withToken
                      format="short"
                      withTooltip
                      variant="h500"
                    />
                  )}
                </Row>
              </>
            ) : (
              <Row>
                <Text as="span" variant="t100" color="colorText">
                  You need to fill out the amount first
                </Text>
              </Row>
            )}
            {type === 'open_auction' && bidLockingTime && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text as="span" variant="t200" color="colorText" margin={{ left: 2 }}>
                  Your bid can be withdrawn if it’s not accepted by the owner within{' '}
                  {formatDuration(intervalToDuration({ start: 0, end: bidLockingTime }))} from placing it.
                </Text>
              </Messages>
            )}
            {type === 'english_auction' && !isBuyNowClicked && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text as="span" variant="t200" color="colorText" margin={{ left: 2 }}>
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
