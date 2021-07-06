import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useChannel, useFollowChannel, useUnfollowChannel, useVideosConnection } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { LimitedWidthContainer, VideoPreview, ViewWrapper } from '@/components'
import { AssetType, useAsset, usePersonalDataStore } from '@/providers'
import { Button, ChannelCover, Grid, Pagination, Select, Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatNumberShort } from '@/utils/number'
import { SORT_OPTIONS } from '@/views/studio/MyVideosView/MyVideosView'

import {
  PaginationContainer,
  SortContainer,
  StyledButtonContainer,
  StyledChannelLink,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
} from './ChannelView.style'

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
  const [sortVideosBy, setSortVideosBy] = useState<typeof SORT_OPTIONS[number]['value'] | undefined>(
    VideoOrderByInput.CreatedAtDesc
  )
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { url: coverPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.COVER,
  })
  const { currentPage, setCurrentPage } = usePagination(0)
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
  if (error) {
    throw error
  }

  if (!loading && !channel) {
    return <span>Channel not found</span>
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
  const videosPerPage = ROWS_AMOUNT * videosPerRow

  const videos = edges
    ?.map((edge) => edge.node)
    .slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)
  const placeholderItems = Array.from(
    { length: loadingVideos ? videosPerPage - (videos ? videos.length : 0) : 0 },
    () => ({
      id: undefined,
      progress: undefined,
    })
  )
  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]

  return (
    <ViewWrapper>
      <ChannelCover assetUrl={coverPhotoUrl} />
      <LimitedWidthContainer>
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="view" hideHandle noLink />
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
            <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow} size="large">
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </StyledButtonContainer>
          <SortContainer>
            <Text variant="body2">Sort by</Text>
            <Select helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
          </SortContainer>
        </TitleSection>
        <VideoSection className={transitions.names.slide}>
          <Grid maxColumns={null} onResize={handleOnResizeGrid}>
            {videosWithPlaceholders.map((video, idx) => (
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
