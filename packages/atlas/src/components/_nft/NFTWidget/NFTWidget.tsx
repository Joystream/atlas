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
} from './NFTWidget.styles'

type Size = 'medium' | 'small'
export type NFTWidgetProps = {
  ownerHandle?: string
  ownerAvatarUri?: string
  isOwner: boolean
  auction: 'none' | 'last-price' | 'waiting-for-bids' | 'minimum-bid' | 'top-bid' | 'withdraw' | 'settle'
  buyNowPrice?: number
  lastPrice?: number
  minBid?: number
  topBid?: number
  auctionEndDate?: Date
  lastTransactionDate?: Date
}
// TODO: remove dummy dollar values
export const NFTWidget: React.FC<NFTWidgetProps> = ({
  ownerHandle,
  isOwner,
  auction,
  buyNowPrice,
  lastPrice = 0,
  topBid = 0,
  minBid = 0,
  auctionEndDate,
  ownerAvatarUri,
  lastTransactionDate,
}) => {
  const [containerRef, { width = 281 }] = useMeasure()
  const size: Size = width > 280 ? 'medium' : 'small'

  const content = React.useMemo(() => {
    const contentTextVariant = size === 'small' ? 'h400' : 'h600'
    const buttonSize = size === 'small' ? 'medium' : 'large'
    const buttonColumnSpan = size === 'small' ? 1 : 2
    const buyNowNode = buyNowPrice ? (
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
    const timerNode = !!auctionEndDate && <NFTTimerItem size={size} time={auctionEndDate} />
    const placeABidBuyNowNode = (
      <GridItem colSpan={buttonColumnSpan}>
        <ButtonGrid data-size={size} data-two-columns>
          <Button fullWidth variant="secondary" size={buttonSize}>
            Place a bid
          </Button>
          <Button fullWidth size={buttonSize}>
            Buy now
          </Button>
        </ButtonGrid>
      </GridItem>
    )

    switch (auction) {
      case 'none':
        return (
          <>
            {buyNowPrice ? (
              buyNowNode
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
            {buyNowPrice ? (
              isOwner ? (
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
              )
            ) : (
              isOwner && (
                <GridItem colSpan={buttonColumnSpan}>
                  <Button fullWidth variant="secondary" size={buttonSize}>
                    Start sale of this NFT
                  </Button>
                </GridItem>
              )
            )}
          </>
        )
      case 'last-price':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="Last price"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant} secondary>
                    {formatNumberShort(lastPrice)}
                  </Text>
                </>
              }
              secondaryText={lastTransactionDate && formatDateTime(lastTransactionDate)}
            />
            {isOwner && (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="secondary" size={buttonSize}>
                  Start sale of this NFT
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'waiting-for-bids':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="status"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant} secondary>
                    –
                  </Text>
                </>
              }
              secondaryText="Place first bid"
            />
            {buyNowNode}
            {timerNode}
            {buyNowPrice ? (
              isOwner ? (
                <GridItem colSpan={buttonColumnSpan}>
                  <Button fullWidth variant="destructive" size={buttonSize}>
                    Remove from sale
                  </Button>
                </GridItem>
              ) : (
                placeABidBuyNowNode
              )
            ) : isOwner ? (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="destructive" size={buttonSize}>
                  Remove from sale
                </Button>
              </GridItem>
            ) : (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize}>
                  Place a bid
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'minimum-bid':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="Min bid"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant}>{formatNumberShort(minBid)}</Text>
                </>
              }
              secondaryText="$9,629.25"
            />
            {buyNowNode}
            {timerNode}
            {buyNowPrice ? (
              isOwner ? (
                <GridItem colSpan={buttonColumnSpan}>
                  <Button fullWidth variant="destructive" size={buttonSize}>
                    Remove from sale
                  </Button>
                </GridItem>
              ) : (
                placeABidBuyNowNode
              )
            ) : isOwner ? (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="destructive" size={buttonSize}>
                  Remove from sale
                </Button>
              </GridItem>
            ) : (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize}>
                  Place a bid
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'top-bid':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="Top bid"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant}>{formatNumberShort(topBid)}</Text>
                </>
              }
              secondaryText="$9,629.25"
            />
            {buyNowNode}
            {timerNode}
            {buyNowPrice ? (
              isOwner ? (
                <GridItem colSpan={buttonColumnSpan}>
                  <Button fullWidth variant="destructive" size={buttonSize}>
                    Review and accept bid
                  </Button>
                </GridItem>
              ) : (
                placeABidBuyNowNode
              )
            ) : isOwner ? (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth variant="destructive" size={buttonSize}>
                  Review and accept bid
                </Button>
              </GridItem>
            ) : (
              <GridItem colSpan={buttonColumnSpan}>
                <Button fullWidth size={buttonSize}>
                  Place a bid
                </Button>
              </GridItem>
            )}
          </>
        )
      case 'withdraw':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="Top bid"
              content={
                <>
                  <JoyTokenIcon />
                  <Text variant={contentTextVariant}>{formatNumberShort(topBid)}</Text>
                </>
              }
              secondaryText="$9,629.25"
            />
            {buyNowNode}
            {buyNowPrice ? (
              <>
                <GridItem colSpan={buttonColumnSpan}>
                  <ButtonGrid data-size={size} data-two-columns>
                    <Button fullWidth variant="secondary" size={buttonSize}>
                      Place a bid
                    </Button>
                    <Button fullWidth size={buttonSize}>
                      Buy now
                    </Button>
                    <GridItem colSpan={2}>
                      <Button fullWidth size={buttonSize} variant="destructive-secondary">
                        Withdraw a bid
                      </Button>
                    </GridItem>
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
      case 'settle':
        return (
          <>
            <NFTInfoItem
              size={size}
              label="You have won with"
              content={
                <>
                  <JoyTokenIcon />
                  {/* TODO: probably not top bid but Idk the payload yet */}
                  <Text variant={contentTextVariant}>{formatNumberShort(topBid)}</Text>
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
        )
    }
  }, [size, buyNowPrice, auctionEndDate, auction, isOwner, lastPrice, lastTransactionDate, minBid, topBid])

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
