import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useVideosConnection } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { VideoTilePublisher } from '@/components/VideoTile'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { absoluteRoutes } from '@/config/routes'
import { SORT_OPTIONS } from '@/config/sorting'
import { useDeleteVideo } from '@/hooks'
import { useDialog } from '@/providers/dialogs'
import { chanelUnseenDraftsSelector, channelDraftsSelector, useDraftStore } from '@/providers/drafts'
import { useEditVideoSheet } from '@/providers/editVideoSheet'
import { useSnackbar } from '@/providers/snackbars'
import { useAuthorizedUser } from '@/providers/user'
import { Button } from '@/shared/components/Button'
import { EmptyFallback } from '@/shared/components/EmptyFallback'
import { Grid } from '@/shared/components/Grid'
import { Pagination } from '@/shared/components/Pagination'
import { Select } from '@/shared/components/Select'
import { Tabs } from '@/shared/components/Tabs'
import { Text } from '@/shared/components/Text'
import { SvgGlyphUpload } from '@/shared/icons'
import { SentryLogger } from '@/utils/logs'

import {
  PaginationContainer,
  SortContainer,
  StyledDismissibleBanner,
  TabsContainer,
  ViewContainer,
} from './MyVideos.styles'
import { NewVideoTile } from './NewVideoTile'

const TABS = ['All Videos', 'Public', 'Drafts', 'Unlisted'] as const

const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
const INITIAL_FIRST = 50
const OPEN_TAB_SNACKBAR = 'OPEN_TAB_SNACKBAR'
const REMOVE_DRAFT_SNACKBAR = 'REMOVE_DRAFT_SNACKBAR'
const SNACKBAR_TIMEOUT = 5000

