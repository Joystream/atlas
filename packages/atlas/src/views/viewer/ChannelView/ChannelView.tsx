import { generateChannelMetaTags } from '@joystream/atlas-meta-server/src/tags'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useChannel, useVideosConnection } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { Grid } from '@/components/Grid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Pagination } from '@/components/Pagination'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { Collector, CollectorsBox } from '@/components/_channel/CollectorsBox'
import { SvgActionCheck, SvgActionFilters, SvgActionPlus } from '@/components/_icons'
import { Select } from '@/components/_inputs/Select'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { absoluteRoutes } from '@/config/routes'
import { SORT_OPTIONS } from '@/config/sorting'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRedirectMigratedGizaContent } from '@/hooks/useRedirectMigratedGizaContent'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useAsset } from '@/providers/assets'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatNumberShort } from '@/utils/number'

import { ChannelAbout } from './ChannelAbout'
import { ChannelSearch } from './ChannelSearch'
import {
  CollectorsBoxContainer,
  FilterButtonContainer,
  NotFoundChannelContainer,
  PaginationContainer,
  SortContainer,
  StyledButton,
  StyledButtonContainer,
  StyledChannelLink,
  StyledTabs,
  SubTitle,
  SubTitleSkeletonLoader,
  TabsContainer,
  TabsWrapper,
  Title,
  TitleContainer,
  TitleSection,
  TitleSkeletonLoader,
  VideoSection,
} from './ChannelView.styles'
import { usePagination, useSearchVideos } from './hooks'

