import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useChannel, useFollowChannel, useSearch, useUnfollowChannel, useVideosConnection } from '@/api/hooks'
import { AssetAvailability, SearchQuery, VideoOrderByInput } from '@/api/queries'
import { LimitedWidthContainer, VideoPreview, ViewWrapper } from '@/components'
import { AssetType, useAsset, usePersonalDataStore } from '@/providers'
import { ChannelCover, Grid, Pagination, Select, Text, TextField } from '@/shared/components'
import { SvgGlyphCheck, SvgGlyphPlus } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatNumberShort } from '@/utils/number'
import { SORT_OPTIONS } from '@/views/studio/MyVideosView/MyVideosView'

import { ChannelAbout } from './ChannelAbout'
import {
  PaginationContainer,
  SearchContainer,
  SortContainer,
  StyledButton,
  StyledButtonContainer,
  StyledChannelLink,
  StyledTabs,
  SubTitle,
  SubTitlePlaceholder,
  TabsContainer,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
} from './ChannelView.style'

const getVideosFromSearch = (loading: boolean, data: SearchQuery['search'] | undefined) => {
  if (loading || !data) {
    return { channels: [], videos: [] }
  }
  const results = data
  const searchVideos = results.flatMap((result) => (result.item.__typename === 'Video' ? [result.item] : []))
  return { searchVideos }
}

const TABS = ['Videos', 'About'] as const
const INITIAL_FIRST = 50
const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
export const ChannelView: React.FC = () => {
  const { id } = useParams()
  const { channel, loading, error } = useChannel(id)
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)
  const [isFollowing, setFollowing] = useState<boolean>()
  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const currentTabName = TABS[currentVideosTab]
  const [sortVideosBy, setSortVideosBy] = useState<typeof SORT_OPTIONS[number]['value'] | undefined>(
    VideoOrderByInput.CreatedAtDesc
  )
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { url: coverPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.COVER,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // TODO: this is not sorting by channel Id
  const { data: search, loading: loadingSearch, error: errorSearch } = useSearch({
    text: searchQuery,
    whereVideo: {
      mediaAvailability_eq: AssetAvailability.Accepted,
      thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
    },
    whereChannel: {
      id_in: [id],
    },
  })
  const { currentPage, setCurrentPage } = usePagination(0)
  const { edges, totalCount: _totalCount, loading: loadingVideos, error: videosError, refetch } = useVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channelId_eq: id,
        isPublic_eq: true,
      },
    },
    { notifyOnNetworkStatusChange: true }
  )
  useEffect(() => {
    const isFollowing = followedChannels.some((channel) => channel.id === id)
    setFollowing(isFollowing)
  }, [followedChannels, id])

  const handleFollow = () => {
    try {
      if (isFollowing) {
        updateChannelFollowing(id, false)
        unfollowChannel(id)
        setFollowing(false)
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
  }

  const handleSorting = (value?: VideoOrderByInput | null | undefined) => {
    if (value) {
      setSortVideosBy(value)
      refetch({ orderBy: value })
    }
  }
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }
  const handleSetCurrentTab = async (tab: number) => {
    setCurrentVideosTab(tab)
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      if (searchQuery.trim() === '') {
        setIsSearching(false)
      } else {
        setIsSearching(true)
      }
    }
    if (e.key === 'Escape' || e.key === 'Esc') {
      setIsSearching(false)
      setSearchQuery('')
    }
  }
  const videosPerPage = ROWS_AMOUNT * videosPerRow

  const { searchVideos } = useMemo(() => getVideosFromSearch(loadingSearch, search), [loadingSearch, search])
  const videos = ((isSearching ? searchVideos : edges?.map((edge) => edge.node)) ?? []).slice(
    currentPage * videosPerPage,
    currentPage * videosPerPage + videosPerPage
  )
  const totalCount = isSearching ? searchVideos?.length : _totalCount

  const placeholderItems = Array.from(
    { length: loadingVideos ? videosPerPage - (videos ? videos.length : 0) : 0 },
    () => ({
      id: undefined,
      progress: undefined,
    })
  )

  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]
  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))

  console.log({ searchVideos, errorSearch, loadingSearch, searchQuery })

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
                <TitlePlaceholder />
                <SubTitlePlaceholder />
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
          <StyledTabs initialIndex={0} tabs={mappedTabs} onSelectTab={handleSetCurrentTab} />
          {currentTabName === 'Videos' && (
            <SearchContainer>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for videos"
                type="search"
                helperText={null}
              />
            </SearchContainer>
          )}
          {currentTabName === 'Videos' && !isSearching && (
            <SortContainer>
              <Text variant="body2">Sort by</Text>
              <Select helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
            </SortContainer>
          )}
        </TabsContainer>
        {(() => {
          switch (currentTabName) {
            case 'Videos':
              return (
                <>
                  <VideoSection className={transitions.names.slide}>
                    <Grid maxColumns={null} onResize={handleOnResizeGrid}>
                      {isSearching
                        ? searchVideos?.map((video, idx) => (
                            <VideoPreview key={idx} id={video.id} showChannel={false} />
                          ))
                        : videosWithPlaceholders.map((video, idx) => (
                            <VideoPreview key={idx} id={video.id} showChannel={false} />
                          ))}
                    </Grid>
                  </VideoSection>
                  <PaginationContainer>
                    <Pagination
                      onChangePage={handleChangePage}
                      page={currentPage}
                      itemsPerPage={videosPerPage}
                      totalCount={totalCount}
                    />
                  </PaginationContainer>
                </>
              )
            case 'About':
              return <ChannelAbout />
          }
        })()}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}

const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(0)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(0)
  }, [currentTab])
  return { currentPage, setCurrentPage }
}
