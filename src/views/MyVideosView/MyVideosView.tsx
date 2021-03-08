import { useVideos, useVideosConnection } from '@/api/hooks'
import { VideoPreview, VideoPreviewProps } from '@/components'
import { useDrafts } from '@/hooks'
import { Grid, Pagination, Tabs, DismissibleMessage, ActionBar } from '@/shared/components'
import ActionBarTransaction from '@/shared/components/ActionBar/ActionBarTransaction'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

const testChannelId = '100'
const videosPerPage = 8
// TODO: No videos screen
// TODO: Unlisted videos
// TODO: Channel dependant drafts
// TODO: video selection / deletion
// TODO: dynamic channels (not hardcoded)
// TODO: context menu callbacks
// TODO: Responsive
// TODO: OnCoverResize support
// TODO: make all this logic into a hook possibly
// TODO: add total video count to the useVideos hook
export const MyVideosView = () => {
  const [selectedVideos, setselectedVideos] = useState<VideoPreviewProps['id'][]>([])
  // const [isActionBarActive, setisActionBarActive] = useState(false)
  const { drafts, getDraft, removeDraft, removeAllDrafts, updateDraft, addDraft } = useDrafts('video')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(0)
  const currentTabName = tabs[currentTab]

  // we need the total video count from somewhere
  const { videosConnection, loading: loadingVideosConnection, error: errorVideosConnection } = useVideosConnection({
    channelId: testChannelId,
  })
  const { loading, videos, error, fetchMore } = useVideos(
    {
      limit: videosPerPage,
      offset: videosPerPage * (currentPage - 1),
      channelId: testChannelId,
    },
    {
      // notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-first',
    }
  )

  // hook to tests draft should be deleted before final
  useEffect(() => {
    const createDrafts = async () => {
      for (let i = 0; i < 8; i++) {
        await addDraft({
          title: Math.random().toString(36),
          description: 'string',
          isPublic: true,
          hasMarketing: false,
          isExplicit: false,
        })
      }
    }
    createDrafts()
    return () => {
      removeAllDrafts()
    }
  }, [addDraft, removeAllDrafts])

  const isLoading = loading || (videos?.length === 0 && (videosConnection?.totalCount ?? 0) > 0)
  const placeholderItems = Array.from({ length: isLoading ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  const videosWPlaceholders = [...(videos || []), ...placeholderItems]
  console.log({
    videosWPlaceholders,
    drafts,
    placeholderItems,
    videos,
    loading,
    isLoading,
    error,
    currentTabName,
    currentPage,
  })

  const handleVideoSelect = (id: string, isSelected: boolean) => {
    if (selectedVideos.includes(id)) {
      setselectedVideos(selectedVideos.filter((_id) => _id !== id))
    } else {
      setselectedVideos([...selectedVideos, id])
    }
  }
  const isActionBarActive = selectedVideos.length > 0
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>
      {currentTabName === 'Drafts' && (
        // Should this really be dismissable?
        <StyledDismissibleMessage
          id="video-draft-saved-locally-warning"
          title={'Video Drafts are saved locally'}
          description={
            'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.'
          }
        />
      )}
      {/* <Grid>
        {videosWPlaceholders
          // this makes for a smoother transition between pages
          .slice(0, videosPerPage)
          .map((video, idx) => (
            <VideoPreview
              key={idx + '-' + currentTabName + '-' + currentPage}
              id={video.id}
              showChannel={false}
              isLoading={loading}
              publisherMode
              isSelected={selectedVideos.includes(video.id)}
              isAnyVideoSelected={selectedVideos.length > 0}
              onSelectClick={(isSelected) => {
                video.id && handleVideoSelect(video.id, isSelected)
              }}
            />
          ))}
      </Grid> */}
      <Grid>
        {drafts
          // this makes for a smoother transition between pages
          // .slice(0, videosPerPage)
          .map((draft, idx) => (
            <VideoPreview
              key={idx + '-' + currentTabName + '-' + currentPage}
              id={draft.id}
              showChannel={false}
              // isLoading={loading}
              publisherMode
              videoPublishState="draft"
              isSelected={selectedVideos.includes(draft.id)}
              isAnyVideoSelected={selectedVideos.length > 0}
              onSelectClick={(isSelected) => {
                draft.id && handleVideoSelect(draft.id, isSelected)
              }}
              onDeleteVideoClick={() => {
                removeDraft(draft.id)
              }}
            />
          ))}
      </Grid>
      <PaginationContainer extraPaddingBottom={isActionBarActive}>
        <Pagination
          onChangePage={(page) => {
            setCurrentPage(page)
          }}
          onMouseEnterPage={(page) => {
            fetchMore({
              variables: {
                // substract 1 coz offset index starts at 0
                offset: videosPerPage * (page - 1),
                limit: videosPerPage,
              },
            })
          }}
          page={currentPage}
          itemsPerPage={videosPerPage}
          totalCount={videosConnection?.totalCount}
        ></Pagination>
      </PaginationContainer>
      {/* TODO: adjust this to the real fee */}
      {/* TODO: also this bar needs quite a bit of adjustments */}
      {isActionBarActive && <ActionBarTransaction fee={currentTabName === 'Drafts' ? 0 : 0.2} />}
    </ViewContainer>
  )
}

export default MyVideosView

const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};
`

type PaginationContainerProps = { extraPaddingBottom?: boolean }
const PaginationContainer = styled.div<PaginationContainerProps>`
  padding-top: ${sizes(6)};
  padding-bottom: ${({ extraPaddingBottom }) => (extraPaddingBottom ? sizes(24) : sizes(16))};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledDismissibleMessage = styled(DismissibleMessage)`
  margin-bottom: ${sizes(8)};
`
