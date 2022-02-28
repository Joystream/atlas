import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import React, { useMemo } from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { formatDateAgo } from '@/utils/time'

import { AvatarWrapper, CheckboxSkeleton, Content, StyledListItem, Title, Wrapper } from './NotificationTile.styles'

export type NotificationProps = {
  id: string
  author: string
  text: string
  date: Date
  avatarUrl: string
  videoTitle: string
  loading?: boolean
  onSelect?: (id: string) => void
  read?: boolean
  selected?: boolean
  variant?: 'default' | 'compact'
  className?: string
}

export const NotificationTile: React.FC<NotificationProps> = ({
  id,
  author,
  text,
  date,
  avatarUrl,
  videoTitle,
  loading,
  onSelect,
  read,
  selected = false,
  variant = 'default',
  className,
}) => {
  const formattedDate = useMemo(() => {
    const differenceDays = differenceInDays(new Date(), date)
    const differenceYears = differenceInCalendarYears(new Date(), date)
    if (differenceYears >= 1) {
      return format(date, 'dd LLL yyyy')
    }
    if (differenceDays > 3) {
      return format(date, 'LLL d')
    }
    return formatDateAgo(date)
  }, [date])

  if (variant === 'compact') {
    return (
      <StyledListItem
        loading={loading}
        read={read}
        variant="compact"
        nodeStart={
          !loading ? <Avatar size="default" assetUrl={avatarUrl} /> : <SkeletonLoader width={32} height={32} rounded />
        }
        caption={!loading ? `${formattedDate} • ${videoTitle}` : <SkeletonLoader width="50%" height={19} />}
        label={
          !loading ? (
            <>
              <Text as="span" variant="t200-strong" secondary>
                {`${author} `}
              </Text>
              <Text as="span" variant="t200-strong">
                {text}
              </Text>
            </>
          ) : (
            <SkeletonLoader width="40%" height={20} bottomSpace={2} />
          )
        }
      />
    )
  }

  return (
    <Wrapper read={read} selected={selected} loading={loading} className={className} variant="default">
      {!loading ? (
        <Checkbox onChange={() => onSelect?.(id)} value={selected} />
      ) : (
        <CheckboxSkeleton width={16} height={16} />
      )}
      <AvatarWrapper>
        {!loading ? <Avatar size="small" assetUrl={avatarUrl} /> : <SkeletonLoader width={40} height={40} rounded />}
      </AvatarWrapper>
      {!loading ? (
        <Content>
          <Title>
            <Text as="span" variant="h300" secondary>
              {`${author} `}
            </Text>
            <Text as="span" variant="h300">
              {text}
            </Text>
          </Title>
          <Text variant="t200" secondary>
            {formattedDate} • {videoTitle}
          </Text>
        </Content>
      ) : (
        <Content>
          <SkeletonLoader width="40%" height={24} bottomSpace={2} />
          <SkeletonLoader width="50%" height={20} />
        </Content>
      )}
    </Wrapper>
  )
}
