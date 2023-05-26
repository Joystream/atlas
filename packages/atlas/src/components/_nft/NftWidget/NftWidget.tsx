import BN from 'bn.js'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { FullBidFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Text } from '@/components/Text'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { NftSaleType } from '@/joystream-lib/types'

import { NftHistory, NftHistoryEntry } from './NftHistory'
import {
  CollapsibleButtonWrapper,
  CollapsibleElement,
  CollapsibleWrapper,
  Container,
  Content,
  NftOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  Size,
  StatusContainer,
  StatusMark,
  StyledSvgActionChevronT,
} from './NftWidget.styles'
import { NftWidgetStatus } from './NftWidget.types'
import { NftWidgetContent } from './NftWidgetContent'

export type NftWidgetProps = {
  ownerHandle: string | null | undefined
  ownerAvatarUrls: string[] | null | undefined
  creatorId?: string
  saleType: NftSaleType | null
  isOwnedByChannel?: boolean
  nftStatus: NftWidgetStatus | undefined
  nftHistory: NftHistoryEntry[]
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
}

const SMALL_VARIANT_MAXIMUM_SIZE = 416

export const NftWidget: FC<NftWidgetProps> = ({
  ownerHandle,
  creatorId,
  nftStatus,
  nftHistory,
  isOwnedByChannel,
  ownerAvatarUrls,
  isOwner,
  needsSettling,
  onNftPutOnSale,
  onNftAcceptBid,
  onWithdrawBid,
  bidFromPreviousAuction,
  onNftCancelSale,
  onNftChangePrice,
  onNftPurchase,
  onNftSettlement,
  onNftBuyNow,
  userBidCreatedAt,
  userBidAmount,
}) => {
  const { ref, width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    box: 'border-box',
  })

  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const shouldCollapse = location.state?.shouldCollapse === undefined ? true : location.state?.shouldCollapse

  useEffect(() => {
    setIsCollapsed(shouldCollapse)
  }, [shouldCollapse])

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'

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
                    <ProtectedActionWrapper
                      title="You want to buy this NFT?"
                      description="Log in to take part in NFT auctions"
                    >
                      <Button fullWidth size={buttonSize} onClick={onNftPurchase}>
                        Buy now
                      </Button>
                    </ProtectedActionWrapper>
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
        const startingPriceInUsd = convertHapiToUSD(nftStatus.startingPrice)

        return (
          <>
            {nftStatus.topBidAmount?.gtn(0) && !nftStatus.topBid?.isCanceled ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <TopBidderContainer>
                      <Avatar assetUrl={nftStatus.topBidderAvatarUri} size={24} />
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
                disableSecondary={startingPriceInUsd === null}
                secondaryText={
                  startingPriceInUsd && (
                    <NumberFormat as="span" color="colorText" format="dollar" value={startingPriceInUsd ?? 0} />
                  )
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
                  (nftStatus.buyNowPrice?.gtn(0) ? (
                    <GridItem colSpan={buttonColumnSpan}>
                      <ButtonGrid data-size={size} data-two-columns={size === 'medium'}>
                        <ProtectedActionWrapper
                          title="You want to place a bid on this NFT?"
                          description="Log in to take part in NFT auctions"
                        >
                          <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftPurchase}>
                            {nftStatus.canChangeBid ? 'Change bid' : 'Place bid'}
                          </Button>
                        </ProtectedActionWrapper>
                        <ProtectedActionWrapper
                          title="You want to buy this NFT?"
                          description="Log in to take part in NFT auctions"
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
                            description="Log in to take part in NFT auctions"
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
  }, [
    nftStatus,
    size,
    convertHapiToUSD,
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
    userBidAmount,
    userBidCreatedAt,
  ])

  if (!nftStatus) return null

  return (
    <Container ref={ref}>
      <NftOwnerContainer data-size={size}>
        <OwnerAvatar assetUrls={ownerAvatarUrls} size={40} />
        <OwnerLabel as="span" variant="t100" color="colorText">
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle
          to={
            isOwnedByChannel
              ? absoluteRoutes.viewer.channel(creatorId)
              : ownerHandle
              ? absoluteRoutes.viewer.member(ownerHandle)
              : ''
          }
        >
          <Text as="span" variant="h300">
            {ownerHandle}
          </Text>
        </OwnerHandle>
        <CollapsibleButtonWrapper>
          <Button
            icon={<StyledSvgActionChevronT isCollapsed={isCollapsed} />}
            variant="tertiary"
            size="small"
            onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
          />
        </CollapsibleButtonWrapper>
      </NftOwnerContainer>
      {nftStatus.status !== 'idle' && isCollapsed && (
        <StatusContainer>
          <StatusMark />
          <Text variant="t100" as="p">
            Purchasable
          </Text>
        </StatusContainer>
      )}
      <CollapsibleWrapper collapsed={isCollapsed}>
        <CollapsibleElement>
          <Content data-size={size}>
            <NftWidgetContent
              ownerHandle={ownerHandle}
              size={size}
              nftStatus={nftStatus}
              isOwner={isOwner}
              needsSettling={needsSettling}
              onNftPutOnSale={onNftPutOnSale}
              onNftAcceptBid={onNftAcceptBid}
              onWithdrawBid={onWithdrawBid}
              bidFromPreviousAuction={bidFromPreviousAuction}
              onNftCancelSale={onNftCancelSale}
              onNftChangePrice={onNftChangePrice}
              onNftPurchase={onNftPurchase}
              onNftSettlement={onNftSettlement}
              onNftBuyNow={onNftBuyNow}
              userBidCreatedAt={userBidCreatedAt}
              userBidAmount={userBidAmount}
            />
          </Content>
          <NftHistory size={size} width={width} historyItems={nftHistory} />
        </CollapsibleElement>
      </CollapsibleWrapper>
    </Container>
  )
}
