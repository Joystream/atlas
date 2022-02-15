import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useMeasure from 'react-use-measure'

import { DrawerHeader } from '@/components/DrawerHeader'
import { SvgControlsCancel } from '@/components/_icons'
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

  const handleReset = () => {}

  // const actionBarPrimaryButton = useMemo(
  //   () => ({
  //     text: 'Next step',
  //     disabled: false,
  //     onClick: () => {
  //       if (currentStepIdx < 3) {
  //         setCurrentStepIdx((current) => current + 1)
  //       } else {
  //         // handle issuing NFT here
  //       }
  //     },
  //   }),
  //   [currentStepIdx]
  // )

  // const actionBarSecondaryButton = useMemo(
  //   () => ({
  //     text: 'Back',
  //     visible: true,
  //     onClick: () => {
  //       if (currentStepIdx > 0) {
  //         setCurrentStepIdx((current) => current - 1)
  //       } else {
  //         onGoBack()
  //       }
  //     },
  //   }),
  //   [currentStepIdx, onGoBack]
  // )

  // const actionBarDraftBadge = useMemo(
  //   () =>
  //     !isEdit
  //       ? {
  //           text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
  //           tooltip: {
  //             text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
  //           },
  //         }
  //       : undefined,
  //   [isEdit, mdMatch]
  // )

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
            isIssuedAsNFT={isIssuedAsNFT}
            isEdit={isEdit}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty (some edit has been made)
            canSubmit={(formStatus?.isValid && (!isEdit || formStatus?.isDirty)) || isIssuedAsNFT || false}
            canReset={formStatus?.isDirty || false || isIssuedAsNFT}
            onSubmit={
              isIssuedAsNFT
                ? () => setNFTCurrentStepIdx((step) => (step === null ? 0 : step + 1))
                : formStatus?.triggerFormSubmit
            }
            onReset={() => {
              setIsIssuedAsNFT(false)
              formStatus?.resetForm()
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
  isEdit: boolean
  isIssuedAsNFT: boolean
  canReset: boolean
  canSubmit: boolean
  onSubmit?: () => void
  onReset?: () => void
  onResize?: (height: number) => void
}

const VideoWorkspaceActionBar: React.FC<VideoWorkspaceActionBarProps> = ({
  isEdit,
  isIssuedAsNFT,
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
      variant={isIssuedAsNFT ? 'nft' : isEdit ? 'edit' : 'new'}
      primaryText="Fee: 0 Joy"
      secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
      primaryButton={{
        text: isIssuedAsNFT ? 'Next' : isEdit ? 'Publish changes' : 'Upload',
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
        text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
        tooltip: {
          text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
        },
      }}
    />
  )
}
