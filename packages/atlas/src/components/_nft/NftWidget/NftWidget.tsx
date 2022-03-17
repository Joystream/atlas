import React from 'react'
import useResizeObserver from 'use-resize-observer'

import { useNft } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useDeepMemo } from '@/hooks/useDeepMemo'
import { useNftState } from '@/hooks/useNftState'
import { useMemberAvatar } from '@/providers/assets'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useUser } from '@/providers/user'
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
  sizeObj,
} from './NftWidget.styles'

export type Size = keyof typeof sizeObj

export type Auction = {
  status: 'auction'
  startingPrice: number
  buyNowPrice?: number
  topBid?: number
  isCompleted?: boolean
  auctionPlannedEndDate?: Date
  startsAtDate?: Date
  canWithdrawBid?: boolean
}

export type NftWidgetProps = {
  ownerHandle?: string
  ownerAvatarUri?: string | null
  isOwner?: boolean
  needsSettling?: boolean
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
}

const SMALL_VARIANT_MAXIMUM_SIZE = 280

export const NftWidget: React.FC<NftWidgetProps> = ({
  ownerHandle,
  isOwner,
  nftStatus = { status: 'idle' },
  needsSettling,
  ownerAvatarUri,
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
            {isOwner && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="secondary" size={buttonSize}>
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
      case 'auction':
        return needsSettling ? (
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
        ) : (
          <>
            {nftStatus.topBid ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <Text variant={contentTextVariant}>{formatNumberShort(nftStatus.topBid)}</Text>
                  </>
                }
                secondaryText={convertToUSD(nftStatus.topBid)}
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
            {!!nftStatus.auctionPlannedEndDate && <NftTimerItem size={size} time={nftStatus.auctionPlannedEndDate} />}
            {isOwner ? (
              (!nftStatus.auctionPlannedEndDate ||
                // english auction with no bids
                (nftStatus.auctionPlannedEndDate && !nftStatus.topBid)) && (
                <GridItem colSpan={buttonColumnSpan}>
                  <ButtonGrid data-size={size}>
                    {!nftStatus.auctionPlannedEndDate && !!nftStatus.topBid && (
                      <Button fullWidth size={buttonSize}>
                        Review and accept bid
                      </Button>
                    )}
                    <Button
                      fullWidth
                      variant={
                        !nftStatus.auctionPlannedEndDate && !!nftStatus.topBid ? 'destructive-secondary' : 'destructive'
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
                  <Button fullWidth size={buttonSize} variant="destructive-secondary">
                    Withdraw a bid
                  </Button>
                </ButtonGrid>
              </GridItem>
            )}
          </>
        )
    }
  }, [size, nftStatus, convertToUSD, isOwner, needsSettling])
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
  const { isOwner, canWithdrawBid, needsSettling, auctionPlannedEndDate } = useNftState(nft)

  const owner = nft?.ownerMember

  const { url: ownerAvatarUri } = useMemberAvatar(owner)

  switch (nftStatus.status) {
    case 'auction': {
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        nftStatus: {
          ...nftStatus,
          canWithdrawBid,
          auctionPlannedEndDate,
        },
      }
    }
    case 'buy-now':
      return {
        ownerHandle: owner?.handle,
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
        ownerAvatarUri,
        isOwner,
        needsSettling,
        nftStatus: {
          ...nftStatus,
        },
      }
  }

  return null
}
