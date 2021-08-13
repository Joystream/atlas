import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useLanguages } from '@/api/hooks'
import {
  ChannelEdge,
  ChannelOrderByInput,
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
  VideoEdge,
} from '@/api/queries'
import { ChannelWithVideos } from '@/components/ChannelWithVideos'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { languages } from '@/config/languages'
import { GridHeadingContainer, LoadMoreButton, Select, SkeletonLoader, Text } from '@/shared/components'
import { SvgGlyphChevronRight } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  AdditionalLink,
  LanguageSelectWrapper,
  LoadMoreButtonWrapper,
  Separator,
  TitleWrapper,
} from './InfiniteGrid.style'

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
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>(null)
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)
  const { languages: queryNodeLanguages, loading: languagesLoading } = useLanguages()
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
  })

  if (error) {
    throw error
  }

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const shouldShowLoadMoreButton =
    onDemand && !loading && (displayedItems.length < totalCount || (maximumCount && totalCount < maximumCount))

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
    if (mappedLanguages.length && languageSelector) {
      setSelectedLanguage(mappedLanguages.find((item) => item.name === 'English')?.value)
    }
  }, [mappedLanguages, languageSelector])

  const onSelectLanguage = (value?: string | null) => {
    setTargetRowsCount(INITIAL_ROWS)
    setSelectedLanguage(value)
  }

  return (
    <section className={className}>
      <TitleWrapper>
        {title && (
          <GridHeadingContainer>
            {!isReady ? <SkeletonLoader height={23} width={250} /> : <Text variant="h4">{title}</Text>}
            {languageSelector && (
              <CSSTransition
                in={!!queryNodeLanguages?.length}
                timeout={parseInt(transitions.timings.loading)}
                classNames={transitions.names.fade}
                mountOnEnter
                unmountOnExit
              >
                <LanguageSelectWrapper>
                  <Select
                    items={mappedLanguages}
                    disabled={languagesLoading}
                    value={selectedLanguage}
                    size="small"
                    helperText={null}
                    onChange={onSelectLanguage}
                  />
                </LanguageSelectWrapper>
              </CSSTransition>
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
          </GridHeadingContainer>
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
