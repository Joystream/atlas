import { differenceInSeconds } from 'date-fns'
import { FC, memo } from 'react'
import useResizeObserver from 'use-resize-observer'

import { BasicBidFieldsFragment, FullBidFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Banner } from '@/components/Banner'
import { GridItem } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgAlertsInformative24 } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useDeepMemo } from '@/hooks/useDeepMemo'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { EnglishTimerState } from '@/hooks/useNftState'
import { NftSaleType } from '@/joystream-lib'
import { useTokenPrice } from '@/providers/joystream'
import { formatDateTime, formatDurationShort, formatTime } from '@/utils/time'

import { NftHistory, NftHistoryEntry } from './NftHistory'
import { NftInfoItem, NftTimerItem } from './NftInfoItem'
import {
  ButtonGrid,
  Container,
  Content,
  NftOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  Size,
  TopBidderContainer,
  TopBidderTokenContainer,
} from './NftWidget.styles'

export type Auction = {
  status: 'auction'
  type: 'open' | 'english'
  startingPrice: number
  buyNowPrice: number | undefined
  topBid: BasicBidFieldsFragment | undefined
  topBidAmount: number | undefined
  topBidderHandle: string | undefined
  topBidderAvatarUri: string | null | undefined
  isUserTopBidder: boolean | undefined
  userBidAmount: number | undefined
  userBidUnlockDate: Date | undefined
  canWithdrawBid: boolean | undefined
  canChangeBid: boolean | undefined
  hasTimersLoaded: boolean | undefined
  englishTimerState: EnglishTimerState | undefined
  auctionPlannedEndDate: Date | undefined
  startsAtDate: Date | undefined
  plannedEndAtBlock: number | null | undefined
  startsAtBlock: number | null | undefined
  auctionBeginsInDays: number
  auctionBeginsInSeconds: number
  isUserWhitelisted: boolean | undefined
}

export type NftWidgetProps = {
  ownerHandle: string | undefined
  ownerAvatarUri: string | null | undefined
  isOwner: boolean | undefined
  needsSettling: boolean | undefined
  bidFromPreviousAuction: FullBidFieldsFragment | undefined
  saleType: NftSaleType | null
  nftStatus?:
    | {
        status: 'idle'
        lastSalePrice: number | undefined
        lastSaleDate: Date | undefined
      }
    | {
        status: 'buy-now'
        buyNowPrice: number
      }
    | Auction
    | undefined
  nftHistory: NftHistoryEntry[]
  onNftPurchase?: () => void
  onNftSettlement?: () => void
  onNftBuyNow?: () => void
  onNftPutOnSale?: () => void
  onNftAcceptBid?: () => void
  onNftCancelSale?: () => void
  onNftChangePrice?: () => void
  onWithdrawBid?: () => void
}

const SMALL_VARIANT_MAXIMUM_SIZE = 416

