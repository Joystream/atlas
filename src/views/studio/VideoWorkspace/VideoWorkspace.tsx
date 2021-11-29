import React, { useCallback, useEffect, useState } from 'react'

import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { VideoWorkspaceTab, useVideoWorkspace } from '@/providers/videoWorkspace'
import { computeFileHash } from '@/utils/hashing'

import { Container, DrawerOverlay } from './VideoWorkspace.style'
import { VideoWorkspaceForm } from './VideoWorkspaceForm'
import { VideoWorkspaceTabsBar } from './VideoWorkspaceTabsBar'
import { useVideoWorkspaceAnimations } from './animations'

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
  const { containerRef, drawerOverlayAnimationProps, videoWorkspaceAnimationProps } =
    useVideoWorkspaceAnimations(videoWorkspaceState)

  const { openWarningDialog } = useDisplayDataLostWarning()

  // transaction management
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)

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

  return (
    <>
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container ref={containerRef} role="dialog" style={videoWorkspaceAnimationProps}>
        <VideoWorkspaceTabsBar
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          videoWorkspaceState={videoWorkspaceState}
          onAddNewTabClick={addVideoTab}
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
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
