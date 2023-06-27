import { format } from 'date-fns'
import { FC, ReactNode } from 'react'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  ActivityItemContainer,
  DateText,
  DescriptionSkeletonLoader,
  PillAndDateContainer,
  PillSkeletonLoader,
  Thumbnail,
  ThumbnailSkeletonLoader,
  Title,
  TitleAndDescriptionContainer,
  TitleSkeletonLoader,
} from './ActivityItem.styles'
import { ActivitiesRecord } from './MemberActivity.hooks'

export type ActivityItemProps = {
  type?: ActivitiesRecord['type']
  date?: Date
  title?: string
  description?: ReactNode
  thumbnailUris?: string[]
  thumbnailLoading?: boolean
  loading?: boolean
  onItemClick?: () => void
}
export const ActivityItem: FC<ActivityItemProps> = ({
  date,
  type,
  title,
  description,
  thumbnailUris,
  thumbnailLoading,
  loading,
  onItemClick,
}) => {
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  const getTitleTextVariant = () => {
    if (lgMatch) {
      return 'h400'
    } else if (smMatch) {
      return 'h300'
    } else {
      return 'h200'
    }
  }

  const isImageLoading = loading || thumbnailLoading
  return (
    <ActivityItemContainer loading={loading} onClick={onItemClick}>
      {isImageLoading ? <ThumbnailSkeletonLoader /> : <Thumbnail resolvedUrls={thumbnailUris} />}
      <TitleAndDescriptionContainer>
        {loading ? (
          <TitleSkeletonLoader />
        ) : (
          <Title as="h3" variant={getTitleTextVariant()} title={title}>
            {title}
          </Title>
        )}
        {loading ? (
          <DescriptionSkeletonLoader />
        ) : (
          <Text as="p" variant={lgMatch ? 't300' : 't200'} color="colorText">
            {description}
          </Text>
        )}
      </TitleAndDescriptionContainer>
      {loading ? (
        <PillSkeletonLoader />
      ) : (
        <PillAndDateContainer>
          <Pill label={type} size="medium" />
          {date && (
            <DateText as="p" variant="t100" color="colorText">
              {format(date, 'd MMM yyyy')} at {format(date, 'HH:mm')}
            </DateText>
          )}
        </PillAndDateContainer>
      )}
    </ActivityItemContainer>
  )
}
