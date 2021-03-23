import React, { useEffect, useState } from 'react'
import { useVideosPage } from '@/api/hooks'
import { useDrafts } from '@/hooks'
import { StudioContainer, VideoPreviewPublisher } from '@/components'
import { Grid, Pagination, Tabs, Text } from '@/shared/components'

import { PaginationContainer, StyledDismissibleMessage, TabsContainer, ViewContainer } from './MyVideos.styles'
import { EmptyVideos, EmptyVideosView } from './EmptyVideosView'

// const testChannelId = 'a49fc01c-d369-44d2-b272-bcf0b0d26a5e' // mocking test channel id
const testChannelId = '100' // staging test channel id
const TABS = ['All Videos', 'Published', 'Drafts', 'Unlisted'] as const
const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
// not yet doable
// TODO: on edit video callbacks
// TODO: on delete video callbacks
// TODO: dynamic channels (not hardcoded)
export const MyVideosView = () => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  // Drafts calls can run into race conditions
  const { drafts, removeDraft, removeAllDrafts, addDraft } = useDrafts('video', testChannelId)
  const [currentTab, setCurrentTab] = useState(0)
  const { currentPage, setCurrentPage } = usePagination(currentTab)
  const videosPerPage = ROWS_AMOUNT * videosPerRow
  const currentTabName = TABS[currentTab]
  const isPublic_eq = getPublicness(currentTabName)
  const { loading, videos, totalCount, fetchMore } = useVideosPage({
    limit: videosPerPage,
    offset: videosPerPage * currentPage,
    where: {
      channelId_eq: testChannelId,
      isPublic_eq,
    },
  })

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
  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const hasNoVideos = currentTabName === 'All Videos' && totalCount === 0 && drafts.length === 0

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
    !isDraftTab &&
      fetchMore({
        variables: {
          offset: videosPerPage * page,
          limit: videosPerPage,
        },
      })
  }

  const gridContent = (
    <>
      {isDraftTab
        ? drafts
            // pagination slice
            .slice(videosPerPage * currentPage, currentPage * videosPerPage + videosPerPage)
            .map((draft, idx) => (
              <VideoPreviewPublisher
                key={idx}
                id={draft.id}
                showChannel={false}
                isDraft
                isPullupDisabled={false}
                onEditVideoClick={() => ({})}
                onDeleteVideoClick={() => {
                  removeDraft(draft.id)
                }}
              />
            ))
        : videosWithPlaceholders.map((video, idx) => (
            <VideoPreviewPublisher key={idx} id={video.id} showChannel={false} isPullupDisabled={false} />
          ))}
    </>
  )

  return (
    <StudioContainer>
      <ViewContainer>
        <Text variant="h2">My Videos</Text>
        {hasNoVideos ? (
          <EmptyVideosView />
        ) : (
          <>
            <TabsContainer>
              <Tabs initialIndex={0} tabs={[...TABS]} onSelectTab={setCurrentTab} />
            </TabsContainer>
            {isDraftTab && (
              <StyledDismissibleMessage
                id="video-draft-saved-locally-warning"
                title={'Video Drafts are saved locally'}
                description={
                  'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.'
                }
              />
            )}
            <Grid maxColumns={null} onResize={handleOnResizeGrid}>
              {gridContent}
            </Grid>
            {((isDraftTab && drafts.length === 0) || (!isDraftTab && totalCount === 0 && !isLoading)) && (
              <EmptyVideos />
            )}
            <PaginationContainer>
              <Pagination
                onChangePage={handleChangePage}
                page={currentPage}
                itemsPerPage={videosPerPage}
                totalCount={isDraftTab ? drafts.length : totalCount}
              />
            </PaginationContainer>
          </>
        )}
      </ViewContainer>
    </StudioContainer>
  )
}

export default MyVideosView

const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(0)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(0)
  }, [currentTab])
  return { currentPage, setCurrentPage }
}

const getPublicness = (currentTabName: typeof TABS[number]) => {
  switch (currentTabName) {
    case 'Published':
      return true
    case 'Unlisted':
      return false
    case 'All Videos':
    default:
      return undefined
  }
}
