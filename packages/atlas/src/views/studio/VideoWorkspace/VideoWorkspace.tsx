import { FC, memo, useCallback, useEffect, useState } from 'react'

import { ActionBarProps } from '@/components/ActionBar'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { VideoWorkspaceFormStatus, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'

import { VideoForm } from './VideoForm'
import { useHandleVideoWorkspaceSubmit } from './VideoWorkspace.hooks'

export const VideoWorkspace: FC = memo(() => {
  const [formStatus, setFormStatus] = useState<VideoWorkspaceFormStatus | null>(null)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()

  const { openWarningDialog } = useDisplayDataLostWarning()

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()

  const mdMatch = useMediaMatch('md')

  const isEdit = !editedVideoInfo?.isDraft

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

  const actionBarProps: ActionBarProps = {
    isActive: isEdit ? !formStatus?.isDisabled : true,
    fee: 0,
    primaryButton: {
      disabled: formStatus?.isDisabled,
      onClick: formStatus?.triggerFormSubmit,
      tooltip: formStatus?.isDisabled
        ? undefined
        : {
            headerText: 'Fill all required fields to proceed',
            text: 'Required: video file, thumbnail image, title, category, language',
            multiline: true,
          },
      text: formStatus?.actionBarPrimaryText,
    },
    secondaryButton:
      isEdit && formStatus?.isDirty
        ? {
            text: isEdit ? 'Cancel' : undefined,
            onClick: () => formStatus?.triggerReset?.(),
          }
        : undefined,
    infoBadge: !isEdit
      ? {
          text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
          tooltip: {
            text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
            multiline: true,
          },
        }
      : undefined,
  }

  return (
    <BottomDrawer
      isOpen={isWorkspaceOpen}
      onClose={closeVideoWorkspace}
      title={tabData?.title || 'New video'}
      titleLabel={editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
      pageTitle={isEdit ? 'Edit video' : 'New video'}
      actionBar={actionBarProps}
      fixedScrollbar
    >
      <VideoForm setFormStatus={setFormStatus} onSubmit={handleVideoWorkspaceSubmit} />
    </BottomDrawer>
  )
})
VideoWorkspace.displayName = 'VideoWorkspace'
