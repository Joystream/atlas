import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { ActionBarVariant } from '@/components/ActionBar'
import { DrawerHeader } from '@/components/DrawerHeader'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { NftAuctionInputMetadata, NftIssuanceInputMetadata } from '@/joystream-lib'
import {
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { cVar, transitions } from '@/styles'

import { NftForm } from './NftForm'
import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './VideoWorkspace.style'
import { useHandleVideoWorkspaceSubmit } from './hooks'

type FormStatus = VideoWorkspaceFormStatus<VideoWorkspaceVideoFormFields & NftAuctionInputMetadata> | null

export const VideoWorkspace: React.FC = React.memo(() => {
  const [formStatus, setFormStatus] = useState<FormStatus>(null)
  const [videoFormDataForNft, setVideoFormDataForNft] = useState<VideoFormData | null>(null)
  const [isNftFormOpen, setIsNftFormOpen] = useState(false)

  const [actionBarHeight, setActionBarHeight] = useState(0)
  const [isIssuedAsNft, setIsIssuedAsNft] = useState(false)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()

  const { openWarningDialog } = useDisplayDataLostWarning()

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const handleNftWorkspaceSubmit = () => null

  const handleVideoSubmit = useCallback(
    (data: VideoFormData) => {
      if (isIssuedAsNft) {
        setVideoFormDataForNft(data)
        setIsNftFormOpen(true)
      } else {
        handleVideoWorkspaceSubmit(data)
      }
    },
    [handleVideoWorkspaceSubmit, isIssuedAsNft]
  )

  const handleNftSubmit = useCallback((_: NftAuctionInputMetadata | NftIssuanceInputMetadata) => {
    handleNftWorkspaceSubmit()
  }, [])

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

  // clear videoFormDataForNft when closing VideoWorkspace
  useEffect(() => {
    if (isWorkspaceOpen) {
      return
    }
    setVideoFormDataForNft(null)
  }, [isWorkspaceOpen])

  const closeVideoWorkspace = useCallback(() => {
    setIsIssuedAsNft(false)
    setIsNftFormOpen(false)
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  const onSecondaryButtonClick = () => {
    if (isNftFormOpen) {
      formStatus?.handleGoBack?.()
    } else {
      if (tabData) {
        formStatus?.resetForm(tabData)
      }
      setIsIssuedAsNft(false)
    }
  }

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
            label={isNftFormOpen ? 'NFT' : editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
            onCloseClick={closeVideoWorkspace}
          />
          <ScrollContainer actionBarHeight={actionBarHeight}>
            <SwitchTransition>
              <CSSTransition
                key={String(isNftFormOpen)}
                classNames={transitions.names.fade}
                timeout={parseInt(cVar('animationTimingFast', true))}
              >
                {!isNftFormOpen ? (
                  <VideoForm
                    videoFormDataForNft={videoFormDataForNft}
                    setFormStatus={setFormStatus}
                    onSubmit={handleVideoSubmit}
                    setIsIssuedAsNft={setIsIssuedAsNft}
                    isIssuedAsNft={isIssuedAsNft}
                  />
                ) : (
                  <NftForm
                    setFormStatus={setFormStatus}
                    onSubmit={handleNftSubmit}
                    setIsNftFormOpen={setIsNftFormOpen}
                  />
                )}
              </CSSTransition>
            </SwitchTransition>
          </ScrollContainer>
          <VideoWorkspaceActionBar
            isEdit={isEdit}
            isIssuedAsNft={isIssuedAsNft}
            variant={isNftFormOpen ? 'nft' : isEdit ? 'edit' : 'new'}
            primaryButtonText={formStatus?.actionBarPrimaryText || ''}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty  (some edit has been made)
            canSubmit={!!formStatus?.isDisabled}
            canReset={formStatus?.isDirty || isIssuedAsNft || false}
            onPrimaryButtonClick={formStatus?.triggerFormSubmit}
            onSecondaryButtonClick={onSecondaryButtonClick}
            onResize={setActionBarHeight}
          />
        </Container>
      </CSSTransition>
    </>
  )
})
VideoWorkspace.displayName = 'VideoWorkspace'

type VideoWorkspaceActionBarProps = {
  variant?: ActionBarVariant
  isEdit: boolean
  isIssuedAsNft?: boolean
  canReset: boolean
  canSubmit: boolean
  primaryButtonText: string
  onPrimaryButtonClick?: () => void
  onSecondaryButtonClick?: () => void
  onResize?: (height: number) => void
}

const VideoWorkspaceActionBar: React.FC<VideoWorkspaceActionBarProps> = ({
  variant = 'new',
  isEdit,
  isIssuedAsNft,
  canReset,
  canSubmit,
  primaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onResize,
}) => {
  const mdMatch = useMediaMatch('md')
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })

  const isActive = variant === 'new' || canSubmit || isIssuedAsNft
  const height = isActive ? actionBarBoundsHeight : 0

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
      variant={variant}
      primaryText="Fee: 0 Joy"
      secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
      primaryButton={{
        disabled: !canSubmit,
        onClick: onPrimaryButtonClick,
        tooltip: canSubmit
          ? undefined
          : {
              headerText: 'Fill all required fields to proceed',
              text: 'Required: video file, thumbnail image, title, category, language',
            },
        text: primaryButtonText,
      }}
      secondaryButton={
        variant !== 'new'
          ? {
              visible: canReset,
              text: variant === 'edit' ? 'Cancel' : 'Back',
              onClick: () => onSecondaryButtonClick?.(),
            }
          : undefined
      }
      draftBadge={
        !isEdit
          ? {
              text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
              tooltip: {
                text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
              },
            }
          : undefined
      }
    />
  )
}
