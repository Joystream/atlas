import React, { useEffect, useState } from 'react'
import { useVideosOffsetLimitPagination } from '@/api/hooks'
import { useDrafts } from '@/hooks'
import { VideoPreviewPublisher } from '@/components'
import { Grid, Pagination, Tabs } from '@/shared/components'

import {
  PaginationContainer,
  StyledDismissibleMessage,
  StyledText,
  TabsContainer,
  VideosContainer,
  ViewContainer,
} from './MyVideos.styles'
import { AddVideo, AddVideoView } from './AddVideoView'

const testChannelId = 'a49fc01c-d369-44d2-b272-bcf0b0d26a5e' // mocking test channel id
// const testChannelId = '100' // staging test channel id
const TABS = ['All Videos', 'Published', 'Drafts', 'Unlisted'] as const
const INITIAL_VIDEOS_PER_ROW = 4
// not yet doable
// TODO: on edit video callbacks
// TODO: on delete video callbacks
// TODO: dynamic channels (not hardcoded)
export const MyVideosView = () => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [hasAnyVideos, sethasAnyVideos] = useState<boolean>()
  // Drafts calls can run into race conditions
  const { drafts, removeDraft, removeAllDrafts, addDraft } = useDrafts('video', testChannelId)
  const [currentTab, setCurrentTab] = useState(0)
  const { currentPage, setCurrentPage } = usePagination(currentTab)
  const videosPerPage = 2 * videosPerRow
  const currentTabName = TABS[currentTab]
  const isPublic_eq = getPublicness(currentTabName)
  const { loading, videos, error, totalCount, fetchMore } = useVideosOffsetLimitPagination(
    {
      limit: videosPerPage,
      offset: videosPerPage * (currentPage - 1),
      where: {
        channelId_eq: testChannelId,
        isPublic_eq,
      },
    },
    {
      // notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first',
    }
  )

  useEffect(() => {
    if (typeof totalCount === 'number' && totalCount > 0) {
      sethasAnyVideos(true)
    } else if (typeof totalCount === 'number' && hasAnyVideos === undefined) {
      sethasAnyVideos(false)
    }
  }, [hasAnyVideos, totalCount])

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

  const FetchMoreVideos = (page: number) =>
    fetchMore({
      variables: {
        // substract 1 coz offset index starts at 0
        offset: videosPerPage * (page - 1),
        limit: videosPerPage,
      },
    })
  // console.log({ videos, totalCount, hasAnyVideos, isLoading, isPublic_eq })
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>

      {hasAnyVideos === false ? (
        <AddVideoView />
      ) : (
        <>
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
          <Grid maxColumns={null} onResize={handleOnResizeGrid}>
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
          {/* {((isDraftTab && drafts.length === 0) || (!isDraftTab && totalCount === 0 && !isLoading)) && <AddVideo />} */}
          <PaginationContainer>
            <Pagination
              onChangePage={(page) => {
                setCurrentPage(page)
                currentTabName !== 'Drafts' && FetchMoreVideos(page)
              }}
              onMouseEnterPage={(page) => {
                currentTabName !== 'Drafts' && FetchMoreVideos(page)
              }}
              page={currentPage}
              itemsPerPage={videosPerPage}
              totalCount={isDraftTab ? drafts.length : totalCount}
            ></Pagination>
          </PaginationContainer>
        </>
      )}
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
