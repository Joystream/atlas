import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { useLanguages } from '@/api/hooks'
import {
  ChannelOrderByInput,
  ChannelWhereInput,
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
} from '@/api/queries'
import { ChannelWithVideos } from '@/components'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { languages } from '@/config/languages'
import { LoadMoreButton, Select, Text } from '@/shared/components'

import { LanguageSelectWrapper, LoadMoreButtonWrapper, Separator, TitleWrapper } from './InfiniteGrid.style'

type InfiniteChannelWithVideosGridProps = {
  onDemand?: boolean
  title?: string
  skipCount?: number
  isReady?: boolean
  className?: string
  languageSelector?: boolean
}

const INITIAL_ROWS = 3
const INITIAL_CHANNELS_PER_ROW = 1

export const InfiniteChannelWithVideosGrid: FC<InfiniteChannelWithVideosGridProps> = ({
  onDemand = false,
  title,
  skipCount = 0,
  isReady = true,
  className,
  languageSelector,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>(null)
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)
  const { languages: queryNodeLanguages, loading: languagesLoading } = useLanguages()
  const fetchMore = useCallback(() => {
    setTargetRowsCount((prevState) => prevState + 3)
  }, [])

  const queryVariables: { where: ChannelWhereInput } = {
    where: {
      ...(selectedLanguage ? { languageId_eq: selectedLanguage } : {}),
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
    isReady: isReady && !!selectedLanguage,
    skipCount,
    orderBy: ChannelOrderByInput.CreatedAtAsc,
    queryVariables,
    targetRowsCount,
    dataAccessor: (rawData) => rawData?.channelsConnection,
    itemsPerRow: INITIAL_CHANNELS_PER_ROW,
  })

  if (error) {
    throw error
  }

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const shouldShowLoadMoreButton = onDemand && !loading && displayedItems.length < totalCount

  const itemsToShow = [...displayedItems, ...placeholderItems]

  const mappedLanguages = useMemo(() => {
    const mergedLanguages: Array<{ name: string; value: string }> = []
    if (queryNodeLanguages) {
      queryNodeLanguages.forEach((language) => {
        const matchedLanguage = languages.find((item) => item.value === language.iso)
        if (matchedLanguage) {
          mergedLanguages.push({
            name: matchedLanguage?.name,
            value: language.id,
          })
        }
      })
    }
    return mergedLanguages
  }, [queryNodeLanguages])

  // Set initial language
  useEffect(() => {
    if (mappedLanguages.length) {
      setSelectedLanguage(mappedLanguages.find((item) => item.name === 'English')?.value)
    }
  }, [mappedLanguages])

  const onSelectLanguage = (value?: string | null) => {
    setTargetRowsCount(INITIAL_ROWS)
    setSelectedLanguage(value)
  }

  return (
    <section className={className}>
      <TitleWrapper>
        {title && <Text variant="h5">{title}</Text>}
        {languageSelector && (
          <LanguageSelectWrapper>
            <Select
              items={mappedLanguages || []}
              disabled={languagesLoading}
              value={selectedLanguage}
              size="small"
              onChange={onSelectLanguage}
            />
          </LanguageSelectWrapper>
        )}
      </TitleWrapper>
      {itemsToShow.map((channel, idx) => (
        <Fragment key={`channels-with-videos-${idx}`}>
          <ChannelWithVideos channelId={channel.id} />
          {idx + 1 < itemsToShow.length && <Separator />}
        </Fragment>
      ))}
      {shouldShowLoadMoreButton && (
        <LoadMoreButtonWrapper>
          <LoadMoreButton onClick={fetchMore} label="Show more channels" />
        </LoadMoreButtonWrapper>
      )}
    </section>
  )
}