export const NftWidget: FC<NftWidgetProps> = ({
  ownerHandle,
  isOwner,
  nftStatus,
  nftHistory,
  needsSettling,
  ownerAvatarUri,
  onNftPutOnSale,
  onNftAcceptBid,
  onWithdrawBid,
  bidFromPreviousAuction,
  onNftCancelSale,
  onNftChangePrice,
  onNftPurchase,
  onNftSettlement,
  onNftBuyNow,
}) => {
  const timestamp = useMsTimestamp()
  const { ref, width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    box: 'border-box',
  })

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'
  const { convertToUSD, isLoadingPrice } = useTokenPrice()

  const content = useDeepMemo(() => {
    if (!nftStatus) {
      return
    }
    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const timerColumnSpan = size === 'small' ? 1 : 2
    const BuyNow = memo(({ buyNowPrice }: { buyNowPrice?: number }) =>
      buyNowPrice ? (
        <NftInfoItem
          size={size}
          label="Buy now"
          content={
            <>
              <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
              <NumberFormat as="span" value={buyNowPrice} format="short" variant={contentTextVariant} />
            </>
          }
          secondaryText={
            convertToUSD(buyNowPrice) ? (
              <NumberFormat as="span" color="colorText" format="dollar" value={convertToUSD(buyNowPrice) ?? 0} />
            ) : undefined
          }
        />
      ) : null
    )
    BuyNow.displayName = 'BuyNow'
    const InfoBanner = ({ title, description }: { title: string; description: string }) => (
      <GridItem colSpan={buttonColumnSpan}>
        <Banner icon={<SvgAlertsInformative24 />} {...{ title, description }} />
      </GridItem>
    )
    const WithdrawBidFromPreviousAuction = ({ secondary }: { secondary?: boolean }) =>
      bidFromPreviousAuction ? (
        <>
          <GridItem colSpan={buttonColumnSpan}>
            <Button variant={secondary ? 'secondary' : undefined} fullWidth size={buttonSize} onClick={onWithdrawBid}>
              Withdraw last bid
            </Button>
            <Text as="p" margin={{ top: 2 }} variant="t100" color="colorText" align="center">
              You bid{' '}
              <NumberFormat
                as="span"
                value={Number(bidFromPreviousAuction?.amount)}
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

    const BidPlacingInfoText = () => (
      <Text as="p" variant="t100" color="colorText" align="center">
        Placing a bid will withdraw your last bid
      </Text>
    )

    switch (nftStatus.status) {
      case 'idle':
        return (
          <>
            {nftStatus.lastSalePrice ? (
              <NftInfoItem
                size={size}
                label="Last price"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <NumberFormat
                      as="span"
                      value={nftStatus.lastSalePrice}
                      format="short"
                      variant={contentTextVariant}
                      color="colorText"
                    />
                  </>
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
                  title="Withdraw your bid"
                  description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                />
                <WithdrawBidFromPreviousAuction />
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
            <BuyNow buyNowPrice={nftStatus.buyNowPrice} />

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
                      title="Withdraw your bid"
                      description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                    />
                    <WithdrawBidFromPreviousAuction secondary />
                  </>
                )}
              </ButtonGrid>
            </GridItem>
          </>
        )
      case 'auction': {
        const getInfoBannerProps = () => {
          const hasBids = !nftStatus.topBid?.isCanceled && nftStatus.topBidAmount
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

        const infoTextNode = !!nftStatus.userBidAmount && nftStatus.userBidUnlockDate && (
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

        return (
          <>
            {nftStatus.topBidAmount && !nftStatus.topBid?.isCanceled ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <TopBidderContainer>
                      <Avatar assetUrl={nftStatus.topBidderAvatarUri} size="bid" />
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
                  !isLoadingPrice && nftStatus.topBidAmount ? (
                    <>
                      <NumberFormat
                        as="span"
                        color="colorText"
                        format="dollar"
                        value={convertToUSD(nftStatus.topBidAmount) ?? 0}
                      />{' '}
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
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <NumberFormat
                      as="span"
                      format="short"
                      value={nftStatus.startingPrice}
                      variant={contentTextVariant}
                    />
                  </>
                }
                secondaryText={
                  convertToUSD(nftStatus.startingPrice) ? (
                    <NumberFormat
                      as="span"
                      color="colorText"
                      format="dollar"
                      value={convertToUSD(nftStatus.startingPrice) ?? 0}
                    />
                  ) : undefined
                }
              />
            )}
            <BuyNow buyNowPrice={nftStatus.buyNowPrice} />

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

            {nftStatus.hasTimersLoaded && infoBannerProps && <InfoBanner {...infoBannerProps} />}

            {nftStatus.hasTimersLoaded && needsSettling && (nftStatus.isUserTopBidder || isOwner) && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize} onClick={onNftSettlement}>
                  Settle auction
                </Button>
              </GridItem>
            )}

            {nftStatus.hasTimersLoaded && bidFromPreviousAuction && <WithdrawBidFromPreviousAuction />}

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
                  (nftStatus.buyNowPrice ? (
                    <GridItem colSpan={buttonColumnSpan}>
                      <ButtonGrid data-size={size} data-two-columns={size === 'medium'}>
                        <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftPurchase}>
                          {nftStatus.canChangeBid ? 'Change bid' : 'Place bid'}
                        </Button>
                        <Button fullWidth size={buttonSize} onClick={onNftBuyNow}>
                          Buy now
                        </Button>
                        {/* second row button */}
                        {nftStatus.canWithdrawBid && (
                          <GridItem colSpan={buttonColumnSpan}>
                            <Button fullWidth size={buttonSize} variant="destructive-secondary" onClick={onWithdrawBid}>
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
                          <Button fullWidth size={buttonSize} onClick={onNftPurchase}>
                            {nftStatus.canChangeBid ? 'Change bid' : 'Place bid'}
                          </Button>
                        </GridItem>
                        {nftStatus.canWithdrawBid && (
                          <GridItem colSpan={buttonColumnSpan}>
                            <Button fullWidth size={buttonSize} variant="destructive-secondary" onClick={onWithdrawBid}>
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
  }, [
    nftStatus,
    size,
    convertToUSD,
    bidFromPreviousAuction,
    onWithdrawBid,
    isOwner,
    onNftPutOnSale,
    onNftChangePrice,
    onNftCancelSale,
    onNftPurchase,
    isLoadingPrice,
    timestamp,
    needsSettling,
    onNftSettlement,
    onNftAcceptBid,
    onNftBuyNow,
    ownerHandle,
  ])

  if (!nftStatus) return null

  return (
    <Container ref={ref}>
      <NftOwnerContainer data-size={size}>
        <OwnerAvatar assetUrl={ownerAvatarUri} size="small" />
        <OwnerLabel as="span" variant="t100" color="colorText">
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle to={ownerHandle ? absoluteRoutes.viewer.member(ownerHandle) : ''}>
          <Text as="span" variant="h300">
            {ownerHandle}
          </Text>
        </OwnerHandle>
      </NftOwnerContainer>
      <Content data-size={size}>{content}</Content>

      <NftHistory size={size} width={width} historyItems={nftHistory} />
    </Container>
  )
}
