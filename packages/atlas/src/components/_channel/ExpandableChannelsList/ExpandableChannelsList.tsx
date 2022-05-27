import { QueryHookOptions } from '@apollo/client'
import { FC, Fragment, useState } from 'react'

import { useChannels, useDiscoverChannels, usePopularChannels, usePromisingChannels } from '@/api/hooks'
import { ChannelOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { Text } from '@/components/Text'
import { LoadMoreButton } from '@/components/_buttons/LoadMoreButton'
import { ChannelWithVideos } from '@/components/_channel/ChannelWithVideos'
import { SvgActionChevronR } from '@/components/_icons'
import { Select } from '@/components/_inputs/Select'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { languages } from '@/config/languages'
import { SentryLogger } from '@/utils/logs'

import {
  AdditionalLink,
  LanguageSelectWrapper,
  LoadMoreButtonWrapper,
  Separator,
} from './ExpandableChannelsList.styles'

type ChannelsQueryType = 'discover' | 'promising' | 'popular' | 'regular'

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

  const { channels, loading, error } = useChannelsListData(queryType, selectedLanguage)

  const handleLanguageSelect = (value?: string | null) => {
    setDisplayedRowsCount(INITIAL_ROWS)
    setSelectedLanguage(value)
  }

  const handleShowMoreRows = () => {
    setDisplayedRowsCount((prevState) => prevState + 3)
  }

  const totalCount = channels?.length || 0

  const placeholderItems = Array.from({ length: INITIAL_ROWS }, () => ({ id: undefined }))
  const shouldShowLoadMoreButton = !loading && totalCount >= displayedRowsCount

  const itemsToShow = [...(channels || []), ...(loading ? placeholderItems : [])].slice(0, displayedRowsCount)

  if (error) {
    return null
  }

  return (
    <section className={className}>
      <GridHeadingContainer>
        {title && (
          <TitleContainer>
            {loading ? <SkeletonLoader height={23} width={250} /> : <Text variant="h500">{title}</Text>}
            {languageSelector && (
              <LanguageSelectWrapper>
                <Select items={languages} value={selectedLanguage} size="small" onChange={handleLanguageSelect} />
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
        itemsToShow.map((channel, idx) => (
          <Fragment key={`channels-with-videos-${idx}`}>
            <ChannelWithVideos channelId={channel.id} />
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
  }
  const commonWhere = {
    where: {
      activeVideosCounter_gt: 4,
    },
  }

  const discover = useDiscoverChannels(commonWhere, { ...commonOpts, skip: queryType !== 'discover' })
  const popular = usePopularChannels(commonWhere, { ...commonOpts, skip: queryType !== 'popular' })
  const promising = usePromisingChannels(commonWhere, { ...commonOpts, skip: queryType !== 'promising' })
  // regular channels query needs explicit limit and sorting as it's not defined by Orion
  const regular = useChannels(
    {
      limit: 15,
      orderBy: ChannelOrderByInput.CreatedAtAsc,
      where: { activeVideosCounter_gt: 1, language: { iso_contains: selectedLanguage } },
    },
    { ...commonOpts, skip: queryType !== 'regular' }
  )

  if (queryType === 'discover') {
    return discover
  } else if (queryType === 'popular') {
    return popular
  } else if (queryType === 'promising') {
    return promising
  } else {
    return regular
  }
}
