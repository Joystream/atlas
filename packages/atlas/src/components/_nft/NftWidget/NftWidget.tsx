import React from 'react'
import useResizeObserver from 'use-resize-observer'

import { useNft } from '@/api/hooks'
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
import { useJoystream, useTokenPrice } from '@/providers/joystream'
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
  topBidderIsUser: boolean | undefined
  userBid: number | undefined
  canWithdrawBid: boolean | undefined
  needsSettling: boolean
  englishTimerState: EnglishTimerState | undefined
  auctionPlannedEndDate: Date | undefined
  startsAtDate: Date | undefined
}

export type NftWidgetProps = {
  ownerHandle?: string
  ownerAvatarUri?: string | null
  isOwner?: boolean
  needsSettling: boolean | undefined
  hasBidFromPreviousAuction: boolean | undefined
  bidFromPreviousAuction: number | undefined
  bidFromPreviousAuctionDate: Date | undefined
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
  onNftPutOnSale?: () => void
}

const SMALL_VARIANT_MAXIMUM_SIZE = 280

export const NftWidget: React.FC<NftWidgetProps> = ({
  ownerHandle,
  isOwner,
  nftStatus = { status: 'idle' },
  needsSettling,
  ownerAvatarUri,
  onNftPutOnSale,
  hasBidFromPreviousAuction,
}) => {
  const { ref, width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    box: 'border-box',
  })

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'

  const { convertToUSD } = useTokenPrice()
  const content = useDeepMemo(() => {
    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const BuyNow = ({ buyNowPrice }: { buyNowPrice?: number }) =>
      buyNowPrice && Number(buyNowPrice) ? ( // TODO: remove `&& Number(buyNowPrice)` when the payload type of buyNowPrice is fixed and it doesn't return strings anymore
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
    const WithdrawLastBit = ({ secondary }: { secondary?: boolean }) => (
      <GridItem colSpan={buttonColumnSpan}>
        <ButtonGrid data-size={size}>
          <Button variant={secondary ? 'secondary' : undefined} fullWidth size={buttonSize}>
            Withdraw last bid
          </Button>
        </ButtonGrid>
      </GridItem>
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
            {hasBidFromPreviousAuction && (
              <>
                <InfoBanner
                  title="Withdraw your bid"
                  description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                />
                <WithdrawLastBit />
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
            {hasBidFromPreviousAuction && (
              <>
                <InfoBanner
                  title="Withdraw your bid"
                  description="You placed a bid in a previous auction that you can now withdraw to claim back your money."
                />
                <WithdrawLastBit />
              </>
            )}
            {isOwner ? (
              <GridItem colSpan={buttonColumnSpan}>
                <ButtonGrid data-size={size}>
                  <Button fullWidth variant="secondary" size={buttonSize}>
                    Change price
                  </Button>
                  <Button fullWidth variant="destructive" size={buttonSize}>
                    Remove from sale
                  </Button>
                </ButtonGrid>
              </GridItem>
            ) : (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize}>
                  Buy now
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'auction': {
        const getInfoBannerProps = () => {
          const hasBids = nftStatus.topBid

          if (nftStatus.type === 'open' && hasBidFromPreviousAuction) {
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
          if (nftStatus.englishTimerState === 'expired' && !hasBidFromPreviousAuction && !hasBids && !isOwner) {
            return {
              title: 'Auction ended',
              description:
                "This auction has ended, but no one made an offer. We're waiting for the NFT owner to cancel the auction.",
            }
          }
          if (
            nftStatus.englishTimerState === 'expired' &&
            !hasBidFromPreviousAuction &&
            hasBids &&
            !isOwner &&
            !nftStatus.topBidderIsUser
          ) {
            return {
              title: 'Auction ended',
              description:
                'We are waiting for this auction to be settled by the auction winner or the current NFT owner.',
            }
          }
          if (nftStatus.englishTimerState === 'expired' && hasBidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid',
              description: 'You placed a bid in a previous auction that you can now withdraw to claim back your money.',
            }
          }

          if (nftStatus.englishTimerState === 'running' && hasBidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to claim back your money and to be able to participate in this auction.',
            }
          }

          if (nftStatus.englishTimerState === 'upcoming' && hasBidFromPreviousAuction) {
            return {
              title: 'Withdraw your bid to participate',
              description:
                'You placed a bid in a previous auction that you can now withdraw to claim back your money and to be able to participate in the upcoming auction.',
            }
          }

          return null
        }
        const infoBannerProps = getInfoBannerProps()
        return (
          <>
            {needsSettling ? (
              <>
                <NftInfoItem
                  size={size}
                  label="You have won with"
                  content={
                    <>
                      <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                      <Text variant={contentTextVariant}>{formatNumberShort(nftStatus.topBid ?? 0)}</Text>
                    </>
                  }
                  secondaryText={convertToUSD(nftStatus.topBid ?? 0)}
                />
                <GridItem colSpan={buttonColumnSpan}>
                  <Button fullWidth size={buttonSize}>
                    Settle auction
                  </Button>
                </GridItem>
              </>
            ) : nftStatus.topBid ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <TopBidderContainer>
                      <Avatar assetUrl={ownerAvatarUri} size="bid" />
                      <TopBidderTokenContainer data-size={size}>
                        <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                      </TopBidderTokenContainer>
                    </TopBidderContainer>
                    <Text variant={contentTextVariant}>{formatNumberShort(nftStatus.topBid)}</Text>
                  </>
                }
                secondaryText={
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

            {nftStatus.needsSettling && (nftStatus.topBidderIsUser || isOwner) && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize}>
                  Settle auction
                </Button>
              </GridItem>
            )}

            {hasBidFromPreviousAuction && <WithdrawLastBit />}

            {!nftStatus.needsSettling &&
              !hasBidFromPreviousAuction &&
              (isOwner ? (
                (nftStatus.type === 'open' ||
                  // english auction with no bids
                  !nftStatus.topBid) && (
                  <GridItem colSpan={buttonColumnSpan}>
                    <ButtonGrid data-size={size}>
                      {nftStatus.type === 'open' && !!nftStatus.topBid && (
                        <Button fullWidth size={buttonSize}>
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
                    <Button fullWidth variant="secondary" size={buttonSize}>
                      Place a bid
                    </Button>
                    <Button fullWidth size={buttonSize}>
                      Buy now
                    </Button>
                    {/* second row button */}
                    {nftStatus.canWithdrawBid && (
                      <GridItem colSpan={2}>
                        <Button fullWidth size={buttonSize} variant="destructive-secondary">
                          Withdraw a bid
                        </Button>
                      </GridItem>
                    )}
                  </ButtonGrid>
                </GridItem>
              ) : (
                <GridItem colSpan={buttonColumnSpan}>
                  <ButtonGrid data-size={size}>
                    <Button fullWidth size={buttonSize}>
                      Place a bid
                    </Button>
                    {nftStatus.canWithdrawBid && (
                      <Button fullWidth size={buttonSize} variant="destructive-secondary">
                        Withdraw a bid
                      </Button>
                    )}
                  </ButtonGrid>
                </GridItem>
              ))}
          </>
        )
      }
    }
  }, [size, nftStatus, convertToUSD, hasBidFromPreviousAuction, isOwner, onNftPutOnSale, needsSettling, ownerAvatarUri])
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

type UseNftWidgetReturn = NftWidgetProps | null | any
export const useNftWidget = (videoId?: string): UseNftWidgetReturn => {
  const { nft, nftStatus } = useNft(videoId ?? '')
  const { isOwner, canWithdrawBid, needsSettling, auctionPlannedEndDate, userBid, auction } = useNftState(nft)

  const owner = nft?.ownerMember

  const { url: ownerAvatarUri } = useMemberAvatar(owner)
  const { url: topBidderAvatarUri } = useMemberAvatar(
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction'
      ? nft?.transactionalStatus?.auction?.lastBid?.bidder
      : undefined
  )

  switch (nftStatus.status) {
    case 'auction': {
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        nftStatus: {
          ...nftStatus,
          topBidderAvatarUri,
          canWithdrawBid,
          needsSettling,
          englishTimerState,
          startsAtDate,
          auctionPlannedEndDate,
          type,
          userBid: userBid?.amount,
        },
      }
    }
    case 'buy-now':
      return {
        ownerHandle: owner?.handle,
        // TODO:
        hasBidFromPreviousAuction: auction?.isCompleted && false,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        nftStatus: {
          ...nftStatus,
        },
      }
    case 'idle':
      return {
        ownerHandle: owner?.handle,
        hasBidFromPreviousAuction,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        nftStatus: {
          ...nftStatus,
        },
      }
  }
}
