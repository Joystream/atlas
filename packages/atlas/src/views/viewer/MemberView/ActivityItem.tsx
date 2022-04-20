import React, { useEffect, useState } from 'react'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { imageUrlValidation } from '@/utils/asset'
import { formatDateTime } from '@/utils/time'

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
  type: ActivitiesRecord['type']
  date: Date
  title: string
  description?: React.ReactNode
  thumnailUri: string
  thumbnailLoading?: boolean
  loading?: boolean
  onItemClick?: () => void
}
export const ActivityItem: React.FC<ActivityItemProps> = ({
  date,
  type,
  title,
  description,
  thumnailUri,
  thumbnailLoading,
  loading,
  onItemClick,
}) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  useEffect(() => {
    const validateImg = async () => {
      const res = await imageUrlValidation(thumnailUri)
      setThumbnailLoaded(res)
    }
    validateImg()
  }, [thumnailUri])

  const getTitleTextVariant = () => {
    if (lgMatch) {
      return 'h400'
    } else if (smMatch) {
      return 'h300'
    } else {
      return 'h200'
    }
  }

  const isImageLoading = loading || thumbnailLoading || !thumbnailLoaded
  return (
    <ActivityItemContainer loading={loading} onClick={onItemClick}>
      {isImageLoading ? <ThumbnailSkeletonLoader /> : <Thumbnail src={thumnailUri} />}
      <TitleAndDescriptionContainer>
        {loading ? (
          <TitleSkeletonLoader />
        ) : (
          <Title variant={getTitleTextVariant()} clampAfterLine={smMatch ? 2 : 1}>
            {title}
          </Title>
        )}
        {loading ? (
          <DescriptionSkeletonLoader />
        ) : (
          <Text variant={lgMatch ? 't300' : 't200'} secondary>
            {description}
          </Text>
        )}
      </TitleAndDescriptionContainer>
      {loading ? (
        <PillSkeletonLoader />
      ) : (
        <PillAndDateContainer>
          <Pill label={type} size="medium" />
          <DateText variant="t100" secondary>
            {formatDateTime(date)}
          </DateText>
        </PillAndDateContainer>
      )}
    </ActivityItemContainer>
  )
}
