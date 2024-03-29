import { FC, ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { cVar, transitions } from '@/styles'
import { formatDateTime, formatDurationShort, getTimeDiffInSeconds } from '@/utils/time'

import { InfoItemContainer, InfoItemContent, Label, SecondaryText, TimerSecondaryText } from './NftInfoItem.styles'
import { Size } from './NftWidget.styles'

type NftInfoItemProps = {
  size: Size
  label: string
  content: ReactNode
  secondaryText?: ReactNode | null
  loading?: boolean
  disableSecondary?: boolean
}
export const NftInfoItem: FC<NftInfoItemProps> = ({
  size,
  label,
  content,
  secondaryText,
  disableSecondary,
  loading,
}) => {
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
    <InfoItemContainer data-size={size} disableSecondary={disableSecondary}>
      <Label as="span" variant="h100" color="colorText">
        {label}
      </Label>
      <InfoItemContent data-size={size}>{content}</InfoItemContent>
      {!disableSecondary && (
        <CSSTransition
          in={!!secondaryText}
          timeout={parseInt(cVar('animationTransitionFast', true))}
          classNames={transitions.names.fade}
        >
          <SecondaryText data-size={size}>
            <Text as="div" variant="t100" color="colorText">
              {secondaryText ?? '‌'}
            </Text>
          </SecondaryText>
        </CSSTransition>
      )}
    </InfoItemContainer>
  )
}

export const NftTimerItem: FC<{ size: Size; time?: Date }> = ({ size, time }) => {
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
  const moreThan72HLeft: boolean = timeInSeconds > 72 * 60 * 60

  const formatedDuration = formatDurationShort(timeInSeconds, true)

  // [hours, minutes, seconds]
  const hoursMinutesSecondsArray = formatedDuration.split(':')

  return (
    <InfoItemContainer data-size={size}>
      <Label as="span" variant="h100" color="colorText">
        Auction ends in
      </Label>
      <InfoItemContent data-size={size}>
        <div>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? 'colorTextError' : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[0]}
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? 'colorTextError' : 'colorText'}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            :
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? 'colorTextError' : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[1]}
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? 'colorTextError' : 'colorText'}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            :
          </Text>
          <Text
            as="span"
            color={lessThanAMinuteLeft ? 'colorTextError' : undefined}
            variant={size === 'small' ? 'h400' : 'h600'}
          >
            {hoursMinutesSecondsArray[2]}
          </Text>
        </div>
      </InfoItemContent>
      {lessThanAMinuteLeft && (
        <TimerSecondaryText
          color={lessThanAMinuteLeft ? 'colorTextError' : undefined}
          as="p"
          variant="t100"
          data-size={size}
        >
          Less than a minute
        </TimerSecondaryText>
      )}
      {moreThan72HLeft && (
        <TimerSecondaryText color="colorText" as="p" variant="t100" data-size={size}>
          {formatDateTime(time)}
        </TimerSecondaryText>
      )}
    </InfoItemContainer>
  )
}
