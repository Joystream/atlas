import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useMeasure from 'react-use-measure'

import { ActionBarVariant, ActionDialogButtonProps } from '@/components/ActionBar'
import { DrawerHeader } from '@/components/DrawerHeader'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { VideoWorkspaceFormStatus, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { cVar, transitions } from '@/styles'

import { NFTForm } from './NFTForm'
import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './VideoWorkspace.style'
import { useHandleVideoWorkspaceSubmit } from './hooks'

export const VideoWorkspace: React.FC = React.memo(() => {
  const [formStatus, setFormStatus] = useState<VideoWorkspaceFormStatus | null>(null)
  const [actionBarHeight, setActionBarHeight] = useState(0)
  const [NFTCurrentStepIdx, setNFTCurrentStepIdx] = useState<null | number>(null)
  const [isIssuedAsNFT, setIsIssuedAsNFT] = useState(false)

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
    setIsIssuedAsNFT(false)
    setNFTCurrentStepIdx(null)
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  const isIssuedAsNFTChecked = NFTCurrentStepIdx !== null

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
            <SwitchTransition>
              <CSSTransition
                key={String(isIssuedAsNFTChecked)}
                classNames={transitions.names.fade}
                timeout={parseInt(cVar('animationTimingFast', true))}
              >
                {!isIssuedAsNFTChecked ? (
                  <VideoForm
                    setFormStatus={setFormStatus}
                    onSubmit={handleSubmit}
                    setIsIssuedAsNFT={setIsIssuedAsNFT}
                    isIssuedAsNFT={isIssuedAsNFT}
                  />
                ) : (
                  <NFTForm NFTCurrentStepIdx={NFTCurrentStepIdx} />
                )}
              </CSSTransition>
            </SwitchTransition>
          </ScrollContainer>
          <VideoWorkspaceActionBar
            isEdit={isEdit}
            NFTCurrentStepIdx={NFTCurrentStepIdx}
            isIssuedAsNFT={isIssuedAsNFT}
            variant={isIssuedAsNFTChecked ? 'nft' : isEdit ? 'edit' : 'new'}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty  (some edit has been made)
            canSubmit={(formStatus?.isValid && (isEdit ? formStatus.isDirty || isIssuedAsNFT : true)) || false}
            canReset={formStatus?.isDirty || isIssuedAsNFT || false}
            onSubmit={() => {
              isIssuedAsNFT
                ? setNFTCurrentStepIdx((step) => (step === null ? 0 : step + 1))
                : formStatus?.triggerFormSubmit()
            }}
            onReset={() => {
              if (isIssuedAsNFTChecked) {
                if (NFTCurrentStepIdx === 0) {
                  setNFTCurrentStepIdx(null)
                } else {
                  setNFTCurrentStepIdx(NFTCurrentStepIdx - 1)
                }
              } else {
                formStatus?.resetForm()
                setIsIssuedAsNFT(false)
              }
            }}
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
  NFTCurrentStepIdx: number | null
  isIssuedAsNFT?: boolean
  canReset: boolean
  canSubmit: boolean
  onSubmit?: () => void
  onReset?: () => void
  onResize?: (height: number) => void
}

const VideoWorkspaceActionBar: React.FC<VideoWorkspaceActionBarProps> = ({
  variant = 'new',
  isEdit,
  NFTCurrentStepIdx,
  isIssuedAsNFT,
  canReset,
  canSubmit,
  onSubmit,
  onReset,
  onResize,
}) => {
  const mdMatch = useMediaMatch('md')
  const [actionBarRef, actionBarBounds] = useMeasure()

  const isActive = variant === 'edit' || canSubmit
  const height = isActive ? actionBarBounds.height : 0

  // send update to VideoWorkspace whenever height changes
  useEffect(() => {
    if (!onResize) {
      return
    }

    onResize(height)
  }, [height, onResize])

  const getPrimaryButton = useCallback(
    (variant: ActionBarVariant): ActionDialogButtonProps => {
      const commonPrimaryButtonProps: ActionDialogButtonProps = {
        disabled: !canSubmit,
        onClick: onSubmit,
        tooltip: canSubmit
          ? undefined
          : {
              headerText: 'Fill all required fields to proceed',
              text: 'Required: video file, thumbnail image, title, category, language',
            },
      }
      switch (variant) {
        case 'new':
          return { ...commonPrimaryButtonProps, text: isIssuedAsNFT ? 'Next' : 'Upload' }
        case 'edit':
          return { ...commonPrimaryButtonProps, text: isIssuedAsNFT ? 'Next' : 'Publish changes' }
        case 'nft':
          return {
            ...commonPrimaryButtonProps,
            text: NFTCurrentStepIdx === null || NFTCurrentStepIdx < 2 ? 'Next' : 'Upload and issue',
          }
      }
    },
    [NFTCurrentStepIdx, canSubmit, isIssuedAsNFT, onSubmit]
  )

  const getSecondaryButton = useCallback(
    (variant) => {
      if (variant === 'new') {
        return
      }
      return {
        visible: canReset,
        text: variant === 'edit' ? 'Cancel' : 'Back',
        onClick: () => onReset?.(),
      }
    },
    [canReset, onReset]
  )

  const getDraftBadge = useCallback(
    (isEdit: boolean) => {
      if (isEdit) {
        return
      }
      return {
        text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
        tooltip: {
          text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
        },
      }
    },
    [mdMatch]
  )

  return (
    <StyledActionBar
      ref={actionBarRef}
      variant={variant}
      primaryText="Fee: 0 Joy"
      secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
      primaryButton={getPrimaryButton(variant)}
      secondaryButton={getSecondaryButton(variant)}
      draftBadge={getDraftBadge(isEdit)}
    />
  )
}
