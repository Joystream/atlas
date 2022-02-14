import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useMeasure from 'react-use-measure'

import { DrawerHeader } from '@/components/DrawerHeader'
import { SvgControlsCancel } from '@/components/_icons'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { VideoWorkspaceFormStatus, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { cVar } from '@/styles'

import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './VideoWorkspace.style'
import { useHandleVideoWorkspaceSubmit } from './hooks'

export const VideoWorkspace: React.FC = React.memo(() => {
  const [formStatus, setFormStatus] = useState<VideoWorkspaceFormStatus | null>(null)
  const [actionBarHeight, setActionBarHeight] = useState(0)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()

  const { openWarningDialog } = useDisplayDataLostWarning()

  const handleSubmit = useHandleVideoWorkspaceSubmit()

  const isEdit = !editedVideoInfo?.isDraft
  const headTags = useHeadTags(isEdit ? 'Edit video' : 'New video')

  // display browser confirmation dialog when users closes the window and has unsaved assets
  useEffect(() => {
    if (!isWorkspaceOpen || !formStatus?.hasUnsavedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [formStatus?.hasUnsavedAssets, isWorkspaceOpen])

  const closeVideoWorkspace = useCallback(() => {
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  return (
    <>
      {isWorkspaceOpen && headTags}
      <CSSTransition
        in={isWorkspaceOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace-drawer"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={isWorkspaceOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace"
      >
        <Container role="dialog">
          <DrawerHeader
            title={tabData?.title || 'New video'}
            label={editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
            onCloseClick={closeVideoWorkspace}
          />
          <ScrollContainer actionBarHeight={actionBarHeight}>
            <VideoForm setFormStatus={setFormStatus} onSubmit={handleSubmit} />
          </ScrollContainer>

          <VideoWorkspaceActionBar
            isEdit={isEdit}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty (some edit has been made)
            canSubmit={(formStatus?.isValid && (!isEdit || formStatus?.isDirty)) || false}
            canReset={formStatus?.isDirty || false}
            onSubmit={formStatus?.triggerFormSubmit}
            onReset={formStatus?.resetForm}
            onResize={setActionBarHeight}
          />
        </Container>
      </CSSTransition>
    </>
  )
})
VideoWorkspace.displayName = 'VideoWorkspace'

type VideoWorkspaceActionBarProps = {
  isEdit: boolean
  canReset: boolean
  canSubmit: boolean
  onSubmit?: () => void
  onReset?: () => void
  onResize?: (height: number) => void
}

const VideoWorkspaceActionBar: React.FC<VideoWorkspaceActionBarProps> = ({
  isEdit,
  canReset,
  canSubmit,
  onSubmit,
  onReset,
  onResize,
}) => {
  const mdMatch = useMediaMatch('md')
  const [actionBarRef, actionBarBounds] = useMeasure()

  const isActive = !isEdit || canSubmit
  const height = isActive ? actionBarBounds.height : 0

  // send update to VideoWorkspace whenever height changes
  useEffect(() => {
    if (!onResize) {
      return
    }

    onResize(height)
  }, [height, onResize])

  return (
    <StyledActionBar
      ref={actionBarRef}
      isEdit={isEdit}
      primaryText="Fee: 0 Joy"
      secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
      primaryButton={{
        text: isEdit ? 'Publish changes' : 'Upload',
        disabled: !canSubmit,
        onClick: onSubmit,
        tooltip: canSubmit
          ? undefined
          : {
              headerText: 'Fill all required fields to proceed',
              text: 'Required: video file, thumbnail image, title, category, language',
            },
      }}
      secondaryButton={{
        visible: canReset,
        text: 'Cancel',
        onClick: () => onReset?.(),
        icon: <SvgControlsCancel width={16} height={16} />,
      }}
      draftBadge={{
        visible: !isEdit,
        text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
        tooltip: {
          text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
        },
      }}
    />
  )
}