export const MyVideosView = () => {
  const navigate = useNavigate()
  const { setSheetState, videoTabs, addVideoTab, setSelectedVideoTabIdx, removeVideoTab } = useEditVideoSheet()
  const { displaySnackbar, updateSnackbar } = useSnackbar()
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [tabIdToRemoveViaSnackbar, setTabIdToRemoveViaSnackbar] = useState<string>()
  const videosPerPage = ROWS_AMOUNT * videosPerRow

  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const currentTabName = TABS[currentVideosTab]
  const isDraftTab = currentTabName === 'Drafts'
  const isPublic_eq = getPublicness(currentTabName)

  const removeDraftNotificationsCount = useRef(0)
  const addToTabNotificationsCount = useRef(0)

  const { currentPage, setCurrentPage } = usePagination(currentVideosTab)
  const { activeChannelId } = useAuthorizedUser()
  const { removeDrafts, markAllDraftsAsSeenForChannel } = useDraftStore(({ actions }) => actions)
  const unseenDrafts = useDraftStore(chanelUnseenDraftsSelector(activeChannelId))
  const _drafts = useDraftStore(channelDraftsSelector(activeChannelId))

  const drafts = [
    ...(_drafts.length ? ['new-video-tile' as const] : []),
    ...(sortVideosBy === VideoOrderByInput.CreatedAtAsc
      ? _drafts.slice()?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      : _drafts.slice()?.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())),
  ]

  const { edges, totalCount, loading, error, fetchMore, refetch, variables, pageInfo } = useVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channelId_eq: activeChannelId,
        isPublic_eq,
      },
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'MyVideosView', error),
    }
  )
  const [openDeleteDraftDialog, closeDeleteDraftDialog] = useDialog()
  const deleteVideo = useDeleteVideo()

  const videos = [...(edges?.length ? ['new-video-tile' as const, ...edges] : [])]
    ?.map((edge) => (edge === 'new-video-tile' ? edge : edge.node))
    .slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)
  const placeholderItems = Array.from({ length: loading ? videosPerPage - (videos ? videos.length : 0) : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))

  const videosWithSkeletonLoaders = [...(videos || []), ...placeholderItems]
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
        markAllDraftsAsSeenForChannel(activeChannelId ?? '')
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
      addToTabNotificationsCount.current++
      if (addToTabNotificationsCount.current > 1) {
        updateSnackbar(OPEN_TAB_SNACKBAR, { title: `${addToTabNotificationsCount.current} videos opened in a new tab` })
      } else {
        displaySnackbar({
          customId: OPEN_TAB_SNACKBAR,
          title: 'Video opened in a new tab',
          iconType: 'success',
          actionText: 'Undo',
          timeout: SNACKBAR_TIMEOUT,
          onActionClick: () => setTabIdToRemoveViaSnackbar(id),
          onExit: () => (addToTabNotificationsCount.current = 0),
        })
      }

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
      primaryButton: {
        text: 'Remove draft',
        onClick: () => {
          closeDeleteDraftDialog()
          removeDrafts([draftId])
          removeDraftNotificationsCount.current++
          if (removeDraftNotificationsCount.current > 1) {
            updateSnackbar(REMOVE_DRAFT_SNACKBAR, { title: `${removeDraftNotificationsCount.current} drafts deleted` })
          } else {
            displaySnackbar({
              customId: REMOVE_DRAFT_SNACKBAR,
              title: 'Draft deleted',
              iconType: 'success',
              timeout: SNACKBAR_TIMEOUT,
              onExit: () => (removeDraftNotificationsCount.current = 0),
            })
          }
        },
      },
      secondaryButton: {
        text: 'Cancel',
        onClick: () => {
          closeDeleteDraftDialog()
        },
      },
      onExitClick: () => {
        closeDeleteDraftDialog()
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
        .map((draft, idx) => {
          if (draft === 'new-video-tile') {
            return <NewVideoTile loading={loading} key={idx} />
          }
          return (
            <VideoTilePublisher
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
          )
        })
    : videosWithSkeletonLoaders.map((video, idx) => {
        if (video === 'new-video-tile') {
          return <NewVideoTile loading={loading} key={idx} />
        }
        return (
          <VideoTilePublisher
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
        )
      })

  if (error) {
    return <ViewErrorFallback />
  }

  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: tab === 'Drafts' ? unseenDrafts.length : 0 }))
  return (
    <LimitedWidthContainer>
      <ViewContainer>
        <Text variant="h2">My videos</Text>
        {hasNoVideos ? (
          <EmptyFallback
            title="Add your first video"
            subtitle="No videos uploaded yet. Start publishing by adding your first video to Joystream."
            button={
              <Button icon={<SvgGlyphUpload />} to={absoluteRoutes.studio.editVideo()} variant="secondary" size="large">
                Upload video
              </Button>
            }
          />
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
              <StyledDismissibleBanner
                id="video-draft-saved-locally-warning"
                title="Video drafts are saved locally"
                icon="info"
                description="You will only be able to access drafts on the device you used to create them. Clearing your browser history will delete all your drafts."
              />
            )}
            {currentTabName === 'Unlisted' && (
              <StyledDismissibleBanner
                id="unlisted-video-link-info"
                title="Unlisted videos can be seen only with direct link"
                icon="info"
                description="You can share a private video with others by sharing a direct link to it. Unlisted video is not going to be searchable on our platform."
              />
            )}
            <Grid maxColumns={null} onResize={handleOnResizeGrid}>
              {gridContent}
            </Grid>
            {((isDraftTab && drafts.length === 0) ||
              (!isDraftTab && !loading && totalCount === 0 && (!videos || videos.length === 0))) && (
              <EmptyFallback
                title={
                  currentTabName === 'All Videos'
                    ? 'No videos yet'
                    : currentTabName === 'Public'
                    ? 'No public videos yet'
                    : currentTabName === 'Drafts'
                    ? 'No drafts here yet'
                    : 'No unlisted videos here yet'
                }
                subtitle={
                  currentTabName === 'All Videos'
                    ? null
                    : currentTabName === 'Public'
                    ? 'Videos published with "Public" privacy setting will show up here.'
                    : currentTabName === 'Drafts'
                    ? "Each video that hasn't been published yet will be available here as a draft."
                    : 'Videos published with "Unlisted" privacy setting will show up here.'
                }
                button={
                  <Button
                    icon={<SvgGlyphUpload />}
                    to={absoluteRoutes.studio.editVideo()}
                    variant="secondary"
                    size="large"
                  >
                    Upload video
                  </Button>
                }
              />
            )}
            <PaginationContainer>
              <Pagination
                onChangePage={handleChangePage}
                page={currentPage}
                itemsPerPage={videosPerPage}
                // +1 is for new video tile
                totalCount={isDraftTab ? drafts.length : (totalCount || 0) + 1}
              />
            </PaginationContainer>
          </>
        )}
      </ViewContainer>
    </LimitedWidthContainer>
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
