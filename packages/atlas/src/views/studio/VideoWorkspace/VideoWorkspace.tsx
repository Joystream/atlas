import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { DrawerHeader } from '@/components/DrawerHeader'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { cVar } from '@/styles'

import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay } from './VideoWorkspace.style'

export const VideoWorkspace: React.FC = React.memo(() => {
  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { openWarningDialog } = useDisplayDataLostWarning()
  const { tabData } = useVideoWorkspaceData()
  const [hasUnsavedAssets, setHasUnsavedAssets] = useState(false)

  const isEdit = !editedVideoInfo?.isDraft
  const headTags = useHeadTags(isEdit ? 'Edit video' : 'New video')

  useEffect(() => {
    if (!isWorkspaceOpen || !hasUnsavedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [hasUnsavedAssets, isWorkspaceOpen])

  const closeVideoWorkspace = useCallback(() => {
    if (hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  const getBadgeText = () => {
    if (editedVideoInfo.isNew || editedVideoInfo.isDraft) {
      return 'New'
    }
    return 'Edit'
  }

  return (
    <>
      {isWorkspaceOpen && headTags}
      <CSSTransition
        in={isWorkspaceOpen}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace-drawer"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={isWorkspaceOpen}
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
          <VideoForm fee={0} setHasUnsavedAssets={setHasUnsavedAssets} />
        </Container>
      </CSSTransition>
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
