import React from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

import { AvatarWrapper, Content, Title, Wrapper } from './NotificationTile.styles'

export type NotificationProps = {
  id: string
  author: string
  text: string
  date: Date | string
  avatarUrl: string
  videoTitle: string
  loading?: boolean
  onSelect?: (id: string) => void
  read?: boolean
  selected?: boolean
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
  className,
}) => {
  return (
    <Wrapper read={read} selected={selected} loading={loading} className={className}>
      <Checkbox onChange={() => onSelect?.(id)} disabled={loading} value={selected} />
      <AvatarWrapper>
        {!loading ? <Avatar size="small" assetUrl={avatarUrl} /> : <SkeletonLoader width={40} height={40} rounded />}
      </AvatarWrapper>
      <Content>
        {!loading ? (
          <>
            <Title>
              <Text as="span" variant="h300" secondary>
                {`${author} `}
              </Text>
              <Text as="span" variant="h300">
                {text}
              </Text>
            </Title>
            <Text variant="t200" secondary>
              {date} • {videoTitle}
            </Text>
          </>
        ) : (
          <>
            <SkeletonLoader width="40%" height={24} bottomSpace={2} />
            <SkeletonLoader width="50%" height={20} />
          </>
        )}
      </Content>
    </Wrapper>
  )
}
