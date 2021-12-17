import React, { FC, Fragment, useCallback, useState } from 'react'

import { AllChannelFieldsFragment } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { Text } from '@/components/Text'
import { LoadMoreButton } from '@/components/_buttons/LoadMoreButton'
import { ChannelWithVideos } from '@/components/_channel/ChannelWithVideos'
import { SvgActionChevronR } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

import { AdditionalLink, LoadMoreButtonWrapper, Separator } from './InfiniteGrid.styles'

type InfiniteChannelWithVideosGridProps = {
  channels?: AllChannelFieldsFragment[]
  loading?: boolean
  title?: string
  isReady?: boolean
  className?: string
  additionalLink?: {
    name: string
    url: string
  }
}

const INITIAL_ROWS = 3

export const PopularChannelsWithVideoGrid: FC<InfiniteChannelWithVideosGridProps> = ({
  title,
  loading,
  isReady = true,
  className,
  channels,
  additionalLink,
}) => {
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)
  const fetchMore = useCallback(() => {
    setTargetRowsCount((prevState) => prevState + 3)
  }, [])

  const totalCount = channels?.length || 0

  const placeholderItems = Array.from({ length: 3 }, () => ({ id: undefined }))
  const shouldShowLoadMoreButton = !loading && totalCount >= targetRowsCount

  const itemsToShow = [...(channels || []), ...(loading ? placeholderItems : [])].slice(0, targetRowsCount)

  return (
    <section className={className}>
      <GridHeadingContainer>
        {title && (
          <TitleContainer>
            {!isReady ? <SkeletonLoader height={23} width={250} /> : <Text variant="h500">{title}</Text>}
            {additionalLink && (
              <AdditionalLink
                to={additionalLink.url}
                size="medium"
                variant="secondary"
                iconPlacement="right"
                icon={<SvgActionChevronR />}
              >
                {additionalLink.name}
              </AdditionalLink>
            )}
          </TitleContainer>
        )}
      </GridHeadingContainer>
      {itemsToShow.length ? (
        itemsToShow.map((channel, idx) => (
          <Fragment key={`channels-with-videos-${idx}`}>
            <ChannelWithVideos channelId={channel.id} />
            {idx + 1 < itemsToShow.length && <Separator />}
          </Fragment>
        ))
      ) : (
        <>
          <EmptyFallback title={`No channels found`} variant="large" />
          <Separator />
        </>
      )}

      {shouldShowLoadMoreButton && (
        <LoadMoreButtonWrapper>
          <LoadMoreButton onClick={fetchMore} label="Show more channels" />
        </LoadMoreButtonWrapper>
      )}
    </section>
  )
}
