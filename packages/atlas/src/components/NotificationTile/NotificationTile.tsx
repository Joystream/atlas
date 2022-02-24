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
  const titleVariant = variant === 'default' ? 'h300' : 't200-strong'
  const avatarSkeletonSize = variant === 'default' ? 40 : 32
  return (
    <Wrapper read={read} selected={selected} loading={loading} className={className} variant={variant}>
      {!loading ? (
        variant === 'default' && <Checkbox onChange={() => onSelect?.(id)} value={selected} />
      ) : (
        <SkeletonLoader width={16} height={16} />
      )}
      <AvatarWrapper tileVariant={variant}>
        {!loading ? (
          <Avatar size={variant === 'default' ? 'small' : 'default'} assetUrl={avatarUrl} />
        ) : (
          <SkeletonLoader width={avatarSkeletonSize} height={avatarSkeletonSize} rounded />
        )}
      </AvatarWrapper>
      <Content>
        {!loading ? (
          <>
            <Title>
              <Text as="span" variant={titleVariant} secondary>
                {`${author} `}
              </Text>
              <Text as="span" variant={titleVariant}>
                {text}
              </Text>
            </Title>
            <Text variant={variant === 'default' ? 't200' : 't100'} secondary>
              {date} • {videoTitle}
            </Text>
          </>
        ) : (
          <>
            <SkeletonLoader width="40%" height={variant === 'default' ? 24 : 20} bottomSpace={2} />
            <SkeletonLoader width="50%" height={variant === 'default' ? 20 : 19} />
          </>
        )}
      </Content>
    </Wrapper>
  )
}
