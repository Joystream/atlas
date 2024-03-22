import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, memo } from 'react'
import { Link } from 'react-router-dom'

import { useBasicChannel } from '@/api/hooks/channel'
import { SvgActionFilters } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { FlexBox } from '@/components/FlexBox'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchResults } from '@/hooks/useSearchResults'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, media, sizes, square } from '@/styles'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

import { FiltersWrapper, PaddingWrapper, Results, SearchControls, StyledSelect } from './SearchResults.styles'

type SearchResultsProps = {
  query: string
}

export const SearchResults: FC<SearchResultsProps> = memo(({ query }) => {
  const smMatch = useMediaMatch('sm')
  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const { videos, channels, loading, error } = useSearchResults({
    searchQuery: query,
    videoWhereInput,
    first: 5,
  })
  const { setSearchOpen, setSearchQuery } = useSearchStore((state) => state.actions)

  const handleSelectLanguage = (selectedLanguage: unknown) => {
    setLanguage(selectedLanguage as string | null | undefined)
    setVideoWhereInput((value) => ({
      ...value,
      language_eq: selectedLanguage === 'undefined' ? undefined : (selectedLanguage as string),
    }))
  }

  const toggleFilters = () => {
    setIsFiltersOpen((state) => !state)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  const showEmptyFallback = !loading && videos.items.length === 0 && channels.items.length === 0 && !!query
  const { pageInfo, items: videoItems, fetchMore } = videos

  return (
    <ViewWrapper>
      <SearchControls>
        <PaddingWrapper filtersOpen={isFiltersOpen}>
          <FiltersWrapper>
            {smMatch && (
              <StyledSelect
                onChange={handleSelectLanguage}
                size="medium"
                value={language}
                items={[{ name: 'All languages', value: 'undefined' }, ...atlasConfig.derived.languagesSelectValues]}
              />
            )}
            <Button
              icon={<SvgActionFilters />}
              iconPlacement="left"
              variant="secondary"
              badge={canClearAllFilters}
              onClick={toggleFilters}
            >
              {smMatch && 'Filters'}
            </Button>
          </FiltersWrapper>
        </PaddingWrapper>
        <FiltersBar {...filtersBarLogic} activeFilters={['categories', 'date', 'length', 'other', 'language']} />
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer>
          {showEmptyFallback ? (
            <EmptyFallback
              title="No results found"
              subtitle="Please, try using different search terms or change your filtering criteria"
              button={
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => {
                    setSearchOpen(true)
                    setSearchQuery('')
                  }}
                >
                  Start new search
                </Button>
              }
            />
          ) : (
            <Section
              contentProps={{
                type: 'grid',
                grid: {
                  xxs: {
                    columns: 1,
                  },
                },
                children: [
                  ...(channels.items[0]
                    ? [
                        <ChannelResultTile
                          key="channel-result"
                          channelId={channels.items[0].id}
                          orientation={smMatch ? 'horizontal' : 'vertical'}
                        />,
                      ]
                    : []),
                  ...(videoItems?.map((video, idx) => (
                    <VideoTileViewer
                      direction={smMatch ? 'horizontal' : 'vertical'}
                      detailsVariant="withChannelName"
                      id={video.id}
                      showDescription={smMatch}
                      key={idx}
                    />
                  )) ?? []),
                ],
              }}
              footerProps={{
                reachedEnd: !pageInfo?.hasNextPage,
                fetchMore: async () => {
                  if (pageInfo?.hasNextPage) {
                    await fetchMore({
                      variables: { first: 4, after: pageInfo.endCursor },
                    })
                  }
                  return
                },
                type: 'infinite',
                loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
              }}
            />
          )}
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
SearchResults.displayName = 'SearchResults'

const ChannelResultTile = ({
  channelId,
  orientation = 'horizontal',
}: {
  channelId: string
  orientation?: 'horizontal' | 'vertical'
}) => {
  const { channel, loading } = useBasicChannel(channelId)
  const { isLoggedIn } = useUser()
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channelId, channel?.title)
  const isHorizontal = orientation === 'horizontal'
  if (loading) {
    return (
      <Container isHorizontal={isHorizontal}>
        <ThumbnailSkeleton width="100%" />
        {isHorizontal && (
          <>
            <FlexBox flow="column" gap={2}>
              <SkeletonLoader width="40%" height={24} />
              <SkeletonLoader width="60%" height={16} />
            </FlexBox>
            <SkeletonLoader />
          </>
        )}
      </Container>
    )
  }

  const details = (
    <>
      <FlexBox alignItems={!isHorizontal ? 'center' : undefined} flow="column" gap={2}>
        <Text variant="h500" as="h3">
          {channel?.title}
        </Text>
        <Text variant="t200" as="p" color="colorText">
          {channel?.followsNum ?? '-'} followers
        </Text>
        {isHorizontal && (
          <Text variant="t200" as="p" color="colorText" clampAfterLine={2}>
            {channel?.description}
          </Text>
        )}
      </FlexBox>

      {isLoggedIn ? (
        <Button variant="secondary" onClick={toggleFollowing}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      ) : (
        <div />
      )}
    </>
  )

  return (
    <Container isHorizontal={isHorizontal}>
      <ChannelCardArticle>
        <ChannelCardAnchor to={absoluteRoutes.viewer.channel(channelId)}>
          <StyledAvatar assetUrls={channel?.avatarPhoto?.resolvedUrls} />
          {orientation !== 'horizontal' && details}
        </ChannelCardAnchor>
      </ChannelCardArticle>
      {isHorizontal && details}
    </Container>
  )
}

const ThumbnailSkeleton = styled(SkeletonLoader)`
  aspect-ratio: 16/9;
`

export const StyledAvatar = styled(Avatar)`
  ${square('136px')}
`

export const ChannelCardAnchor = styled(Link)`
  width: 100%;
  height: 100%;
  text-decoration: none;
  align-items: center;
  transition: ${cVar('animationTransitionFast')} box;
  transition-property: transform, box-shadow;
  display: flex;
  gap: ${sizes(4)};
  justify-content: center;
  flex-direction: column;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(6)} 0;

  ${media.sm} {
    aspect-ratio: 16/9;
  }
`

export const ChannelCardArticle = styled.article<{ activeDisabled?: boolean }>`
  position: relative;
  display: flex;
  min-width: 160px;

  :hover {
    > a {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${sizes(2)} ${sizes(2)} 0 ${cVar('colorCoreBlue500')};
      opacity: 0.7;
    }
  }

  :active {
    > a {
      ${({ activeDisabled }) =>
        !activeDisabled &&
        css`
          transform: translate(0, 0);
          box-shadow: ${sizes(0)} ${sizes(0)} 0 ${cVar('colorCoreBlue500')};
        `}
    }
  }
`

const Container = styled.div<{ isHorizontal: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.isHorizontal ? 'min(40%, 360px) 1fr auto' : '1fr')};
  grid-column-gap: ${sizes(4)};
  align-items: center;
`
