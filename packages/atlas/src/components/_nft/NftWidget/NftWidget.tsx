import React from 'react'
import useResizeObserver from 'use-resize-observer'

import { useNft } from '@/api/hooks'
import { AllBidFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Banner } from '@/components/Banner'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgAlertsInformative24 } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useDeepMemo } from '@/hooks/useDeepMemo'
import { EnglishTimerState, useNftState } from '@/hooks/useNftState'
import { useMemberAvatar } from '@/providers/assets'
import { useTokenPrice } from '@/providers/joystream'
import { formatNumberShort } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import { NftHistory } from './NftHistory'
import { NftInfoItem, NftTimerItem } from './NftInfoItem'
import {
  ButtonGrid,
  Container,
  Content,
  NftOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  TopBidderContainer,
  TopBidderTokenContainer,
  sizeObj,
} from './NftWidget.styles'

export type Size = keyof typeof sizeObj

export type Auction = {
  status: 'auction'
  type: 'open' | 'english'
  startingPrice: number
  buyNowPrice: number | undefined
  topBid: number | undefined
  topBidderHandle: string | undefined
  topBidderAvatarUri: string | null | undefined
  isUserTopBidder: boolean | undefined
  userBidAmount: number | undefined
  userBidUnlockDate: Date | undefined
  canWithdrawBid: boolean | undefined
  englishTimerState: EnglishTimerState | undefined
  auctionPlannedEndDate: Date | undefined
  startsAtDate: Date | undefined
}

export type NftWidgetProps = {
  ownerHandle: string | undefined
  ownerAvatarUri: string | null | undefined
  isOwner: boolean | undefined
  needsSettling: boolean | undefined
  bidFromPreviousAuction: AllBidFieldsFragment | undefined
  nftStatus?:
    | {
        status: 'idle'
        lastPrice?: number
        lastTransactionDate?: Date
      }
    | {
        status: 'buy-now'
        buyNowPrice: number
      }
    | Auction
    | undefined
  onNftPurchase?: () => void
  onNftSettlement?: () => void
  onNftBuyNow?: () => void
  onNftPutOnSale?: () => void
  onNftAcceptBid?: () => void
  onNftCancelSale?: () => void
  onNftChangePrice?: () => void
}

const SMALL_VARIANT_MAXIMUM_SIZE = 280

