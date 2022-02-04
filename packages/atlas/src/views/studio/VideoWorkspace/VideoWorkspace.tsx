import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import { VideoWorkspaceState, VideoWorkspaceTab, useVideoWorkspace } from '@/providers/videoWorkspace'
import { cVar } from '@/styles'
import { computeFileHash } from '@/utils/hashing'

import { Container, DrawerOverlay } from './VideoWorkspace.style'
import { VideoWorkspaceForm } from './VideoWorkspaceForm'
import { VideoWorkspaceTabsBar } from './VideoWorkspaceTabsBar'

export const VideoWorkspace: React.FC = React.memo(() => {
  // videoWorkspace state
  const {
    videoWorkspaceState,
    setVideoWorkspaceState,
    videoTabs,
    selectedVideoTabIdx,
    setSelectedVideoTabIdx,
    addVideoTab,
    removeVideoTab,
    anyVideoTabsCachedAssets,
    hasVideoTabAnyCachedAssets,
  } = useVideoWorkspace()
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as VideoWorkspaceTab | undefined
  const { openWarningDialog } = useDisplayDataLostWarning()

  const isEdit = !selectedVideoTab?.isDraft
  const headTags = useHeadTags(isEdit ? 'Edit video' : 'New video')

  // transaction management
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [dialogState, setDialogState] = useState<VideoWorkspaceState>('unset')
  const prevDialogState = useRef(dialogState)

  useEffect(() => {
    if (prevDialogState.current === 'minimized' && videoWorkspaceState === 'open') {
      setDialogState('maximized')
    } else {
      setDialogState(videoWorkspaceState)
    }
    prevDialogState.current = videoWorkspaceState
  }, [videoWorkspaceState])

  useEffect(() => {
    if (videoWorkspaceState === 'closed' || !anyVideoTabsCachedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [videoWorkspaceState, anyVideoTabsCachedAssets])

  const handleVideoFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const handleThumbnailFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const toggleMinimizedVideoWorkspace = useCallback(() => {
    setVideoWorkspaceState(videoWorkspaceState === 'open' ? 'minimized' : 'open')
  }, [setVideoWorkspaceState, videoWorkspaceState])

  const handleDeleteVideo = useCallback(
    (videoId: string) => {
      const videoTabIdx = videoTabs.findIndex((vt) => vt.id === videoId)
      removeVideoTab(videoTabIdx)

      // close the videoWorkspace if we closed the last tab
      setVideoWorkspaceState(videoTabs.length === 1 ? 'closed' : 'minimized')
    },
    [removeVideoTab, setVideoWorkspaceState, videoTabs]
  )

  const closeVideoWorkspace = useCallback(() => {
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => setVideoWorkspaceState('closed') })
    } else {
      setVideoWorkspaceState('closed')
    }
  }, [anyVideoTabsCachedAssets, openWarningDialog, setVideoWorkspaceState])

  const handleRemoveVideoTab = useCallback(
    (tabIdx: number) => {
      if (hasVideoTabAnyCachedAssets(tabIdx)) {
        openWarningDialog({ onConfirm: () => removeVideoTab(tabIdx) })
      } else {
        removeVideoTab(tabIdx)
      }
    },
    [hasVideoTabAnyCachedAssets, openWarningDialog, removeVideoTab]
  )

  const onTabSelect = useCallback(
    (tabIdx: number) => {
      setSelectedVideoTabIdx(tabIdx)
      setVideoWorkspaceState('open')
    },
    [setSelectedVideoTabIdx, setVideoWorkspaceState]
  )

  const onNewTabClick = useCallback(() => addVideoTab(), [addVideoTab])

  return (
    <>
      {dialogState === 'open' && headTags}
      <CSSTransition
        in={['open', 'maximized'].includes(dialogState)}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace-drawer"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={['open', 'minimized', 'maximized'].includes(dialogState)}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace"
      >
        <Container role="dialog" dialogState={dialogState}>
          <VideoWorkspaceTabsBar
            videoTabs={videoTabs}
            selectedVideoTab={selectedVideoTab}
            videoWorkspaceState={videoWorkspaceState}
            onAddNewTabClick={onNewTabClick}
            onRemoveTabClick={handleRemoveVideoTab}
            onTabSelect={onTabSelect}
            onCloseClick={closeVideoWorkspace}
            onToggleMinimizedClick={toggleMinimizedVideoWorkspace}
          />
          <VideoWorkspaceForm
            onDeleteVideo={handleDeleteVideo}
            selectedVideoTab={selectedVideoTab}
            onThumbnailFileChange={handleThumbnailFileChange}
            onVideoFileChange={handleVideoFileChange}
            fee={0}
            thumbnailHashPromise={thumbnailHashPromise}
            videoHashPromise={videoHashPromise}
          />
        </Container>
      </CSSTransition>
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
