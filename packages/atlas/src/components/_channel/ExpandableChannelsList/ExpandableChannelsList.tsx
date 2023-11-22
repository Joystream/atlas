import { QueryHookOptions } from '@apollo/client'
import { FC, Fragment, useState } from 'react'

import { useBasicChannels, useDiscoverChannels } from '@/api/hooks/channel'
import { ChannelOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { ChannelTitle } from '@/components/ChannelTitle'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { LoadMoreButton } from '@/components/_buttons/LoadMoreButton'
import { ChannelWithVideos } from '@/components/_channel/ChannelWithVideos'
import { Select } from '@/components/_inputs/Select'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { publicChannelFilter } from '@/config/contentFilter'
import { SentryLogger } from '@/utils/logs'

import {
  AdditionalLink,
  LanguageSelectWrapper,
  LoadMoreButtonWrapper,
  Separator,
} from './ExpandableChannelsList.styles'

type ChannelsQueryType = 'discover' | 'regular'

type ExpandableChannelsListProps = {
  queryType: ChannelsQueryType
  loading?: boolean
  title?: string
  className?: string
  languageSelector?: boolean
  additionalLink?: {
    name: string
    url: string
  }
}

const INITIAL_ROWS = 3

export const ExpandableChannelsList: FC<ExpandableChannelsListProps> = ({
  queryType,
  title,
  className,
  additionalLink,
  languageSelector,
}) => {
  const [displayedRowsCount, setDisplayedRowsCount] = useState(INITIAL_ROWS)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')

  const { extendedChannels, loading, error } = useChannelsListData(queryType, selectedLanguage)

  const handleLanguageSelect = (value?: string | null) => {
    setDisplayedRowsCount(INITIAL_ROWS)
    setSelectedLanguage(value)
  }

  const handleShowMoreRows = () => {
    setDisplayedRowsCount((prevState) => prevState + 3)
  }

  const totalCount = extendedChannels?.length || 0

  const placeholderItems = Array.from({ length: INITIAL_ROWS }, () => ({ channel: { id: undefined } }))
  const shouldShowLoadMoreButton = !loading && totalCount >= displayedRowsCount

  const itemsToShow = [...(extendedChannels || []), ...(loading ? placeholderItems : [])].slice(0, displayedRowsCount)

  if (error) {
    return null
  }

  return (
    <section className={className}>
      <GridHeadingContainer>
        {title && (
          <TitleContainer>
            {loading ? (
              <SkeletonLoader height={23} width={250} />
            ) : (
              <ChannelTitle variant="h500" as="h2">
                {title}
              </ChannelTitle>
            )}
            {languageSelector && (
              <LanguageSelectWrapper>
                <Select
                  items={atlasConfig.derived.languagesSelectValues}
                  value={selectedLanguage}
                  size="medium"
                  onChange={handleLanguageSelect}
                />
              </LanguageSelectWrapper>
            )}
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
        itemsToShow.map(({ channel }, idx) => (
          <Fragment key={`channels-with-videos-${idx}`}>
            <ChannelWithVideos channelId={channel?.id} />
            {idx + 1 < itemsToShow.length && <Separator />}
          </Fragment>
        ))
      ) : (
        <>
          <EmptyFallback title="No channels found" variant="large" />
          <Separator />
        </>
      )}

      {shouldShowLoadMoreButton && (
        <LoadMoreButtonWrapper>
          <LoadMoreButton onClick={handleShowMoreRows} label="Show more channels" />
        </LoadMoreButtonWrapper>
      )}
    </section>
  )
}

// in this function we call hooks conditionally to pick proper query for the desired use case
// this will trigger ESLint plugin for hooks rules
// however, the true rule is that the order of hook invocations must be preserved
// we don't break that rule since we will always call one hook and we will never change `queryType` between rerenders
const useChannelsListData = (queryType: ChannelsQueryType, selectedLanguage: string | null | undefined) => {
  const commonOpts: QueryHookOptions = {
    onError: (error) => SentryLogger.error('Failed to fetch channels', 'ExpandableChannelsList', error),
    context: { delay: 2000 },
  }
  const activeVideosCountGt = 3

  const discover = useDiscoverChannels(
    {
      where: {
        activeVideosCount_gt: activeVideosCountGt,
        channel: {
          ...publicChannelFilter,
          followsNum_gt: 0,
        },
      },
    },
    { ...commonOpts, skip: queryType !== 'discover' }
  )

  // regular channels query needs explicit limit and sorting as it's not defined by Orion
  const regular = useBasicChannels(
    {
      limit: 15,
      orderBy: ChannelOrderByInput.IdDesc,
      where: {
        activeVideosCount_gt: 0,
        channel: {
          ...publicChannelFilter,
          language_contains: selectedLanguage,
        },
      },
    },
    { ...commonOpts, skip: queryType !== 'regular' }
  )

  if (queryType === 'discover') {
    return discover
  } else {
    return regular
  }
}
