import BN from 'bn.js'
import { differenceInSeconds } from 'date-fns'
import { FC, memo } from 'react'

import { FullBidFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgAlertsInformative24 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { Banner } from '@/components/Banner'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { GridItem } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { formatDateTime, formatDurationShort, formatTime } from '@/utils/time'

import { NftInfoItem, NftTimerItem } from './NftInfoItem'
import { OwnerHandle } from './NftWidget.styles'
import { NftWidgetStatus } from './NftWidget.types'
import { ButtonGrid, TopBidderContainer, TopBidderTokenContainer } from './NftWidgetContent.styles'

type Size = 'small' | 'medium'

type NftWidgetContentProps = {
  nftStatus: NftWidgetStatus | undefined
  ownerHandle: string | null | undefined
  isOwner: boolean | undefined
  needsSettling: boolean | undefined
  onNftPutOnSale?: () => void
  onNftAcceptBid?: () => void
  onNftPurchase?: () => void
  onWithdrawBid?: (bid?: BN, createdAt?: Date) => void
  bidFromPreviousAuction: FullBidFieldsFragment | undefined
  onNftSettlement?: () => void
  onNftBuyNow?: () => void
  onNftCancelSale?: () => void
  onNftChangePrice?: () => void
  userBidCreatedAt?: Date
  userBidAmount?: BN
  size: Size
}

export const NftWidgetContent: FC<NftWidgetContentProps> = memo(
  ({
    nftStatus,
    isOwner,
    ownerHandle,
    needsSettling,
    onNftPutOnSale,
    onNftAcceptBid,
    onNftPurchase,
    onWithdrawBid,
    bidFromPreviousAuction,
    onNftSettlement,
    onNftBuyNow,
    onNftCancelSale,
    onNftChangePrice,
    userBidCreatedAt,
    size,
    userBidAmount,
  }) => {
    const { convertHapiToUSD, isLoadingPrice } = useTokenPrice()
    const shouldIgnoreTimestamp = nftStatus?.status === 'auction' && !nftStatus.startsAtDate
    const timestamp = useMsTimestamp({
      shouldStop: shouldIgnoreTimestamp,
    })
    if (!nftStatus) {
      return null
    }

    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const timerColumnSpan = size === 'small' ? 1 : 2

    switch (nftStatus.status) {
      case 'idle':
        return (
          <>
            {nftStatus.lastSalePrice ? (
              <NftInfoItem
                size={size}
                label="Last price"
                content={
                  <NumberFormat
                    as="span"
                    value={nftStatus.lastSalePrice}
                    format="short"
                    variant={contentTextVariant}
                    icon={<JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />}
                    color="colorText"
                    withDenomination
                  />
                }
                secondaryText={nftStatus.lastSaleDate && formatDateTime(nftStatus.lastSaleDate)}
              />
            ) : (
              <NftInfoItem
                size={size}
                label="status"
                content={
                  <Text as="span" variant={contentTextVariant} color="colorText">
                    Not for sale
                  </Text>
                }
              />
            )}
            {bidFromPreviousAuction && (
              <>
                <InfoBanner
                  size={size}
                  title="Withdraw your bid"
                  description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                />
                <WithdrawBidFromPreviousAuction size={size} bidFromPreviousAuction={bidFromPreviousAuction} />
              </>
            )}
            {isOwner && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftPutOnSale}>
                  Start sale of this NFT
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'buy-now':
        return (
          <>
            <BuyNow buyNowPrice={nftStatus.buyNowPrice} size={size} />

            <GridItem colSpan={buttonColumnSpan}>
              <ButtonGrid data-size={size}>
                {isOwner ? (
                  <>
                    <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftChangePrice}>
                      Change price
                    </Button>
                    <Button fullWidth variant="destructive" size={buttonSize} onClick={onNftCancelSale}>
                      Remove from sale
                    </Button>
                  </>
                ) : (
                  <GridItem colSpan={buttonColumnSpan}>
                    <Button fullWidth size={buttonSize} onClick={onNftPurchase}>
                      Buy now
                    </Button>
                  </GridItem>
                )}
                {bidFromPreviousAuction && (
                  <>
                    <InfoBanner
                      size={size}
                      title="Withdraw your bid"
                      description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                    />
                    <WithdrawBidFromPreviousAuction
                      secondary
                      size={size}
                      bidFromPreviousAuction={bidFromPreviousAuction}
                    />
                  </>
                )}
              </ButtonGrid>
            </GridItem>
          </>
        )
      case 'auction': {
        const getInfoBannerProps = () => {
          const hasBids = !nftStatus.topBid?.isCanceled && nftStatus.topBidAmount?.gtn(0)
          if (nftStatus.type === 'open' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to be able to participate in this auction.',
            }
          }

          if (nftStatus.englishTimerState === 'expired' && isOwner && !hasBids) {
            return {
              title: 'Auction ended',
              description: 'This auction has ended and no one placed a bid. You can now remove this NFT from sale.',
            }
          }
          if (nftStatus.englishTimerState === 'expired' && !bidFromPreviousAuction && !hasBids && !isOwner) {
            return {
              title: 'Auction ended',
              description:
                "This auction has ended and no one placed a bid. We're waiting for the NFT owner to remove this NFT from sale.",
            }
          }
          if (
            nftStatus.englishTimerState === 'expired' &&
            !bidFromPreviousAuction &&
            hasBids &&
            !isOwner &&
            !nftStatus.isUserTopBidder
          ) {
            return {
              title: 'Auction ended',
              description:
                'We are waiting for this auction to be settled by the auction winner or the current NFT owner.',
            }
          }
          if (nftStatus.englishTimerState === 'expired' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid',
              description: 'You placed a bid in a previous auction that you can now withdraw.',
            }
          }

          if (nftStatus.englishTimerState === 'running' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to be able to participate in this auction.',
            }
          }

          if (nftStatus.englishTimerState === 'upcoming' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to be able to participate in this upcoming auction.',
            }
          }

          if (nftStatus.isUserWhitelisted === false) {
            return {
              title: "You're not on the whitelist",
              description: `This sale is available only to members whitelisted by ${ownerHandle}.`,
            }
          }

          return null
        }
        const infoBannerProps = getInfoBannerProps()

        const infoTextNode = !!nftStatus.userBidAmount?.gtn(0) && nftStatus.userBidUnlockDate && (
          <GridItem colSpan={buttonColumnSpan}>
            {nftStatus.type === 'english' ? (
              <BidPlacingInfoText />
            ) : (
              <Text as="p" variant="t100" color="colorText" align="center">
                {nftStatus.canWithdrawBid ? `Your last bid: ` : `Your last bid (`}
                <NumberFormat as="span" value={nftStatus.userBidAmount} format="short" withToken />
                {nftStatus.canWithdrawBid
                  ? ''
                  : `) becomes withdrawable on ${formatDateTime(nftStatus.userBidUnlockDate)}`}
              </Text>
            )}
          </GridItem>
        )

        const topBidAmountInUsd = nftStatus.topBidAmount && convertHapiToUSD(nftStatus.topBidAmount)

        return (
          <>
            {nftStatus.topBidAmount?.gtn(0) && !nftStatus.topBid?.isCanceled ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <TopBidderContainer>
                      <Avatar assetUrls={nftStatus.topBidderAvatarUris} size={24} />
                      <TopBidderTokenContainer data-size={size}>
                        <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                      </TopBidderTokenContainer>
                    </TopBidderContainer>
                    <NumberFormat
                      as="span"
                      format="short"
                      value={nftStatus.topBidAmount}
                      variant={contentTextVariant}
                    />
                  </>
                }
                secondaryText={
                  !isLoadingPrice && nftStatus.topBidderHandle ? (
                    <>
                      {topBidAmountInUsd ? (
                        <NumberFormat as="span" color="colorText" format="dollar" value={topBidAmountInUsd} />
                      ) : null}{' '}
                      from{' '}
                      <OwnerHandle to={absoluteRoutes.viewer.member(nftStatus.topBidderHandle)}>
                        <Text as="span" variant="t100">
                          {nftStatus.isUserTopBidder ? 'you' : nftStatus.topBidderHandle}
                        </Text>
                      </OwnerHandle>
                    </>
                  ) : null
                }
              />
            ) : (
              <NftInfoItem
                size={size}
                label="Starting Price"
                content={
                  <NumberFormat
                    as="span"
                    format="short"
                    value={nftStatus.startingPrice}
                    variant={contentTextVariant}
                    icon={<JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />}
                    withDenomination
                  />
                }
              />
            )}
            <BuyNow buyNowPrice={nftStatus.buyNowPrice} size={size} />

            {nftStatus.englishTimerState === 'expired' && (
              <GridItem colSpan={timerColumnSpan}>
                <NftInfoItem
                  size={size}
                  label="Auction ended on"
                  loading={!nftStatus.auctionPlannedEndDate}
                  content={
                    nftStatus.auctionPlannedEndDate && (
                      <Text as="span" variant={contentTextVariant} color="colorText">
                        {formatDateTime(nftStatus.auctionPlannedEndDate)}
                      </Text>
                    )
                  }
                />
              </GridItem>
            )}
            {nftStatus.englishTimerState === 'running' && nftStatus?.auctionPlannedEndDate && (
              <GridItem colSpan={timerColumnSpan}>
                <NftTimerItem size={size} time={nftStatus.auctionPlannedEndDate} />
              </GridItem>
            )}
            {nftStatus.startsAtBlock && nftStatus.auctionBeginsInSeconds >= 0 && (
              <GridItem colSpan={timerColumnSpan}>
                <NftInfoItem
                  size={size}
                  label="Auction begins on"
                  loading={!nftStatus.startsAtDate}
                  content={
                    nftStatus.startsAtDate && (
                      <Text as="span" variant={contentTextVariant} color="colorText">
                        {nftStatus.auctionBeginsInDays > 1 && formatDateTime(nftStatus.startsAtDate)}
                        {nftStatus.auctionBeginsInDays === 1 && `Tomorrow at ${formatTime(nftStatus.startsAtDate)}`}
                        {nftStatus.auctionBeginsInDays < 1 &&
                          formatDurationShort(differenceInSeconds(nftStatus.startsAtDate, timestamp))}
                      </Text>
                    )
                  }
                />
              </GridItem>
            )}

            {nftStatus.hasTimersLoaded && infoBannerProps && <InfoBanner size={size} {...infoBannerProps} />}

            {nftStatus.hasTimersLoaded && needsSettling && (nftStatus.isUserTopBidder || isOwner) && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize} onClick={onNftSettlement}>
                  Settle auction
                </Button>
              </GridItem>
            )}

            {nftStatus.hasTimersLoaded && bidFromPreviousAuction && (
              <WithdrawBidFromPreviousAuction size={size} bidFromPreviousAuction={bidFromPreviousAuction} />
            )}

            {nftStatus.hasTimersLoaded &&
              !needsSettling &&
              !bidFromPreviousAuction &&
              (isOwner
                ? (nftStatus.type === 'open' ||
                    // english auction with no bids
                    !nftStatus.topBidAmount ||
                    nftStatus.topBid?.isCanceled) && (
                    <GridItem colSpan={buttonColumnSpan}>
                      <ButtonGrid data-size={size}>
                        {nftStatus.type === 'open' && nftStatus.topBid && !nftStatus.topBid?.isCanceled && (
                          <Button fullWidth size={buttonSize} onClick={onNftAcceptBid}>
                            Review and accept bid
                          </Button>
                        )}
                        <Button
                          fullWidth
                          onClick={onNftCancelSale}
                          variant={
                            nftStatus.type === 'open' && !nftStatus.topBid?.isCanceled
                              ? 'destructive-secondary'
                              : 'destructive'
                          }
                          size={buttonSize}
                        >
                          Remove from sale
                        </Button>
                      </ButtonGrid>
                    </GridItem>
                  )
                : nftStatus.englishTimerState === 'running' &&
                  nftStatus.isUserWhitelisted !== false &&
                  (nftStatus.buyNowPrice?.gtn(0) ? (
                    <GridItem colSpan={buttonColumnSpan}>
                      <ButtonGrid data-size={size} data-two-columns={size === 'medium'}>
                        <ProtectedActionWrapper
                          title="You want to place a bid on this NFT?"
                          description="Sign in to take part in NFT auctions"
                        >
                          <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftPurchase}>
                            {nftStatus.canChangeBid ? 'Change bid' : 'Place bid'}
                          </Button>
                        </ProtectedActionWrapper>
                        <ProtectedActionWrapper
                          title="You want to buy this NFT?"
                          description="Sign in to take part in NFT auctions"
                        >
                          <Button fullWidth size={buttonSize} onClick={onNftBuyNow}>
                            Buy now
                          </Button>
                        </ProtectedActionWrapper>

                        {/* second row button */}
                        {nftStatus.canWithdrawBid && (
                          <GridItem colSpan={buttonColumnSpan}>
                            <Button
                              fullWidth
                              size={buttonSize}
                              variant="destructive-secondary"
                              onClick={() => onWithdrawBid?.(userBidAmount, userBidCreatedAt)}
                            >
                              Withdraw bid
                            </Button>
                          </GridItem>
                        )}

                        {infoTextNode}
                      </ButtonGrid>
                    </GridItem>
                  ) : (
                    <GridItem colSpan={buttonColumnSpan}>
                      <ButtonGrid data-size={size}>
                        <GridItem colSpan={buttonColumnSpan}>
                          <ProtectedActionWrapper
                            title="You want to place a bid on this NFT?"
                            description="Sign in to take part in NFT auctions"
                          >
                            <Button fullWidth size={buttonSize} onClick={onNftPurchase}>
                              {nftStatus.canChangeBid ? 'Change bid' : 'Place bid'}
                            </Button>
                          </ProtectedActionWrapper>
                        </GridItem>
                        {nftStatus.canWithdrawBid && (
                          <GridItem colSpan={buttonColumnSpan}>
                            <Button
                              fullWidth
                              size={buttonSize}
                              variant="destructive-secondary"
                              onClick={() => onWithdrawBid?.(userBidAmount, userBidCreatedAt)}
                            >
                              Withdraw bid
                            </Button>
                          </GridItem>
                        )}
                        {infoTextNode}
                      </ButtonGrid>
                    </GridItem>
                  )))}
          </>
        )
      }
    }
  }
)

