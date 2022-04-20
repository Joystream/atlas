import React, { useEffect, useState } from 'react'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { ActivitiesRecord } from '@/providers/notifications/notifications.types'
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

export type ActivityItemProps = {
  type: ActivitiesRecord['type']
  date: Date
  title: string
  description?: React.ReactNode
  thumnailUri: string
  videoUrl?: string
}
export const ActivityItem: React.FC<ActivityItemProps> = ({
  date,
  type,
  title,
  description,
  thumnailUri,
  videoUrl,
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

  const isLoading = !date || !type || !title || !thumbnailLoaded
  return (
    <ActivityItemContainer loading={isLoading} to={videoUrl || ''}>
      {isLoading ? <ThumbnailSkeletonLoader /> : <Thumbnail src={thumnailUri} />}
      <TitleAndDescriptionContainer>
        {isLoading ? (
          <TitleSkeletonLoader />
        ) : (
          <Title variant={getTitleTextVariant()} clampAfterLine={smMatch ? 2 : 1}>
            {title}
          </Title>
        )}
        {isLoading ? (
          <DescriptionSkeletonLoader />
        ) : (
          <Text variant={lgMatch ? 't300' : 't200'} secondary>
            {description}
          </Text>
        )}
      </TitleAndDescriptionContainer>
      {isLoading ? (
        <PillSkeletonLoader />
      ) : (
        <PillAndDateContainer>
          <Pill label={type} size="small" />
          <DateText variant="t100" secondary>
            {formatDateTime(date)}
          </DateText>
        </PillAndDateContainer>
      )}
    </ActivityItemContainer>
  )
}
