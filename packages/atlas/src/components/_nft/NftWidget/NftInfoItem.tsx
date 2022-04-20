import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { cVar, transitions } from '@/styles'
import { formatDurationShort, getTimeDiffInSeconds } from '@/utils/time'

import { InfoItemContainer, InfoItemContent, Label, SecondaryText, TimerSecondaryText } from './NftInfoItem.styles'
import { Size } from './NftWidget.styles'

type NftInfoItemProps = {
  size: Size
  label: string
  content: React.ReactNode
  secondaryText?: React.ReactNode | null
  loading?: boolean
}
export const NftInfoItem: React.FC<NftInfoItemProps> = ({ size, label, content, secondaryText, loading }) => {
  if (loading) {
    return (
      <InfoItemContainer data-size={size}>
        <SkeletonLoader width="32%" height={16} />
        <SkeletonLoader width="64%" height={40} />
        {secondaryText && <SkeletonLoader width="32%" height={16} />}
      </InfoItemContainer>
    )
  }
  return (
    <InfoItemContainer data-size={size}>
      <Label variant="h100" secondary>
        {label}
      </Label>
      <InfoItemContent data-size={size}>{content}</InfoItemContent>
      <SwitchTransition>
        <CSSTransition
          key={secondaryText ? 'placeholder' : 'content'}
          timeout={parseInt(cVar('animationTransitionFast', true))}
          classNames={transitions.names.fade}
        >
          <SecondaryText data-size={size}>
            <Text as="div" variant="t100" secondary>
              {secondaryText ?? '‌'}
            </Text>
          </SecondaryText>
        </CSSTransition>
      </SwitchTransition>
    </InfoItemContainer>
  )
}

export const NftTimerItem: React.FC<{ size: Size; time?: Date }> = ({ size, time }) => {
  useMsTimestamp()

  if (!time) {
    return (
      <InfoItemContainer data-size={size}>
        <SkeletonLoader width="32%" height={16} />
        <SkeletonLoader width="64%" height={40} />
      </InfoItemContainer>
    )
  }

  const timeInSeconds = getTimeDiffInSeconds(time)
  const lessThanAMinuteLeft: boolean = timeInSeconds < 60

  const formatedDuration = formatDurationShort(timeInSeconds, true)

  // [hours,minutes,seconds]
  const hoursMinutesSecondsArray = formatedDuration.split(':')

  return (
    <InfoItemContainer data-size={size}>
      <Label variant="h100" secondary>
        Auction ends in
      </Label>
      <InfoItemContent data-size={size}>
        <div>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[0]}
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? cVar('colorTextError') : cVar('colorText')}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            :
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[1]}
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? cVar('colorTextError') : cVar('colorText')}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            :
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[2]}
          </Text>
        </div>
      </InfoItemContent>
      {lessThanAMinuteLeft && (
        <TimerSecondaryText
          color={lessThanAMinuteLeft ? cVar('colorTextError') : undefined}
          as="p"
          variant="t100"
          data-size={size}
        >
          Less than a minute
        </TimerSecondaryText>
      )}
    </InfoItemContainer>
  )
}
