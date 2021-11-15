import React, { FC, Fragment, useCallback, useState } from 'react'

import {
  ChannelEdge,
  ChannelOrderByInput,
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
  VideoEdge,
} from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { Text } from '@/components/Text'
import { ChannelWithVideos } from '@/components/_channel/ChannelWithVideos'
import { SvgGlyphChevronRight } from '@/components/_icons'
import { Select } from '@/components/_inputs/Select'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { languages } from '@/config/languages'
import { SentryLogger } from '@/utils/logs'

import { AdditionalLink, LanguageSelectWrapper, LoadMoreButtonWrapper, Separator } from './InfiniteGrid.styles'

type InfiniteChannelWithVideosGridProps = {
  onDemand?: boolean
  title?: string
  skipCount?: number
  first?: number
  orderBy?: ChannelOrderByInput
  isReady?: boolean
  className?: string
  languageSelector?: boolean
  idIn?: string[] | null
  additionalLink?: {
    name: string
    url: string
  }
  maximumCount?: number
  additionalSortFn?: (edge?: ChannelEdge[] | VideoEdge[]) => (ChannelEdge | VideoEdge)[]
}

const INITIAL_ROWS = 3
const INITIAL_CHANNELS_PER_ROW = 1

export const InfiniteChannelWithVideosGrid: FC<InfiniteChannelWithVideosGridProps> = ({
  onDemand = false,
  title,
  skipCount = 0,
  isReady = true,
  first,
  orderBy = ChannelOrderByInput.CreatedAtAsc,
  className,
  languageSelector,
  idIn = null,
  additionalLink,
  maximumCount,
  additionalSortFn,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)
  const fetchMore = useCallback(() => {
    setTargetRowsCount((prevState) => prevState + 3)
  }, [])

  const queryVariables: GetChannelsConnectionQueryVariables = {
    ...(first ? { first } : {}),
    ...(orderBy ? { orderBy } : {}),
    where: {
      ...(selectedLanguage ? { languageId_eq: selectedLanguage } : {}),
      ...(idIn ? { id_in: idIn } : {}),
      isPublic_eq: true,
      isCensored_eq: false,
    },
  }

  const { displayedItems, placeholdersCount, loading, error, totalCount } = useInfiniteGrid<
    GetChannelsConnectionQuery,
    GetChannelsConnectionQuery['channelsConnection'],
    GetChannelsConnectionQueryVariables
  >({
    query: GetChannelsConnectionDocument,
    isReady: languageSelector ? isReady && !!selectedLanguage : isReady,
    skipCount,
    orderBy,
    queryVariables,
    targetRowsCount,
    dataAccessor: (rawData) => rawData?.channelsConnection,
    itemsPerRow: INITIAL_CHANNELS_PER_ROW,
    additionalSortFn,
    onError: (error) => SentryLogger.error('Failed to fetch channels', 'InfiniteChannelWithVideosGrid', error),
  })

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const shouldShowLoadMoreButton =
    onDemand && !loading && (displayedItems.length < totalCount || (maximumCount && totalCount < maximumCount))

  const itemsToShow = [...displayedItems, ...placeholderItems]

  const onSelectLanguage = (value?: string | null) => {
    setTargetRowsCount(INITIAL_ROWS)
    setSelectedLanguage(value)
  }

  if (error) {
    return null
  }

  return (
    <section className={className}>
      <GridHeadingContainer>
        {title && (
          <TitleContainer>
            {!isReady ? <SkeletonLoader height={23} width={250} /> : <Text variant="h4">{title}</Text>}
            {languageSelector && (
              <LanguageSelectWrapper>
                <Select items={languages} value={selectedLanguage} size="small" onChange={onSelectLanguage} />
              </LanguageSelectWrapper>
            )}
            {additionalLink && (
              <AdditionalLink
                to={additionalLink.url}
                size="medium"
                variant="secondary"
                iconPlacement="right"
                icon={<SvgGlyphChevronRight />}
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
          <EmptyFallback
            title={`No channels found in ${languages.find((language) => language.value === selectedLanguage)?.name}`}
            variant="large"
          />
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
