import React, { useEffect, useState } from 'react'
import { useVideos } from '@/api/hooks'
import { VideoPreviewPublisher } from '@/components'
import { useDrafts } from '@/hooks'
import { Grid, Pagination, Tabs } from '@/shared/components'

import {
  PaginationContainer,
  StyledDismissibleMessage,
  StyledText,
  TabsContainer,
  VideosContainer,
  ViewContainer,
} from './MyVideos.styles'
import { AddVideoView } from './AddVideoView'

const testChannelId = '100' // staging test channel id
const TABS = ['All Videos', 'Published', 'Drafts', 'Unlisted'] as const
const INITIAL_VIDEOS_PER_ROW = 5
// not yet doable
// TODO: adjust action bar to the real fee
// TODO: Unlisted videos
// TODO: on edit video callbacks
// TODO: on delete video callbacks
// TODO: dynamic channels (not hardcoded)
// TODO: No videos screen (this was deleted from figma?)
// doable
// TODO: how is the action bar supossed to work?
export const MyVideosView = () => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  // Drafts calls can run into race conditions
  const { drafts, removeDraft, removeAllDrafts, addDraft } = useDrafts('video', testChannelId)
  const [currentTab, setCurrentTab] = useState(0)
  const { currentPage, setCurrentPage } = usePagination(currentTab)
  const videosPerPage = 2 * videosPerRow
  const currentTabName = TABS[currentTab]
  const { loading, videos, error, totalCount, fetchMore } = useVideos(
    {
      limit: videosPerPage,
      offset: videosPerPage * (currentPage - 1),
      where: {
        channelId_eq: testChannelId,
        isPublic_eq: currentTabName !== 'Unlisted',
      },
    },
    {
      // notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first',
    }
  )

  // hook to tests draft should be deleted before final
  useEffect(() => {
    const createDrafts = async () => {
      await removeAllDrafts()
      for (let i = 0; i < 32; i++) {
        await addDraft({
          channelId: testChannelId,
          title: i.toString(),
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
  }, [])

  const isDraftTab = currentTabName === 'Drafts'
  const isLoading = loading || (videos?.length === 0 && (totalCount ?? 0) > 0)
  const placeholderItems = Array.from({ length: isLoading ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  const videosWPlaceholders = [...(videos || []), ...placeholderItems]
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={[...TABS]} onSelectTab={setCurrentTab} />
      </TabsContainer>
      {isDraftTab && (
        // Should this really be dismissable?
        <StyledDismissibleMessage
          id="video-draft-saved-locally-warning"
          title={'Video Drafts are saved locally'}
          description={
            'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.'
          }
        />
      )}
      <VideosContainer>
        <Grid onResize={handleOnResizeGrid}>
          {!isDraftTab &&
            videosWPlaceholders
              // this makes for a smoother transition between pages
              .slice(0, videosPerPage)
              .map((video, idx) => (
                <VideoPreviewPublisher
                  key={idx + '-' + currentTabName + '-' + currentPage}
                  id={video.id}
                  showChannel={false}
                  isLoading={loading}
                />
              ))}
          {isDraftTab &&
            drafts
              // pagination slice
              .slice(videosPerPage * (currentPage - 1), (currentPage - 1) * videosPerPage + videosPerPage)
              .map((draft, idx) => (
                <VideoPreviewPublisher
                  key={idx + '-' + currentTabName + '-' + currentPage}
                  id={draft.id}
                  showChannel={false}
                  isDraft
                  onEditVideoClick={() => ({})}
                  onDeleteVideoClick={() => {
                    removeDraft(draft.id)
                  }}
                />
              ))}
        </Grid>
        {((isDraftTab && drafts.length === 0) || (!isDraftTab && totalCount === 0)) && <AddVideoView />}
      </VideosContainer>
      <PaginationContainer>
        <Pagination
          onChangePage={(page) => {
            setCurrentPage(page)
          }}
          onMouseEnterPage={(page) => {
            currentTabName !== 'Drafts' &&
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
          totalCount={isDraftTab ? drafts.length : totalCount}
        ></Pagination>
      </PaginationContainer>
    </ViewContainer>
  )
}

export default MyVideosView

const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(1)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(1)
  }, [currentTab])
  return { currentPage, setCurrentPage }
}
