import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { cVar, transitions } from '@/styles'
import { formatDurationShort, getTimeDiffInSeconds } from '@/utils/time'

import { InfoItemContainer, InfoItemContent, Label, SecondaryText, TimerSecondaryText } from './NftInfoItem.styles'
import { Size } from './NftWidget'

type NftInfoItemProps = {
  size: Size
  label: string
  content: React.ReactNode
  secondaryText?: React.ReactNode | null
}
export const NftInfoItem: React.FC<NftInfoItemProps> = ({ size, label, content, secondaryText }) => {
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
          <div>
            <SecondaryText as="div" variant="t100" secondary data-size={size}>
              {secondaryText ? secondaryText : '‌'}
            </SecondaryText>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </InfoItemContainer>
  )
}

export const NftTimerItem: React.FC<{ size: Size; time: Date }> = ({ size, time }) => {
  useMsTimestamp()
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
