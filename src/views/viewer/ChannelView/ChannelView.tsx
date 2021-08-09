import { subMonths } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  useChannel,
  useChannelVideoCount,
  useFollowChannel,
  useUnfollowChannel,
  useVideosConnection,
} from '@/api/hooks'
import {
  AssetAvailability,
  SearchQuery,
  VideoFieldsFragment,
  VideoOrderByInput,
  useSearchLazyQuery,
} from '@/api/queries'
import { LimitedWidthContainer, VideoTile, ViewWrapper } from '@/components'
import { SORT_OPTIONS } from '@/config/sorting'
import { AssetType, useAsset, useDialog, usePersonalDataStore } from '@/providers'
import { ChannelCover, Grid, Pagination, Select, Text } from '@/shared/components'
import { SvgGlyphCheck, SvgGlyphPlus, SvgGlyphSearch } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatNumberShort } from '@/utils/number'

import { ChannelAbout } from './ChannelAbout'
import {
  DialogAccentText,
  PaginationContainer,
  SearchButton,
  SearchContainer,
  SortContainer,
  StyledButton,
  StyledButtonContainer,
  StyledChannelLink,
  StyledTabs,
  StyledTextField,
  SubTitle,
  SubTitleSkeletonLoader,
  TabsContainer,
  Title,
  TitleContainer,
  TitleSection,
  TitleSkeletonLoader,
  VideoSection,
} from './ChannelView.style'

const DATE_ONE_MONTH_PAST = subMonths(new Date(), 1)
const TABS = ['Videos', 'Information'] as const
const INITIAL_FIRST = 50
const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
export const ChannelView: React.FC = () => {
  const [openUnfollowDialog, closeUnfollowDialog] = useDialog()
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { channel, loading, error } = useChannel(id)
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
  } = useSearchVideos({ id })
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)
  const [isFollowing, setFollowing] = useState<boolean>()
  const currentTabName = searchParams.get('tab')
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput | undefined>(VideoOrderByInput.CreatedAtDesc)
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { url: coverPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.COVER,
  })
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
        channelId_eq: id,
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
      },
    },
    { notifyOnNetworkStatusChange: true }
  )
  const { videoCount: videosLastMonth } = useChannelVideoCount(id, DATE_ONE_MONTH_PAST)
  useEffect(() => {
    const isFollowing = followedChannels.some((channel) => channel.id === id)
    setFollowing(isFollowing)
  }, [followedChannels, id])

  const handleFollow = () => {
    try {
      if (isFollowing) {
        openUnfollowDialog({
          variant: 'error',
          exitButton: false,
          error: true,
          title: 'Would you consider staying?',
          description: (
            <>
              {channel?.title} released <DialogAccentText>{videosLastMonth} new videos </DialogAccentText>
              this month.
              <br /> Cancel to follow for more fresh content!
            </>
          ),
          primaryButton: {
            text: 'Unfollow',
            onClick: () => {
              updateChannelFollowing(id, false)
              unfollowChannel(id)
              setFollowing(false)
              closeUnfollowDialog()
            },
          },
          secondaryButton: {
            text: 'Keep following',
            onClick: () => {
              closeUnfollowDialog()
            },
          },
        })
      } else {
        updateChannelFollowing(id, true)
        followChannel(id)
        setFollowing(true)
      }
    } catch (error) {
      Logger.warn('Failed to update Channel following', { error })
    }
  }
  if (videosError) {
    throw videosError
  } else if (error) {
    throw error
  } else if (errorSearch) {
    throw errorSearch
  }

  const handleSetCurrentTab = async (tab: number) => {
    if (TABS[tab] === 'Videos' && isSearching) {
      setIsSearchingInputOpen(false)
      searchInputRef.current?.blur()
    }
    setIsSearching(false)
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }
  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
      refetch({ orderBy: value })
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

  const videosPerPage = ROWS_AMOUNT * videosPerRow

  const videos = (isSearching ? searchVideos : edges?.map((edge) => edge.node)) ?? []
  const paginatedVideos = isSearching
    ? videos.slice(currentSearchPage * videosPerPage, currentSearchPage * videosPerPage + videosPerPage)
    : videos.slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)

  const placeholderItems = Array.from(
    { length: loadingVideos || loadingSearch ? videosPerPage - (paginatedVideos ? paginatedVideos.length : 0) : 0 },
    () => ({
      id: undefined,
      progress: undefined,
    })
  )

  const videosWithPlaceholders = [...(paginatedVideos || []), ...placeholderItems]
  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))
  const TabContent = () => {
    switch (currentTabName) {
      default:
      case 'Videos':
        return (
          <>
            <VideoSection className={transitions.names.slide}>
              <Grid maxColumns={null} onResize={handleOnResizeGrid}>
                {videosWithPlaceholders.map((video, idx) => (
                  <VideoTile key={idx} id={video.id} showChannel={false} />
                ))}
              </Grid>
            </VideoSection>
            <PaginationContainer>
              <Pagination
                onChangePage={handleChangePage}
                page={isSearching ? currentSearchPage : currentPage}
                itemsPerPage={videosPerPage}
                totalCount={isSearching ? searchVideos?.length : totalCount}
              />
            </PaginationContainer>
          </>
        )
      case 'Information':
        return <ChannelAbout />
    }
  }

  // At mount set the tab from the search params
  useEffect(() => {
    const tabIndex = TABS.findIndex((t) => t === currentTabName)
    if (tabIndex === -1) setSearchParams({ 'tab': 'Videos' }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading && !channel) {
    return <span>Channel not found</span>
  }
  return (
    <ViewWrapper>
      <ChannelCover assetUrl={coverPhotoUrl} />
      <LimitedWidthContainer>
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="channel" hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <Title variant="h1">{channel.title}</Title>
                <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            ) : (
              <>
                <TitleSkeletonLoader />
                <SubTitleSkeletonLoader />
              </>
            )}
          </TitleContainer>
          <StyledButtonContainer>
            <StyledButton
              icon={isFollowing ? <SvgGlyphCheck /> : <SvgGlyphPlus />}
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={handleFollow}
              size="large"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </StyledButton>
          </StyledButtonContainer>
        </TitleSection>
        <TabsContainer>
          <StyledTabs
            selected={isSearching ? -1 : TABS.findIndex((x) => x === currentTabName)}
            initialIndex={0}
            tabs={mappedTabs}
            onSelectTab={handleSetCurrentTab}
          />
          {currentTabName === 'Videos' && (
            <Search
              searchInputRef={searchInputRef}
              isSearchInputOpen={isSearchInputOpen}
              setIsSearchingInputOpen={setIsSearchingInputOpen}
              setIsSearching={setIsSearching}
              search={search}
            />
          )}
          {currentTabName === 'Videos' && !isSearching && (
            <SortContainer>
              <Text variant="body2">Sort by</Text>
              <Select helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
            </SortContainer>
          )}
        </TabsContainer>
        <TabContent />
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}

