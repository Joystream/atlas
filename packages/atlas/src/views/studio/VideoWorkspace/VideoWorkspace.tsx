import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useMeasure from 'react-use-measure'

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
import { Listing } from '@/views/studio/VideoWorkspace/NftForm/types'

import { NftForm } from './NftForm'
import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './VideoWorkspace.style'
import { useHandleVideoWorkspaceSubmit } from './hooks'

type FormStatus = VideoWorkspaceFormStatus<VideoWorkspaceVideoFormFields & NftAuctionInputMetadata> | null

export const VideoWorkspace: React.FC = React.memo(() => {
  const [listingType, setListingType] = useState<Listing>(undefined)
  const [formStatus, setFormStatus] = useState<FormStatus>(null)
  const [videoFormDataForNft, setVideoFormDataForNft] = useState<VideoFormData | null>(null)

  const [actionBarHeight, setActionBarHeight] = useState(0)
  const [nftCurrentStepIdx, setNftCurrentStepIdx] = useState(-1)
  const [isIssuedAsNft, setIsIssuedAsNft] = useState(false)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()

  const { openWarningDialog } = useDisplayDataLostWarning()

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const handleNftWorkspaceSubmit = () => null

  const onSetFormStatus = useCallback((data: FormStatus) => {
    if (!data) {
      return
    }
    setFormStatus((prevState) => ({ ...prevState, ...data }))
  }, [])

  const handleVideoSubmit = useCallback(
    (data: VideoFormData) => {
      if (isIssuedAsNft) {
        setVideoFormDataForNft(data)
      } else {
        handleVideoWorkspaceSubmit(data)
      }
    },
    [handleVideoWorkspaceSubmit, isIssuedAsNft]
  )

  const handleNftSubmit = useCallback(
    (_: NftAuctionInputMetadata | NftIssuanceInputMetadata) => {
      if (nftCurrentStepIdx === 2) {
        handleNftWorkspaceSubmit()
      }
    },
    [nftCurrentStepIdx]
  )

  const onPrimaryButtonClick = async () => {
    if (nftCurrentStepIdx === -1) {
      formStatus?.triggerVideoFormSubmit?.()
      if (!isIssuedAsNft) {
        return
      }
    }
    if (nftCurrentStepIdx === 2 && videoFormDataForNft) {
      handleVideoWorkspaceSubmit(videoFormDataForNft)
      formStatus?.triggerNftFormSubmit?.()
      return
    }
    setNftCurrentStepIdx((step) => (step === null ? 0 : step + 1))
  }

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
    setNftCurrentStepIdx(-1)
    setListingType(undefined)
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  const isNftFormOpen = nftCurrentStepIdx > -1

  const handleSecondaryButtonClick = () => {
    if (isNftFormOpen) {
      setNftCurrentStepIdx(nftCurrentStepIdx - 1)
    } else {
      if (tabData) {
        formStatus?.resetForm(tabData)
      }
      setIsIssuedAsNft(false)
    }
  }

  const NftActionBarDisabled = useMemo(() => {
    if (nftCurrentStepIdx === 0) {
      return !!listingType
    }
    if (nftCurrentStepIdx === 1) {
      return formStatus?.isValid
    }
    if (nftCurrentStepIdx === 2) {
      return formStatus?.termsAccepted
    }
    return true
  }, [nftCurrentStepIdx, formStatus, listingType])

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
            label={isNftFormOpen ? 'Nft' : editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
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
                    setFormStatus={onSetFormStatus}
                    onSubmit={handleVideoSubmit}
                    setIsIssuedAsNft={setIsIssuedAsNft}
                    isIssuedAsNft={isIssuedAsNft}
                  />
                ) : (
                  <NftForm
                    setFormStatus={onSetFormStatus}
                    nftCurrentStepIdx={nftCurrentStepIdx}
                    setListingType={setListingType}
                    listingType={listingType}
                    onSubmit={handleNftSubmit}
                  />
                )}
              </CSSTransition>
            </SwitchTransition>
          </ScrollContainer>
          <VideoWorkspaceActionBar
            isEdit={isEdit}
            nftCurrentStepIdx={nftCurrentStepIdx}
            isIssuedAsNft={isIssuedAsNft}
            variant={isNftFormOpen ? 'nft' : isEdit ? 'edit' : 'new'}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty  (some edit has been made)
            canSubmit={
              (isIssuedAsNft && nftCurrentStepIdx >= 0
                ? NftActionBarDisabled
                : formStatus?.isValid && (isEdit ? formStatus.isDirty : true)) || false
            }
            canReset={formStatus?.isDirty || isIssuedAsNft || false}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={handleSecondaryButtonClick}
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
  nftCurrentStepIdx: number | null
  isIssuedAsNft?: boolean
  canReset: boolean
  canSubmit: boolean
  onPrimaryButtonClick?: () => void
  onSecondaryButtonClick?: () => void
  onResize?: (height: number) => void
}

const VideoWorkspaceActionBar: React.FC<VideoWorkspaceActionBarProps> = ({
  variant = 'new',
  isEdit,
  nftCurrentStepIdx,
  isIssuedAsNft,
  canReset,
  canSubmit,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onResize,
}) => {
  const mdMatch = useMediaMatch('md')
  const [actionBarRef, actionBarBounds] = useMeasure()

  const isActive = variant === 'new' || canSubmit || isIssuedAsNft
  const height = isActive ? actionBarBounds.height : 0

  // send update to VideoWorkspace whenever height changes
  useEffect(() => {
    if (!onResize) {
      return
    }

    onResize(height)
  }, [height, onResize])

  const getPrimaryButtonText = useCallback(
    (variant: ActionBarVariant) => {
      switch (variant) {
        case 'new':
          return isIssuedAsNft ? 'Next step' : 'Upload'
        case 'edit':
          return isIssuedAsNft ? 'Next step' : 'Publish changes'
        case 'nft':
          return nftCurrentStepIdx === null || nftCurrentStepIdx < 2
            ? 'Next step'
            : isEdit
            ? 'Issue Nft'
            : 'Upload and issue'
      }
    },
    [nftCurrentStepIdx, isEdit, isIssuedAsNft]
  )

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
        text: getPrimaryButtonText(variant),
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
