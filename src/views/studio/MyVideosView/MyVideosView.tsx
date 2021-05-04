import { useVideos } from '@/api/hooks'
import { MessageDialog, StudioContainer, TransactionDialog, VideoPreviewPublisher } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { useAuthorizedUser, useDeleteVideo, useDrafts, useEditVideoSheet, useSnackbar } from '@/hooks'
import { Grid, Pagination, Tabs, Text } from '@/shared/components'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyVideos, EmptyVideosView } from './EmptyVideosView'
import { PaginationContainer, StyledDismissibleMessage, TabsContainer, ViewContainer } from './MyVideos.styles'
import { removeVideoFromCache } from '@/utils/cachingAssets'

const TABS = ['All Videos', 'Published', 'Drafts', 'Unlisted'] as const
const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4

export const MyVideosView = () => {
  const navigate = useNavigate()
  const { setSheetState, videoTabs, addVideoTab, removeVideoTab } = useEditVideoSheet()
  const { displaySnackbar } = useSnackbar()
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [currentTab, setCurrentTab] = useState(0)
  const [draftToRemove, setDraftToRemove] = useState<string | null>(null)
  const videosPerPage = ROWS_AMOUNT * videosPerRow
  const currentTabName = TABS[currentTab]
  const isDraftTab = currentTabName === 'Drafts'
  const isPublic_eq = getPublicness(currentTabName)
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>()

  // Drafts calls can run into race conditions
  const { currentPage, setCurrentPage } = usePagination(currentTab)
  const { activeChannelId } = useAuthorizedUser()
  const { drafts, removeDraft, unseenDrafts, removeAllUnseenDrafts } = useDrafts('video', activeChannelId)

  const { loading, videos, totalCount, error, fetchMore, refetchCount: refetchVideosCount, client } = useVideos(
    {
      limit: videosPerPage,
      offset: videosPerPage * currentPage,
      where: {
        channelId_eq: activeChannelId,
        isPublic_eq,
      },
    },
    { notifyOnNetworkStatusChange: true }
  )

  const {
    closeVideoDeleteDialog,
    closeDeleteTransactionDialog,
    confirmDeleteVideo,
    openVideoDeleteDialog,
    deleteTransactionStatus,
    isDeleteDialogOpen,
  } = useDeleteVideo()

  useEffect(() => {
    if (!fetchMore || !videos || loading || !totalCount || isDraftTab) {
      return
    }

    const currentOffset = currentPage * videosPerPage
    const targetDisplayedCount = Math.min(videosPerPage, totalCount - currentOffset)
    if (videos.length < targetDisplayedCount) {
      const missingCount = videosPerPage - videos.length
      fetchMore({
        variables: {
          offset: currentOffset + videos.length,
          limit: missingCount,
        },
      })
    }
  }, [currentPage, fetchMore, loading, videos, videosPerPage, totalCount, isDraftTab])

  const placeholderItems = Array.from({ length: loading ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const hasNoVideos = currentTabName === 'All Videos' && totalCount === 0 && drafts.length === 0

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  const handleSetCurrentTab = async (tab: number) => {
    setCurrentTab(tab)
    if (TABS[tab] === 'Drafts') {
      if (unseenDrafts.length > 0) {
        await removeAllUnseenDrafts(activeChannelId)
      }
    }
  }

  type HandleVideoClickOpts = {
    draft?: boolean
    minimized?: boolean
  }
  const handleVideoClick = (id?: string, opts: HandleVideoClickOpts = { draft: false, minimized: false }) => {
    if (!id) {
      return
    }
    addVideoTab({ id, isDraft: opts.draft })
    if (opts.minimized) {
      setSheetState('minimized')
    } else {
      navigate(absoluteRoutes.studio.editVideo())
    }
  }

  const handleVideoDeleted = async () => {
    if (!selectedVideoId) {
      return
    }
    setSelectedVideoId(undefined)

    await refetchVideosCount()
    removeVideoFromCache(selectedVideoId, client)
    closeDeleteTransactionDialog()
  }

  const confirmRemoveDraft = (id: string) => {
    removeDraft(id)
    displaySnackbar({
      title: 'Draft successfully deleted',
      iconType: 'success',
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
                isPullupDisabled={!!videoTabs.find((t) => t.id === draft.id)}
                onClick={() => handleVideoClick(draft.id, { draft: true })}
                onPullupClick={(e) => {
                  e.stopPropagation()
                  handleVideoClick(draft.id, { draft: true, minimized: true })
                  const index = videoTabs.findIndex((item) => item.id === draft.id)
                  displaySnackbar({
                    title: 'Video opened in new tab',
                    iconType: 'success',
                    actionText: 'Remove',
                    onActionClick: () => removeVideoTab(index),
                  })
                }}
                onEditVideoClick={() => handleVideoClick(draft.id, { draft: true })}
                onDeleteVideoClick={() => setDraftToRemove(draft.id)}
              />
            ))
        : videosWithPlaceholders.map((video, idx) => (
            <VideoPreviewPublisher
              key={idx}
              id={video.id}
              showChannel={false}
              isPullupDisabled={!!videoTabs.find((t) => t.id === video.id)}
              onClick={() => handleVideoClick(video.id)}
              onPullupClick={(e) => {
                e.stopPropagation()
                handleVideoClick(video.id, { minimized: true })
              }}
              onEditVideoClick={() => handleVideoClick(video.id)}
              onDeleteVideoClick={() => {
                openVideoDeleteDialog()
                setSelectedVideoId(video.id)
              }}
            />
          ))}
      <MessageDialog
        title="Delete this video?"
        exitButton={false}
        description="You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets."
        showDialog={isDeleteDialogOpen}
        onSecondaryButtonClick={closeVideoDeleteDialog}
        onPrimaryButtonClick={() => confirmDeleteVideo(selectedVideoId)}
        error
        variant="warning"
        primaryButtonText="Delete video"
        secondaryButtonText="Cancel"
      />
      <TransactionDialog
        status={deleteTransactionStatus}
        successTitle="Video successfully deleted!"
        successDescription="Your video was marked as deleted and it will no longer show up on Joystream."
        onClose={handleVideoDeleted}
      />
      <MessageDialog
        title="Do you want to remove this draft from your drafts?"
        description="Draft will be removed permanently and all its data will be lost. Drafts are stored locally - that’s why you don’t need to make a transaction to confirm it."
        variant="warning"
        showDialog={drafts.some((item) => item.id === draftToRemove)}
        error
        primaryButtonText="Remove draft"
        secondaryButtonText="Cancel"
        onPrimaryButtonClick={() => draftToRemove && confirmRemoveDraft(draftToRemove)}
        onSecondaryButtonClick={() => setDraftToRemove(null)}
      />
    </>
  )

  if (error) {
    throw error
  }

  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: tab === 'Drafts' ? unseenDrafts.length : 0 }))

  return (
    <StudioContainer>
      <ViewContainer>
        <Text variant="h2">My videos</Text>
        {hasNoVideos ? (
          <EmptyVideosView />
        ) : (
          <>
            <TabsContainer>
              <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={handleSetCurrentTab} />
            </TabsContainer>
            {isDraftTab && (
              <StyledDismissibleMessage
                id="video-draft-saved-locally-warning"
                title="Video drafts are saved locally"
                description="You will only be able to access drafts on the device you used to create them. Clearing your browser history will delete all your drafts."
              />
            )}
            <Grid maxColumns={null} onResize={handleOnResizeGrid}>
              {gridContent}
            </Grid>
            {((isDraftTab && drafts.length === 0) || (!isDraftTab && totalCount === 0 && !loading)) && <EmptyVideos />}
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
