import React, { useRef, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useDeepMemo } from '@/hooks/useDeepMemo'
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
  sizeObj,
} from './NftWidget.styles'

export type Size = keyof typeof sizeObj

export type Auction = {
  status: 'auction'
  startingPrice: number
  buyNowPrice?: number
  topBid?: number
  isCompleted?: boolean
  canWithdrawBid?: boolean
  auctionPlannedEndDate?: Date
}

export type NftWidgetProps = {
  ownerHandle?: string
  ownerAvatarUri?: string
  isOwner: boolean
  nftState:
    | { status: 'idle'; lastPrice?: number; lastTransactionDate?: Date }
    | { status: 'buy-now'; buyNowPrice: number }
    | Auction
}

const SMALL_VARIANT_MAXIMUM_SIZE = 280

// TODO: Update Joy icon with the right variant once it is exported correctly
export const NftWidget: React.FC<NftWidgetProps> = ({ ownerHandle, isOwner, nftState, ownerAvatarUri }) => {
  const [size, setSize] = useState<'medium' | 'small'>('medium')
  const containerRef = useRef(null)
  const { width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    ref: containerRef,
    box: 'border-box',
    onResize: () => setSize(width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'),
  })
  const { convertToUSD } = useTokenPrice()

  const content = useDeepMemo(() => {
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

    switch (nftState.status) {
      case 'idle':
        return (
          <>
            {nftState.lastPrice ? (
              <NftInfoItem
                size={size}
                label="Last price"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <Text variant={contentTextVariant} secondary>
                      {formatNumberShort(nftState.lastPrice)}
                    </Text>
                  </>
                }
                secondaryText={nftState.lastTransactionDate && formatDateTime(nftState.lastTransactionDate)}
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
            <BuyNow buyNowPrice={nftState.buyNowPrice} />
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
        return nftState.isCompleted ? (
          <>
            <NftInfoItem
              size={size}
              label="You have won with"
              content={
                <>
                  <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                  <Text variant={contentTextVariant}>{formatNumberShort(nftState.topBid ?? 0)}</Text>
                </>
              }
              secondaryText={convertToUSD(nftState.topBid ?? 0)}
            />
            <GridItem colSpan={buttonColumnSpan}>
              <Button fullWidth size={buttonSize}>
                Settle auction
              </Button>
            </GridItem>
          </>
        ) : (
          <>
            {nftState.topBid ? (
              <NftInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <Text variant={contentTextVariant}>{formatNumberShort(nftState.topBid)}</Text>
                  </>
                }
                secondaryText={convertToUSD(nftState.topBid)}
              />
            ) : (
              <NftInfoItem
                size={size}
                label="Starting Price"
                content={
                  <>
                    <JoyTokenIcon size={size === 'small' ? 16 : 24} variant="silver" />
                    <Text variant={contentTextVariant}>{formatNumberShort(nftState.startingPrice)}</Text>
                  </>
                }
                secondaryText={convertToUSD(nftState.startingPrice)}
              />
            )}
            <BuyNow buyNowPrice={nftState.buyNowPrice} />
            {!!nftState.auctionPlannedEndDate && <NftTimerItem size={size} time={nftState.auctionPlannedEndDate} />}
            {isOwner ? (
              (!nftState.auctionPlannedEndDate ||
                // english auction with no bids
                (nftState.auctionPlannedEndDate && !nftState.topBid)) && (
                <GridItem colSpan={buttonColumnSpan}>
                  <ButtonGrid data-size={size}>
                    {!nftState.auctionPlannedEndDate && !!nftState.topBid && (
                      <Button fullWidth size={buttonSize}>
                        Review and accept bid
                      </Button>
                    )}
                    <Button
                      fullWidth
                      variant={
                        !nftState.auctionPlannedEndDate && !!nftState.topBid ? 'destructive-secondary' : 'destructive'
                      }
                      size={buttonSize}
                    >
                      Remove from sale
                    </Button>
                  </ButtonGrid>
                </GridItem>
              )
            ) : nftState.buyNowPrice ? (
              <GridItem colSpan={buttonColumnSpan}>
                <ButtonGrid data-size={size} data-two-columns>
                  <Button fullWidth variant="secondary" size={buttonSize}>
                    Place a bid
                  </Button>
                  <Button fullWidth size={buttonSize}>
                    Buy now
                  </Button>
                  {/* second row button */}
                  {nftState.canWithdrawBid && (
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
  }, [size, nftState, convertToUSD, isOwner])

  return (
    <Container ref={containerRef}>
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

      <NftHistory size={size} />
    </Container>
  )
}