export const NftWidget: React.FC<NftWidgetProps> = ({
  ownerHandle,
  isOwner,
  nftStatus,
  needsSettling,
  ownerAvatarUri,
  onNftPutOnSale,
  onNftAcceptBid,
  bidFromPreviousAuction,
  onNftCancelSale,
  onNftChangePrice,
  onNftPurchase,
  onNftSettlement,
  onNftBuyNow,
}) => {
  const { ref, width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    box: 'border-box',
  })

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'
  const { convertToUSD, isLoadingPrice } = useTokenPrice()

  const content = useDeepMemo(() => {
    if (!nftStatus) return
    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const BuyNow = ({ buyNowPrice }: { buyNowPrice?: number }) =>
      buyNowPrice ? (
        <NftInfoItem
          size={size}
          label="Buy now"
          content={
            <>
              <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
              <Text variant={contentTextVariant}>{formatNumberShort(buyNowPrice)}</Text>
            </>
          }
          secondaryText={convertToUSD(buyNowPrice)}
        />
      ) : null
    const InfoBanner = ({ title, description }: { title: string; description: string }) => (
      <GridItem colSpan={buttonColumnSpan}>
        <Banner id="" dismissable={false} icon={<SvgAlertsInformative24 />} {...{ title, description }} />
      </GridItem>
    )
    const WithdrawBidFromPreviousAuction = ({ secondary }: { secondary?: boolean }) =>
      bidFromPreviousAuction ? (
        <>
          <GridItem colSpan={buttonColumnSpan}>
            <Button variant={secondary ? 'secondary' : undefined} fullWidth size={buttonSize}>
              Withdraw last bid
            </Button>
            <Text as="p" margin={{ top: 2 }} variant="t100" secondary align="center">
              You bid {formatNumberShort(Number(bidFromPreviousAuction?.amount))} tJOY on{' '}
              {formatDateTime(bidFromPreviousAuction.createdAt)}
            </Text>
          </GridItem>
        </>
      ) : null

    const BidPlacingInfoText = () => (
      <Text as="p" variant="t100" secondary align="center">
        Placing a bid will withdraw your last bid
      </Text>
    )

    switch (nftStatus.status) {
      case 'idle':
        return (
          <>
            {nftStatus.lastPrice ? (
              <NftInfoItem
                size={size}
                label="Last price"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <Text variant={contentTextVariant} secondary>
                      {formatNumberShort(nftStatus.lastPrice)}
                    </Text>
                  </>
                }
                secondaryText={nftStatus.lastTransactionDate && formatDateTime(nftStatus.lastTransactionDate)}
              />
            ) : (
              <NftInfoItem
                size={size}
                label="status"
                content={
                  <Text variant={contentTextVariant} secondary>
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
          const hasBids = nftStatus.topBid

          if (nftStatus.type === 'open' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to claim back your money and to be able to participate in this auction.',
            }
          }

          if (nftStatus.englishTimerState === 'expired' && isOwner && !hasBids) {
            return {
              title: 'Auction ended',
              description: 'This auction has ended, but no one made an offer. You can now remove this NFT from sale.',
            }
          }
          if (nftStatus.englishTimerState === 'expired' && !bidFromPreviousAuction && !hasBids && !isOwner) {
            return {
              title: 'Auction ended',
              description:
                "This auction has ended, but no one made an offer. We're waiting for the NFT owner to cancel the auction.",
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
              description: 'You placed a bid in a previous auction that you can now withdraw to claim back your money.',
            }
          }

          if (nftStatus.englishTimerState === 'running' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to claim back your money and to be able to participate in this auction.',
            }
          }

          if (nftStatus.englishTimerState === 'upcoming' && bidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to claim back your money and to be able to participate in the upcoming auction.',
            }
          }

          return null
        }
        const infoBannerProps = getInfoBannerProps()

        const infoTextNode = !!nftStatus.userBidAmount && (
          <GridItem colSpan={buttonColumnSpan}>
            {nftStatus.type === 'english' ? (
              <BidPlacingInfoText />
            ) : (
              <Text as="p" variant="t100" secondary align="center">
                {nftStatus.canWithdrawBid
                  ? `Your last bid: ${nftStatus.userBidAmount} tJOY`
                  : `Your last bid (${nftStatus.userBidAmount} tJOY) becomes withdrawable on ${formatDateTime(
                      nftStatus.userBidUnlockDate as Date
                    )}`}
              </Text>
            )}
          </GridItem>
        )

        return (
          <>
            {nftStatus.topBid ? (
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
                    <Text variant={contentTextVariant}>{formatNumberShort(nftStatus.topBid)}</Text>
                  </>
                }
                secondaryText={
                  !isLoadingPrice ? (
                    <>
                      {convertToUSD(nftStatus.topBid)} from{' '}
                      <OwnerHandle
                        to={absoluteRoutes.viewer.member(nftStatus.topBidderHandle)}
                        variant="secondary"
                        textOnly
                      >
                        <Text variant="t100">{nftStatus.topBidderHandle}</Text>
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
                    <Text variant={contentTextVariant}>{formatNumberShort(nftStatus.startingPrice)}</Text>
                  </>
                }
                secondaryText={convertToUSD(nftStatus.startingPrice)}
              />
            )}
            <BuyNow buyNowPrice={nftStatus.buyNowPrice} />

            {nftStatus.englishTimerState === 'expired' && (
              <NftInfoItem
                size={size}
                label="Auction ended on"
                content={
                  nftStatus.auctionPlannedEndDate && (
                    <Text variant="h400" secondary>
                      {formatDateTime(nftStatus.auctionPlannedEndDate)}
                    </Text>
                  )
                }
              />
            )}
            {!!nftStatus.auctionPlannedEndDate && nftStatus.englishTimerState === 'running' && (
              <NftTimerItem size={size} time={nftStatus.auctionPlannedEndDate} />
            )}
            {nftStatus.englishTimerState === 'upcoming' && (
              <NftInfoItem
                size={size}
                label="Auction begins on"
                content={
                  nftStatus.startsAtDate && (
                    <Text variant="h400" secondary>
                      {formatDateTime(nftStatus.startsAtDate)}
                    </Text>
                  )
                }
              />
            )}
            {infoBannerProps && <InfoBanner {...infoBannerProps} />}

            {needsSettling && (nftStatus.isUserTopBidder || isOwner) && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize} onClick={onNftSettlement}>
                  Settle auction
                </Button>
              </GridItem>
            )}

            {bidFromPreviousAuction && <WithdrawBidFromPreviousAuction />}

            {!needsSettling &&
              !bidFromPreviousAuction &&
              (isOwner ? (
                (nftStatus.type === 'open' ||
                  // english auction with no bids
                  !nftStatus.topBid) && (
                  <GridItem colSpan={buttonColumnSpan}>
                    <ButtonGrid data-size={size}>
                      {nftStatus.type === 'open' && !!nftStatus.topBid && (
                        <Button fullWidth size={buttonSize} onClick={onNftAcceptBid}>
                          Review and accept bid
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant={
                          nftStatus.type === 'open' && !!nftStatus.topBid ? 'destructive-secondary' : 'destructive'
                        }
                        size={buttonSize}
                      >
                        Remove from sale
                      </Button>
                    </ButtonGrid>
                  </GridItem>
                )
              ) : nftStatus.buyNowPrice ? (
                <GridItem colSpan={buttonColumnSpan}>
                  <ButtonGrid data-size={size} data-two-columns={size === 'medium'}>
                    <Button fullWidth variant="secondary" size={buttonSize} onClick={onNftPurchase}>
                      Place a bid
                    </Button>
                    <Button fullWidth size={buttonSize} onClick={onNftBuyNow}>
                      Buy now
                    </Button>
                    {/* second row button */}
                    {nftStatus.canWithdrawBid && (
                      <GridItem colSpan={buttonColumnSpan}>
                        <Button fullWidth size={buttonSize} variant="destructive-secondary">
                          Withdraw a bid
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
                        Place a bid
                      </Button>
                    </GridItem>
                    {nftStatus.canWithdrawBid && (
                      <GridItem colSpan={buttonColumnSpan}>
                        <Button fullWidth size={buttonSize} variant="destructive-secondary">
                          Withdraw a bid
                        </Button>
                      </GridItem>
                    )}
                    {infoTextNode}
                  </ButtonGrid>
                </GridItem>
              ))}
          </>
        )
      }
    }
  }, [
    nftStatus,
    size,
    convertToUSD,
    isLoadingPrice,
    bidFromPreviousAuction,
    isOwner,
    onNftPutOnSale,
    onNftChangePrice,
    onNftCancelSale,
    onNftPurchase,
    needsSettling,
    onNftSettlement,
    onNftAcceptBid,
    onNftBuyNow,
  ])

  if (!nftStatus) return null

  return (
    <Container ref={ref}>
      <NftOwnerContainer data-size={size}>
        <OwnerAvatar assetUrl={ownerAvatarUri} size="small" />
        <OwnerLabel variant="t100" secondary>
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle to={ownerHandle && absoluteRoutes.viewer.member(ownerHandle)} variant="secondary" textOnly>
          <Text variant="h300">{ownerHandle}</Text>
        </OwnerHandle>
      </NftOwnerContainer>
      <Content data-size={size}>{content}</Content>

      <NftHistory size={size} width={width} />
    </Container>
  )
}

type UseNftWidgetReturn = NftWidgetProps | null
export const useNftWidget = (videoId?: string): UseNftWidgetReturn => {
  const { nft, nftStatus } = useNft(videoId ?? '')
  const {
    isOwner,
    englishTimerState,
    canWithdrawBid,
    needsSettling,
    auctionPlannedEndDate,
    userBid,
    startsAtDate,
    isUserTopBidder,
    bidFromPreviousAuction,
    userBidUnlockDate,
  } = useNftState(nft)

  const owner = nft?.ownerMember

  const { url: ownerAvatarUri } = useMemberAvatar(owner)
  const { url: topBidderAvatarUri } = useMemberAvatar(nftStatus?.status === 'auction' ? nftStatus.topBidder : undefined)

  switch (nftStatus?.status) {
    case 'auction': {
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
          startsAtDate,
          canWithdrawBid,
          englishTimerState,
          auctionPlannedEndDate,
          topBidderAvatarUri,
          isUserTopBidder,
          userBidUnlockDate,
          topBidderHandle: nftStatus.topBidder?.handle,
          userBidAmount: Number(userBid?.amount),
        },
      }
    }
    case 'buy-now':
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
        },
      }
    case 'idle':
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
        },
      }
  }

  return null
}
