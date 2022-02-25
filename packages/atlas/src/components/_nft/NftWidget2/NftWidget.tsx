import React, { useEffect } from 'react'
import useMeasure from 'react-use-measure'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { cVar } from '@/styles'
import { formatNumberShort } from '@/utils/number'
import { formatDateTime, formatDurationShort } from '@/utils/time'

import {
  ButtonGrid,
  Container,
  Content,
  InfoItemContainer,
  InfoItemContent,
  JoyTokenIcon,
  Label,
  NFTHistoryHeader,
  NFTOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  SecondaryText,
  TimerSecondaryText,
} from './NftWidget.styles'

type Size = 'medium' | 'small'

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
    | { status: 'iddle'; lastPrice?: number; lastTransactionDate?: Date }
    | { status: 'buy-now'; buyNowPrice: number }
    | Auction
}

// TODO: Update Joy icon with the right variant once it is exported correctly
// TODO: remove dummy dollar values
export const NftWidget: React.FC<NftWidgetProps> = ({ ownerHandle, isOwner, nftState, ownerAvatarUri }) => {
  const [containerRef, { width = 281 }] = useMeasure()
  const size: Size = width > 280 ? 'medium' : 'small'

  const content = React.useMemo(() => {
    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const BuyNow = ({ buyNowPrice }: { buyNowPrice?: number }) =>
      buyNowPrice ? (
        <NFTInfoItem
          size={size}
          label="Buy now"
          content={
            <>
              <JoyTokenIcon />
              <Text variant={contentTextVariant}>{formatNumberShort(buyNowPrice)}</Text>
            </>
          }
          secondaryText="$9,629.25"
        />
      ) : null

    switch (nftState.status) {
      case 'iddle':
        return (
          <>
            {nftState.lastPrice ? (
              <NFTInfoItem
                size={size}
                label="Last price"
                content={
                  <>
                    <JoyTokenIcon />
                    <Text variant={contentTextVariant} secondary>
                      {formatNumberShort(nftState.lastPrice)}
                    </Text>
                  </>
                }
                secondaryText={nftState.lastTransactionDate && formatDateTime(nftState.lastTransactionDate)}
              />
            ) : (
              <NFTInfoItem
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
            <NFTInfoItem
              size={size}
              label="You have won with"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant}>{formatNumberShort(nftState.topBid ?? 0)}</Text>
                </>
              }
              secondaryText="$9,629.25"
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
              <NFTInfoItem
                size={size}
                label="Top bid"
                content={
                  <>
                    <JoyTokenIcon />
                    <Text variant={contentTextVariant}>{formatNumberShort(nftState.topBid)}</Text>
                  </>
                }
                secondaryText="$9,629.25"
              />
            ) : (
              <NFTInfoItem
                size={size}
                label="Starting Price"
                content={
                  <>
                    <JoyTokenIcon />
                    <Text variant={contentTextVariant}>{formatNumberShort(nftState.startingPrice)}</Text>
                  </>
                }
                secondaryText="$9,629.25"
              />
            )}
            <BuyNow buyNowPrice={nftState.buyNowPrice} />
            {!!nftState.auctionPlannedEndDate && <NFTTimerItem size={size} time={nftState.auctionPlannedEndDate} />}
            {isOwner ? (
              <>
                {!nftState.auctionPlannedEndDate && !nftState.topBid && (
                  <GridItem colSpan={buttonColumnSpan}>
                    <Button fullWidth variant="destructive" size={buttonSize}>
                      Remove from sale
                    </Button>
                  </GridItem>
                )}
                {!nftState.auctionPlannedEndDate && !!nftState.topBid && (
                  <GridItem colSpan={buttonColumnSpan}>
                    <Button fullWidth size={buttonSize}>
                      Review and accept bid
                    </Button>
                  </GridItem>
                )}
              </>
            ) : nftState.buyNowPrice ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </>
        )
    }
  }, [size, nftState, isOwner])

  return (
    <Container ref={containerRef}>
      <NFTOwnerContainer data-size={size}>
        <OwnerAvatar assetUrl={ownerAvatarUri} size="small" />
        <OwnerLabel variant="t100" secondary>
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle to={ownerHandle && absoluteRoutes.viewer.member(ownerHandle)} variant="secondary" textOnly>
          {ownerHandle}
        </OwnerHandle>
      </NFTOwnerContainer>
      <Content data-size={size}>{content}</Content>

      {/* TODO: add history */}
      <NFTHistoryHeader data-size={size}>
        <Text variant={size === 'small' ? 'h300' : 'h400'}>History</Text>
        <SvgActionChevronB />
      </NFTHistoryHeader>
    </Container>
  )
}

type NFTInfoItemProps = { size: Size; label: string; content: React.ReactNode; secondaryText?: string }
const NFTInfoItem: React.FC<NFTInfoItemProps> = ({ size, label, content, secondaryText }) => {
  return (
    <InfoItemContainer data-size={size}>
      <Label variant="h100" secondary>
        {label}
      </Label>
      <InfoItemContent data-size={size}>{content}</InfoItemContent>
      <SecondaryText as="p" variant="t100" secondary data-size={size}>
        {secondaryText}
      </SecondaryText>
    </InfoItemContainer>
  )
}

const NFTTimerItem: React.FC<{ size: Size; time: Date }> = ({ size, time }) => {
  const [, rerender] = React.useState({})
  const forceUpdate = React.useCallback(() => rerender({}), [])

  const timeInSeconds = Math.max(0, Math.round((time.getTime() - new Date().getTime()) / 1000))
  const lessThanAMinuteLeft: boolean = timeInSeconds < 60

  useEffect(() => {
    const interval = setInterval(forceUpdate, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [forceUpdate])

  return (
    <InfoItemContainer data-size={size}>
      <Label variant="h100" secondary>
        Auction ends in
      </Label>
      <InfoItemContent data-size={size}>
        <Text
          color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
          variant={size === 'small' ? 'h400' : 'h600'}
        >
          {formatDurationShort(timeInSeconds, true)}
        </Text>
      </InfoItemContent>
      <TimerSecondaryText
        color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
        as="p"
        variant="t100"
        data-size={size}
        data-ends-soon={lessThanAMinuteLeft}
      >
        Less than a minute
      </TimerSecondaryText>
    </InfoItemContainer>
  )
}