export const TABS = ['Videos', 'NFTs', 'Information'] as const
const INITIAL_FIRST = 50
const INITIAL_VIDEOS_PER_ROW = 4
export const ChannelView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null

  // At mount set the tab from the search params
  // This hook has to come before useRedirectMigratedGizaContent so it doesn't messes it's navigate call
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ 'tab': 'Videos' }, { replace: true })
      initialRender.current = false
    }
  })

  useRedirectMigratedGizaContent({ type: 'channel' })
  const videoRows = useVideoGridRows('main')
  const smMatch = useMediaMatch('sm')
  const { id } = useParams()
  const { channel, loading, error } = useChannel(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelView', error, { channel: { id } }),
  })
  const {
    searchVideos,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    isSearching,
    setIsSearching,
    searchInputRef,
    search,
    errorSearch,
    searchQuery,
  } = useSearchVideos({
    id: id ?? '',
    onError: (error) =>
      SentryLogger.error('Failed to search channel videos', 'ChannelView', error, {
        search: { channelId: id, query: searchQuery },
      }),
  })

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(id, channel?.title)
  const [currentTab, setCurrentTab] = useState<typeof TABS[number]>(TABS[0])
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { url: avatarPhotoUrl } = useAsset(channel?.avatarPhoto)
  const { url: coverPhotoUrl } = useAsset(channel?.coverPhoto)
  const { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage } = usePagination(0)
  const {
    edges,
    totalCount,
    loading: loadingVideos,
    error: videosError,
    fetchMore,
    refetch,
    variables,
    pageInfo,
  } = useVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channel: {
          id_eq: id,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'ChannelView', error, { channel: { id } }),
    }
  )
  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    canClearFilters: { canClearAllFilters, clearAllFilters },
  } = filtersBarLogic

  const toggleFilters = () => {
    setIsFiltersOpen((value) => !value)
  }

  const channelMetaTags = useMemo(() => {
    if (!channel || !avatarPhotoUrl) return {}
    return generateChannelMetaTags(channel, avatarPhotoUrl)
  }, [channel, avatarPhotoUrl])
  const headTags = useHeadTags(channel?.title, channelMetaTags)

  const handleSetCurrentTab = async (tab: number) => {
    if (TABS[tab] === 'Videos' && isSearching) {
      setIsSearchingInputOpen(false)
      searchInputRef.current?.blur()
    }
    setIsSearching(false)
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }
  const handleSorting = (value?: unknown) => {
    if (value) {
      setSortVideosBy(value as VideoOrderByInput)
      setCurrentPage(0)
      refetch({ ...variables, orderBy: value as VideoOrderByInput | undefined })
    }
  }
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const handleChangePage = (page: number) => {
    if (isSearching) {
      setCurrentSearchPage(page)
    } else {
      setCurrentPage(page)
      if (!!edges && page * videosPerPage + videosPerPage > edges?.length && edges?.length < (totalCount ?? 0)) {
        fetchMore({
          variables: {
            ...variables,
            first: page * videosPerPage + videosPerPage * 3 - edges.length,
            after: pageInfo?.endCursor,
          },
        })
      }
    }
  }

  const videosPerPage = videoRows * videosPerRow

  const videos = (isSearching ? searchVideos : edges?.map((edge) => edge.node)) ?? []
  const paginatedVideos = isSearching
    ? videos.slice(currentSearchPage * videosPerPage, currentSearchPage * videosPerPage + videosPerPage)
    : videos.slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)

  const placeholderItems = Array.from(
    { length: loadingVideos || loadingSearch ? videosPerPage - (paginatedVideos ? paginatedVideos.length : 0) : 0 },
    () => ({
      id: undefined,
    })
  )

  const videosWithPlaceholders = [...(paginatedVideos || []), ...placeholderItems]
  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))
  const tabContent =
    currentTab === 'Videos' ? (
      <>
        <VideoSection className={transitions.names.slide}>
          {!videosWithPlaceholders.length && isSearching && (
            <EmptyFallback title={`No videos matching "${searchQuery}" query found`} variant="small" />
          )}
          {!videosWithPlaceholders.length && !isSearching && (
            <EmptyFallback title="No videos on this channel" variant="small" />
          )}
          <Grid maxColumns={null} onResize={handleOnResizeGrid}>
            {videosWithPlaceholders.map((video, idx) => (
              <VideoTileViewer key={idx} id={video.id} detailsVariant="withoutChannel" />
            ))}
          </Grid>
        </VideoSection>
        <PaginationContainer>
          <Pagination
            onChangePage={handleChangePage}
            page={isSearching ? currentSearchPage : currentPage}
            itemsPerPage={videosPerPage}
            totalCount={isSearching ? searchVideos?.length : totalCount}
            maxPaginationLinks={7}
          />
        </PaginationContainer>
      </>
    ) : currentTab === 'NFTs' ? (
      <VideoSection className={transitions.names.slide}>
        {isSearching && <EmptyFallback title={`No NFTs matching "${searchQuery}" query found`} variant="small" />}
        {!isSearching && <EmptyFallback title="This channel does not have any NFTs issued yet" variant="small" />}
      </VideoSection>
    ) : (
      <ChannelAbout />
    )

  useEffect(() => {
    if (currentTabName) {
      setCurrentTab(currentTabName)
      setIsFiltersOpen(false)
      clearAllFilters()
    }
  }, [clearAllFilters, currentTabName, setIsFiltersOpen])

  // TODO: replace with real NFT collector data
  const collectors: Collector[] = []

  if (videosError || error || errorSearch) {
    return <ViewErrorFallback />
  }

  if (!loading && !channel) {
    return (
      <NotFoundChannelContainer>
        <EmptyFallback
          title="Channel not found"
          button={
            <Button variant="secondary" size="large" to={absoluteRoutes.viewer.index()}>
              Go back to home page
            </Button>
          }
        />
      </NotFoundChannelContainer>
    )
  }

  return (
    <ViewWrapper>
      {headTags}
      <ChannelCover assetUrl={coverPhotoUrl} />
      <LimitedWidthContainer>
        {smMatch ? (
          <CollectorsBoxContainer>
            {collectors.length > 0 && <CollectorsBox collectors={collectors} />}
          </CollectorsBoxContainer>
        ) : null}
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="channel" hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <Title variant={smMatch ? 'h700' : 'h600'}>{channel.title}</Title>
                <SubTitle variant="t300">{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            ) : (
              <>
                <TitleSkeletonLoader />
                <SubTitleSkeletonLoader />
              </>
            )}
          </TitleContainer>
          {smMatch || collectors.length === 0 ? null : (
            <CollectorsBox collectors={collectors} maxShowedCollectors={4} />
          )}
          <StyledButtonContainer>
            <StyledButton
              icon={isFollowing ? <SvgActionCheck /> : <SvgActionPlus />}
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={toggleFollowing}
              size="large"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </StyledButton>
          </StyledButtonContainer>
        </TitleSection>
        <TabsWrapper isFiltersOpen={isFiltersOpen}>
          <TabsContainer>
            <StyledTabs
              selected={isSearching ? -1 : TABS.findIndex((x) => x === currentTab)}
              initialIndex={0}
              tabs={mappedTabs}
              onSelectTab={handleSetCurrentTab}
            />
            {['Videos', 'NFTs'].includes(currentTab) && (
              <>
                <ChannelSearch
                  searchInputRef={searchInputRef}
                  isSearchInputOpen={isSearchInputOpen}
                  setIsSearchingInputOpen={setIsSearchingInputOpen}
                  setIsSearching={setIsSearching}
                  search={search}
                  isSearching={isSearching}
                  setCurrentTab={setCurrentTab}
                />
                <SortContainer>
                  <Select
                    size="small"
                    labelPosition="left"
                    disabled={isSearching}
                    value={!isSearching ? sortVideosBy : 0}
                    placeholder={isSearching ? 'Best match' : undefined}
                    items={!isSearching ? SORT_OPTIONS : []}
                    onChange={!isSearching ? handleSorting : undefined}
                  />
                </SortContainer>
                <FilterButtonContainer>
                  <Button
                    badge={canClearAllFilters}
                    variant="secondary"
                    icon={<SvgActionFilters />}
                    onClick={toggleFilters}
                  >
                    {smMatch && 'Filters'}
                  </Button>
                </FilterButtonContainer>
              </>
            )}
          </TabsContainer>
          <FiltersBar {...filtersBarLogic} activeFilters={['nftStatus', 'categories']} />
        </TabsWrapper>
        {tabContent}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