const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSearchPage, setCurrentSearchPage] = useState(0)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(0)
    setCurrentSearchPage(0)
  }, [currentTab])
  return { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage }
}

const getVideosFromSearch = (loading: boolean, data: SearchQuery['search'] | undefined) => {
  if (loading || !data) {
    return { channels: [], videos: [] }
  }
  const searchVideos: Array<{ __typename?: 'Video' } & VideoFieldsFragment> = data.flatMap((result) =>
    result.item.__typename === 'Video' ? [result.item] : []
  )
  return { searchVideos }
}
type UseSearchVideosParams = {
  id: string
}
const useSearchVideos = ({ id }: UseSearchVideosParams) => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchVideo, { loading: loadingSearch, data: searchData, error: errorSearch }] = useSearchLazyQuery()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const search = useCallback(
    (searchQuery: string) => {
      searchVideo({
        variables: {
          text: searchQuery,
          whereVideo: {
            isPublic_eq: true,
            mediaAvailability_eq: AssetAvailability.Accepted,
            thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
            channelId_eq: id,
          },
          limit: 100,
        },
      })
    },
    [id, searchVideo]
  )

  const { searchVideos } = useMemo(() => getVideosFromSearch(loadingSearch, searchData?.search), [
    loadingSearch,
    searchData,
  ])

  return {
    searchVideos,
    search,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    errorSearch,
    isSearching,
    setIsSearching,
    searchInputRef,
  }
}

type SearchProps = {
  searchInputRef: React.RefObject<HTMLInputElement>
  isSearchInputOpen: boolean
  setIsSearchingInputOpen: (isOpen: boolean) => void
  setIsSearching: (isOpen: boolean) => void
  search: (searchQuery: string) => void
}
const Search: React.FC<SearchProps> = ({
  searchInputRef,
  isSearchInputOpen,
  setIsSearching,
  search,
  setIsSearchingInputOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        if (searchQuery.trim() === '') {
          setSearchQuery('')
          setIsSearching(false)
        } else {
          search(searchQuery)
          setIsSearching(true)
        }
      }
      if (event.key === 'Escape' || event.key === 'Esc') {
        setIsSearchingInputOpen(false)
        searchInputRef.current?.blur()
        setSearchQuery('')
      }
    },
    [search, searchInputRef, searchQuery, setIsSearching, setIsSearchingInputOpen, setSearchQuery]
  )

  return (
    <SearchContainer>
      <StyledTextField
        ref={searchInputRef}
        isOpen={isSearchInputOpen}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchInputKeyPress}
        placeholder="Search"
        type="search"
        helperText={null}
      />
      <SearchButton
        onClick={() => {
          setIsSearchingInputOpen(true)
          searchInputRef.current?.focus()
        }}
        variant="tertiary"
      >
        <SvgGlyphSearch />
      </SearchButton>
    </SearchContainer>
  )
}