NftWidgetContent.displayName = 'NftWidgetContent'

const BidPlacingInfoText = () => (
  <Text as="p" variant="t100" color="colorText" align="center">
    Placing a bid will withdraw your last bid
  </Text>
)

export const BuyNow = memo(({ buyNowPrice, size }: { buyNowPrice?: BN; size: Size }) => {
  const contentTextVariant = size === 'small' ? 'h400' : 'h600'
  return buyNowPrice?.gtn(0) ? (
    <NftInfoItem
      size={size}
      label="Buy now"
      content={
        <NumberFormat
          icon={<JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />}
          withDenomination
          as="span"
          value={buyNowPrice}
          format="short"
          variant={contentTextVariant}
        />
      }
    />
  ) : null
})
BuyNow.displayName = 'BuyNow'

const InfoBanner = ({ title, description, size }: { title: string; description: string; size: Size }) => {
  const buttonColumnSpan = size === 'small' ? 1 : 2
  return (
    <GridItem colSpan={buttonColumnSpan}>
      <Banner icon={<SvgAlertsInformative24 />} {...{ title, description }} />
    </GridItem>
  )
}

const WithdrawBidFromPreviousAuction = memo(
  ({
    secondary,
    bidFromPreviousAuction,
    size,
    onWithdrawBid,
  }: {
    size: Size
    secondary?: boolean
    bidFromPreviousAuction: FullBidFieldsFragment | undefined
    onWithdrawBid?: (bid?: BN, createdAt?: Date) => void
  }) => {
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const buttonSize = size === 'small' ? 'medium' : 'large'
    return bidFromPreviousAuction ? (
      <>
        <GridItem colSpan={buttonColumnSpan}>
          <Button
            variant={secondary ? 'secondary' : undefined}
            fullWidth
            size={buttonSize}
            onClick={() =>
              onWithdrawBid?.(new BN(bidFromPreviousAuction.amount), new Date(bidFromPreviousAuction.createdAt))
            }
          >
            Withdraw last bid
          </Button>
          <Text as="p" margin={{ top: 2 }} variant="t100" color="colorText" align="center">
            You bid{' '}
            <NumberFormat
              as="span"
              value={new BN(bidFromPreviousAuction?.amount)}
              format="short"
              variant="t100"
              color="colorText"
              withToken
            />{' '}
            on {formatDateTime(new Date(bidFromPreviousAuction.createdAt))}
          </Text>
        </GridItem>
      </>
    ) : null
  }
)

WithdrawBidFromPreviousAuction.displayName = 'WithdrawBidFromPreviousAuction'
