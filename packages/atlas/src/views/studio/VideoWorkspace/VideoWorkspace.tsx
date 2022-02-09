import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { DrawerHeader } from '@/components/DrawerHeader'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import {
  VideoWorkspaceAssetsCache,
  VideoWorkspaceState,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { cVar } from '@/styles'
import { computeFileHash } from '@/utils/hashing'

import { Container, DrawerOverlay } from './VideoWorkspace.style'
import { VideoWorkspaceForm } from './VideoWorkspaceForm'

export const VideoWorkspace: React.FC = React.memo(() => {
  // videoWorkspace state
  const { videoWorkspaceState, setVideoWorkspaceState, editedVideoInfo } = useVideoWorkspace()
  const { openWarningDialog } = useDisplayDataLostWarning()
  const { tabData } = useVideoWorkspaceData(editedVideoInfo)
  const [assetsCache, setAssetsCache] = useState<VideoWorkspaceAssetsCache>(null)

  const isEdit = !editedVideoInfo?.isDraft
  const headTags = useHeadTags(isEdit ? 'Edit video' : 'New video')
  const anyVideoTabCachedAssets = !!(
    assetsCache &&
    (assetsCache.thumbnail.cropContentId || assetsCache.video.contentId)
  )

  // transaction management
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [dialogState, setDialogState] = useState<VideoWorkspaceState>('unset')

  useEffect(() => {
    setDialogState(videoWorkspaceState)
  }, [videoWorkspaceState])

  useEffect(() => {
    if (videoWorkspaceState === 'closed' || !anyVideoTabCachedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [videoWorkspaceState, anyVideoTabCachedAssets])

  const handleVideoFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const handleThumbnailFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const closeVideoWorkspace = useCallback(() => {
    if (anyVideoTabCachedAssets) {
      openWarningDialog({ onConfirm: () => setVideoWorkspaceState('closed') })
    } else {
      setVideoWorkspaceState('closed')
    }
  }, [anyVideoTabCachedAssets, openWarningDialog, setVideoWorkspaceState])

  const getBadgeText = () => {
    if (editedVideoInfo.isNew || editedVideoInfo.isDraft) {
      return 'New'
    }
    return 'Edit'
  }

  return (
    <>
      {dialogState === 'open' && headTags}
      <CSSTransition
        in={dialogState === 'open'}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace-drawer"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={dialogState === 'open'}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace"
      >
        <Container role="dialog">
          <DrawerHeader
            title={tabData?.title || 'New video'}
            label={getBadgeText()}
            onCloseClick={closeVideoWorkspace}
          />
          <VideoWorkspaceForm
            editedVideoInfo={editedVideoInfo}
            onThumbnailFileChange={handleThumbnailFileChange}
            onVideoFileChange={handleVideoFileChange}
            fee={0}
            thumbnailHashPromise={thumbnailHashPromise}
            videoHashPromise={videoHashPromise}
            setAssetsCache={setAssetsCache}
          />
        </Container>
      </CSSTransition>
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
