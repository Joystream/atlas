import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFullVideosConnection } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionAddVideo, SvgActionUpload, SvgAlertsInformative24 } from '@/components/_icons'
import { Select } from '@/components/_inputs/Select'
import { VideoTileDraft } from '@/components/_video/VideoTileDraft'
import { VideoTilePublisher } from '@/components/_video/VideoTilePublisher'
import { absoluteRoutes } from '@/config/routes'
import { VIDEO_SORT_OPTIONS } from '@/config/sorting'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { chanelUnseenDraftsSelector, channelDraftsSelector, useDraftStore } from '@/providers/drafts'
import { useSnackbar } from '@/providers/snackbars'
import { useAuthorizedUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { sizes } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import {
  MobileButton,
  StyledBanner,
  StyledGrid,
  StyledPagination,
  StyledSelect,
  StyledText,
  TabsContainer,
} from './MyVideos.styles'
import { NewVideoTile } from './NewVideoTile'

const TABS = ['All videos', 'Public', 'Drafts', 'Unlisted'] as const

const INITIAL_VIDEOS_PER_ROW = 4
const ROWS_AMOUNT = 4
const INITIAL_FIRST = 50
const OPEN_TAB_SNACKBAR = 'OPEN_TAB_SNACKBAR'
const REMOVE_DRAFT_SNACKBAR = 'REMOVE_DRAFT_SNACKBAR'
const SNACKBAR_TIMEOUT = 5000

export const MyVideosView = () => {
  const headTags = useHeadTags('My videos')
  const navigate = useNavigate()
  const { editedVideoInfo, setEditedVideo } = useVideoWorkspace()
  const { displaySnackbar, updateSnackbar } = useSnackbar()
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const videosPerPage = ROWS_AMOUNT * videosPerRow
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')

  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const currentTabName = TABS[currentVideosTab]
  const isDraftTab = currentTabName === 'Drafts'
  const isAllVideosTab = currentTabName === 'All videos'
  const isPublicTab = currentTabName === 'Public'
  const isUnlistedTab = currentTabName === 'Unlisted'
  const isPublic_eq = isPublicTab ? true : isUnlistedTab ? false : undefined

  const removeDraftNotificationsCount = useRef(0)
  const addToTabNotificationsCount = useRef(0)

  const { currentPage, setCurrentPage } = usePagination(currentVideosTab)
  const { channelId } = useAuthorizedUser()
  const { removeDrafts, markAllDraftsAsSeenForChannel } = useDraftStore(({ actions }) => actions)
  const unseenDrafts = useDraftStore(chanelUnseenDraftsSelector(channelId))
  const _drafts = useDraftStore(channelDraftsSelector(channelId))

  const drafts = [
    ...(_drafts.length ? ['new-video-tile' as const] : []),
    ...(sortVideosBy === VideoOrderByInput.CreatedAtDesc
      ? _drafts.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      : _drafts.slice().sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())),
  ]

  const { edges, totalCount, loading, error, fetchMore, refetch, variables, pageInfo } = useFullVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channel: {
          id_eq: channelId,
        },
        isPublic_eq,
      },
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'MyVideosView', error),
    }
  )
  const [openDeleteDraftDialog, closeDeleteDraftDialog] = useConfirmationModal()
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
  const hasNoVideos = isAllVideosTab && totalCount === 0 && drafts.length === 0

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
        markAllDraftsAsSeenForChannel(channelId ?? '')
      }
    }
  }

  const handleAddVideoTab = useCallback(() => setEditedVideo(), [setEditedVideo])

  type HandleVideoClickOpts = {
    draft?: boolean
    minimized?: boolean
    mintNft?: boolean
  }
  const handleVideoClick = (
    id?: string,
    opts: HandleVideoClickOpts = { draft: false, minimized: false, mintNft: false }
  ) => {
    if (!id) {
      return
    }
    setEditedVideo({ id, isNew: false, isDraft: opts.draft, mintNft: opts.mintNft })
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
          onExit: () => (addToTabNotificationsCount.current = 0),
        })
      }
    } else {
      if (editedVideoInfo) navigate(absoluteRoutes.studio.videoWorkspace())
    }
  }

  const handleDeleteDraft = (draftId: string) => {
    openDeleteDraftDialog({
      title: 'Delete this draft?',
      description: 'You will not be able to undo this.',
      type: 'warning',
      primaryButton: {
        text: 'Remove draft',
        variant: 'destructive',
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
            return <NewVideoTile loading={loading} key={`$draft-${idx}`} onClick={handleAddVideoTab} />
          }
          return (
            <VideoTileDraft
              key={`draft-${idx}`}
              onClick={() => handleVideoClick(draft.id, { draft: true })}
              id={draft.id}
              onDeleteVideoClick={() => handleDeleteDraft(draft.id)}
            />
          )
        })
    : videosWithSkeletonLoaders.map((video, idx) => {
        if (video === 'new-video-tile') {
          return <NewVideoTile loading={loading} key={idx} onClick={handleAddVideoTab} />
        }
        return (
          <VideoTilePublisher
            key={video.id ? `video-id-${video.id}` : `video-idx-${idx}`}
            id={video.id}
            onEditClick={(e) => {
              e?.stopPropagation()
              e?.preventDefault()
              handleVideoClick(video.id)
            }}
            onMintNftClick={(e) => {
              e?.stopPropagation()
              e?.preventDefault()
              handleVideoClick(video.id, { mintNft: true })
            }}
            onDeleteVideoClick={() => video.id && deleteVideo(video.id)}
            onReuploadVideoClick={() => navigate(absoluteRoutes.studio.uploads(), { state: { highlightFailed: true } })}
          />
        )
      })

  if (error) {
    return <ViewErrorFallback />
  }

  const sortVisibleAndUploadButtonVisible = isDraftTab ? !!drafts.length : !hasNoVideos

  const sortSelectNode = (
    <Select
      size="medium"
      inlineLabel="Sort by"
      value={sortVideosBy}
      items={VIDEO_SORT_OPTIONS}
      onChange={handleSorting}
    />
  )

  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: tab === 'Drafts' ? unseenDrafts.length : 0 }))
  return (
    <LimitedWidthContainer>
      {headTags}
      <StyledText as="h1" variant="h700">
        My videos
      </StyledText>
      {!smMatch && sortVisibleAndUploadButtonVisible && (
        <MobileButton
          size="large"
          to={absoluteRoutes.studio.videoWorkspace()}
          icon={<SvgActionAddVideo />}
          onClick={handleAddVideoTab}
          fullWidth
        >
          Upload video
        </MobileButton>
      )}
      {hasNoVideos ? (
        <EmptyFallback
          verticalCentered
          title="Add your first video"
          subtitle="No videos uploaded yet. Start publishing by adding your first video to Joystream."
          button={
            <Button
              icon={<SvgActionUpload />}
              to={absoluteRoutes.studio.videoWorkspace()}
              variant="secondary"
              size="large"
              onClick={handleAddVideoTab}
            >
              Upload video
            </Button>
          }
        />
      ) : (
        <>
          <TabsContainer>
            <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={handleSetCurrentTab} />
            {mdMatch && sortVisibleAndUploadButtonVisible && sortSelectNode}
            {smMatch && sortVisibleAndUploadButtonVisible && (
              <Button
                to={absoluteRoutes.studio.videoWorkspace()}
                icon={<SvgActionAddVideo />}
                onClick={handleAddVideoTab}
              >
                Upload video
              </Button>
            )}
          </TabsContainer>
          {isDraftTab && (
            <StyledBanner
              id="video-draft-saved-locally-warning"
              title="Video drafts are saved locally"
              icon={<SvgAlertsInformative24 />}
              description="You will only be able to access drafts on the device you used to create them. Clearing your browser history will delete all your drafts."
            />
          )}
          {isUnlistedTab && (
            <StyledBanner
              id="unlisted-video-link-info"
              title="Unlisted videos can be seen only with direct link"
              icon={<SvgAlertsInformative24 />}
              description="You can share a private video with others by sharing a direct link to it. Unlisted video is not going to be searchable on our platform."
            />
          )}
          {!mdMatch && sortVisibleAndUploadButtonVisible && (
            <StyledSelect
              size="medium"
              inlineLabel="Sort by"
              value={sortVideosBy}
              items={VIDEO_SORT_OPTIONS}
              onChange={handleSorting}
            />
          )}
          <StyledGrid maxColumns={null} onResize={handleOnResizeGrid} gap={sizes(mdMatch ? 6 : 4)}>
            {gridContent}
          </StyledGrid>
          {((isDraftTab && drafts.length === 0) ||
            (!isDraftTab && !loading && totalCount === 0 && (!videos || videos.length === 0))) && (
            <EmptyFallback
              verticalCentered
              title={
                isAllVideosTab
                  ? 'No videos yet'
                  : isPublicTab
                  ? 'No public videos yet'
                  : isDraftTab
                  ? 'No drafts here yet'
                  : 'No unlisted videos here yet'
              }
              subtitle={
                isAllVideosTab
                  ? null
                  : isPublicTab
                  ? 'Videos published with "Public" privacy setting will show up here.'
                  : isDraftTab
                  ? "Each video that hasn't been published yet will be available here as a draft."
                  : 'Videos published with "Unlisted" privacy setting will show up here.'
              }
              button={
                <Button
                  icon={<SvgActionUpload />}
                  to={absoluteRoutes.studio.videoWorkspace()}
                  variant="secondary"
                  size="large"
                  onClick={handleAddVideoTab}
                >
                  Upload video
                </Button>
              }
            />
          )}
          <StyledPagination
            onChangePage={handleChangePage}
            page={currentPage}
            itemsPerPage={videosPerPage}
            // +1 is for new video tile
            totalCount={isDraftTab ? drafts.length : (totalCount || 0) + 1}
          />
        </>
      )}
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
