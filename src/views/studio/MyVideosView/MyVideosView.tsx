import { useVideosConnection } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { StudioContainer, VideoPreviewPublisher } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { useAuthorizedUser, useDeleteVideo, useDialog, useDrafts, useEditVideoSheet, useSnackbar } from '@/hooks'
import { Grid, Pagination, Select, Tabs, Text } from '@/shared/components'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyVideos, EmptyVideosView } from './EmptyVideosView'
import {
  PaginationContainer,
  SortContainer,
  StyledDismissibleMessage,
  TabsContainer,
  ViewContainer,
} from './MyVideos.styles'

const TABS = ['All Videos', 'Public', 'Drafts', 'Unlisted'] as const
const SORT_OPTIONS = [
  { name: 'Newest first', value: VideoOrderByInput.CreatedAtAsc },
  { name: 'Oldest first', value: VideoOrderByInput.CreatedAtDesc },
]

const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
const INITIAL_FIRST = 50

export const MyVideosView = () => {
  const navigate = useNavigate()
  const { setSheetState, videoTabs, addVideoTab, setSelectedVideoTabIdx, removeVideoTab } = useEditVideoSheet()
  const { displaySnackbar } = useSnackbar()
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [sortVideosBy, setSortVideosBy] = useState<typeof SORT_OPTIONS[number]['value'] | undefined>(
    VideoOrderByInput.CreatedAtAsc
  )
  const [tabIdToRemoveViaSnackbar, setTabIdToRemoveViaSnackbar] = useState<string>()
  const videosPerPage = ROWS_AMOUNT * videosPerRow

  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const currentTabName = TABS[currentVideosTab]
  const isDraftTab = currentTabName === 'Drafts'
  const isPublic_eq = getPublicness(currentTabName)

  // Drafts calls can run into race conditions
  const { currentPage, setCurrentPage } = usePagination(currentVideosTab)
  const { activeChannelId } = useAuthorizedUser()
  const { drafts: _drafts, removeDraft, unseenDrafts, removeAllUnseenDrafts } = useDrafts('video', activeChannelId)
  const drafts =
    sortVideosBy === VideoOrderByInput.CreatedAtAsc
      ? _drafts.slice()?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      : _drafts.slice()?.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())

  const { edges, totalCount, loading, error, fetchMore, refetch, variables, pageInfo } = useVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channelId_eq: activeChannelId,
        isPublic_eq,
      },
    },
    { notifyOnNetworkStatusChange: true }
  )
  const [openDeleteDraftDialog, closeDeleteDraftDialog] = useDialog()
  const deleteVideo = useDeleteVideo()

  const videos = edges
    ?.map((edge) => edge.node)
    .slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)
  const placeholderItems = Array.from({ length: loading ? videosPerPage - (videos ? videos.length : 0) : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))

  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]
  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const hasNoVideos = currentTabName === 'All Videos' && totalCount === 0 && drafts.length === 0

  useEffect(() => {
    if (!fetchMore || !edges?.length || !totalCount) {
      return
    }
    if (totalCount <= edges.length) {
      return
    }

    if (currentPage * videosPerPage + videosPerPage > edges.length) {
      fetchMore({
        variables: { ...variables, after: pageInfo?.endCursor },
      })
    }
  }, [currentPage, edges, fetchMore, pageInfo, totalCount, variables, videosPerPage])

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  const handleSetCurrentTab = async (tab: number) => {
    setCurrentVideosTab(tab)
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
      displaySnackbar({
        title: 'Video opened in a new tab',
        iconType: 'success',
        actionText: 'Undo',
        onActionClick: () => setTabIdToRemoveViaSnackbar(id),
      })
      setSheetState('minimized')
    } else {
      const tabIdx = videoTabs.findIndex((t) => t.id === id)
      if (tabIdx >= 0) setSelectedVideoTabIdx(tabIdx)
      navigate(absoluteRoutes.studio.editVideo())
    }
  }

  // Workaround for removing drafts from video sheet tabs via snackbar
  // Snackbar will probably need a refactor to handle actions that change state
  useEffect(() => {
    if (tabIdToRemoveViaSnackbar !== undefined) {
      const tab = videoTabs.find((tab) => tab.id === tabIdToRemoveViaSnackbar)
      if (!tab) {
        return
      }
      const idx = videoTabs.indexOf(tab)
      removeVideoTab(idx)
      setTabIdToRemoveViaSnackbar(undefined)
    }
  }, [removeVideoTab, tabIdToRemoveViaSnackbar, videoTabs])

  const handleDeleteDraft = (draftId: string) => {
    openDeleteDraftDialog({
      title: 'Delete this draft?',
      description: 'You will not be able to undo this.',
      variant: 'warning',
      error: true,
      primaryButtonText: 'Remove draft',
      secondaryButtonText: 'Cancel',
      onExitClick: () => {
        closeDeleteDraftDialog()
      },
      onSecondaryButtonClick: () => {
        closeDeleteDraftDialog()
      },
      onPrimaryButtonClick: () => {
        closeDeleteDraftDialog()
        removeDraft(draftId)
        displaySnackbar({
          title: 'Draft deleted',
          iconType: 'success',
        })
      },
    })
  }

  const handleSorting = (value?: VideoOrderByInput | null | undefined) => {
    if (value) {
      setSortVideosBy(value)
      refetch({ orderBy: value })
    }
  }

  const gridContent = isDraftTab
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
            }}
            onEditVideoClick={() => handleVideoClick(draft.id, { draft: true })}
            onDeleteVideoClick={() => handleDeleteDraft(draft.id)}
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
          onDeleteVideoClick={() => video.id && deleteVideo(video.id)}
        />
      ))

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
              <SortContainer>
                <Text variant="body2">Sort by</Text>
                <Select helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
              </SortContainer>
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
            {((isDraftTab && drafts.length === 0) ||
              (!isDraftTab && !loading && totalCount === 0 && (!videos || videos.length === 0))) && (
              <EmptyVideos
                text={
                  currentTabName === 'All Videos'
                    ? "You don't have any published videos at the moment"
                    : currentTabName === 'Public'
                    ? "You don't have any public videos at the moment"
                    : currentTabName === 'Drafts'
                    ? "You don't have any drafts at the moment"
                    : "You don't have any unlisted videos at the moment"
                }
              />
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
    case 'Public':
      return true
    case 'Unlisted':
      return false
    case 'All Videos':
    default:
      return undefined
  }
}
