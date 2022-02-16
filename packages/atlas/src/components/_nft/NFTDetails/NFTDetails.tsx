import { add, sub } from 'date-fns'
import React, { useEffect } from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionJoyToken } from '@/components/_icons'
import { cVar } from '@/styles'
import { formatDurationShort } from '@/utils/time'

import {
  Container,
  Content,
  InfoItemContainer,
  InfoItemContent,
  JoyTokenIcon,
  Label,
  NFTOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  SecondaryText,
  TimerSecondaryText,
} from './NFTDetails.styles'

type Size = 'medium' | 'small'
export type NFTDetailsProps = {
  ownerHandle?: string
  ownerAvatarUri?: string
  isOwner: boolean
  auction: 'none' | 'last-price' | 'waiting-for-bids' | 'minimum-bid' | 'top-bid' | 'withdraw'
  withBuyNow: boolean
  withTimer: boolean
  // TODO: Remove later
  size: Size
}
export const NFTDetails: React.FC<NFTDetailsProps> = ({
  ownerHandle,
  isOwner,
  auction,
  withBuyNow,
  withTimer,
  ownerAvatarUri,
  size,
}) => {
  // const size: Size = 'medium'

  return (
    <Container>
      <NFTOwnerContainer data-size={size}>
        <OwnerAvatar assetUrl={ownerAvatarUri} size="small" />
        <OwnerLabel variant="t100" secondary>
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle variant="h300">{ownerHandle}</OwnerHandle>
      </NFTOwnerContainer>
      <Content data-size={size}>
        <NFTInfoItem size={size} label="label" text="Text" secondaryText="$9,629.25" />
        <NFTTimerItem size={size} time={new Date()} />
        <NFTInfoItem size={size} label="label" text="Text" secondaryText="$9,629.25" />
      </Content>
    </Container>
  )
}

type NFTInfoItemProps = { size: Size; label: string; text: string; secondaryText?: string }
const NFTInfoItem: React.FC<NFTInfoItemProps> = ({ size, label, text, secondaryText }) => {
  return (
    <InfoItemContainer data-size={size}>
      <Label variant="h100" secondary>
        {label}
      </Label>
      <InfoItemContent data-size={size}>
        <JoyTokenIcon />
        <Text variant={size === 'small' ? 'h400' : 'h600'}>{text}</Text>
      </InfoItemContent>
      <SecondaryText as="p" variant="t100" secondary data-size={size}>
        {secondaryText}
      </SecondaryText>
    </InfoItemContainer>
  )
}

const theDate = add(new Date(), {
  minutes: 110,
  seconds: 10,
})
const NFTTimerItem: React.FC<{ size: Size; time: Date }> = ({ size }) => {
  const [, rerender] = React.useState({})

  const forceUpdate = React.useCallback(() => rerender({}), [])

  const timeInSeconds = Math.max(0, Math.round((theDate.getTime() - new Date().getTime()) / 1000))
  const lessThanAMinuteLeft = timeInSeconds < 60

  useEffect(() => {
    const interval = setInterval(forceUpdate, 100)
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
      {/* necessary for the layout */}
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
