import React, { useEffect, useState } from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'
import { formatDurationShort } from '@/utils/time'

import { InfoItemContainer, InfoItemContent, Label, SecondaryText, TimerSecondaryText } from './NftInfoItem.styles'
import { Size } from './NftWidget'

type NftInfoItemProps = { size: Size; label: string; content: React.ReactNode; secondaryText?: string }
export const NftInfoItem: React.FC<NftInfoItemProps> = ({ size, label, content, secondaryText }) => {
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

const getTimeInSeconds = (time: Date) => Math.max(0, Math.round((time.getTime() - new Date().getTime()) / 1000))
export const NftTimerItem: React.FC<{ size: Size; time: Date }> = ({ size, time }) => {
  const [timeInSeconds, setTimeInSeconds] = useState<number>(getTimeInSeconds(time))

  const lessThanAMinuteLeft: boolean = timeInSeconds < 60

  useEffect(() => {
    const interval = setInterval(() => setTimeInSeconds(getTimeInSeconds(time)), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [time])

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
