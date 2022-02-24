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
import { Listing } from '@/views/studio/VideoWorkspace/NFTForm/types'

import { NFTForm } from './NFTForm'
import { VideoForm } from './VideoForm'
import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './VideoWorkspace.style'
import { useHandleVideoWorkspaceSubmit } from './hooks'

type FormStatus = VideoWorkspaceFormStatus<VideoWorkspaceVideoFormFields & NftAuctionInputMetadata> | null

export const VideoWorkspace: React.FC = React.memo(() => {
  const [listingType, setListingType] = useState<Listing>(undefined)
  const [formStatus, setFormStatus] = useState<FormStatus>(null)
  const [videoFormDataForNFT, setVideoFormDataForNFT] = useState<VideoFormData | null>(null)
  const [nftTermsAccepted, setNftTermsAccepted] = useState(false)

  const [actionBarHeight, setActionBarHeight] = useState(0)
  const [nftCurrentStepIdx, setNftCurrentStepIdx] = useState(-1)
  const [isIssuedAsNFT, setIsIssuedAsNFT] = useState(false)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()

  const { openWarningDialog } = useDisplayDataLostWarning()

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const handleNFTWorkspaceSubmit = () => null

  const onSetFormStatus = useCallback((data: FormStatus) => {
    if (!data) {
      return
    }
    setFormStatus((prevState) => ({ ...prevState, ...data }))
  }, [])

  const toggleTermsAccept = () => {
    setNftTermsAccepted((prevState) => !prevState)
  }

  const handleSubmit = useCallback(
    (data: VideoFormData) => {
      if (isIssuedAsNFT) {
        if (nftCurrentStepIdx === -1) {
          setVideoFormDataForNFT(data)
        }
        if (nftCurrentStepIdx === 2) {
          handleVideoWorkspaceSubmit(data)
          return
        }
        setNftCurrentStepIdx((step) => (step === null ? 0 : step + 1))
      } else {
        handleVideoWorkspaceSubmit(data)
      }
    },
    [nftCurrentStepIdx, handleVideoWorkspaceSubmit, isIssuedAsNFT]
  )

  const handleNFTSubmit = useCallback(
    (_: NftAuctionInputMetadata | NftIssuanceInputMetadata) => {
      if (isIssuedAsNFT) {
        if (nftCurrentStepIdx === 2) {
          handleNFTWorkspaceSubmit()
        }
      }
    },
    [nftCurrentStepIdx, isIssuedAsNFT]
  )

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

  // clear videoFormDataForNFT when closing VideoWorkspace
  useEffect(() => {
    if (isWorkspaceOpen) {
      return
    }
    setVideoFormDataForNFT(null)
  }, [isWorkspaceOpen])

  const closeVideoWorkspace = useCallback(() => {
    setNftTermsAccepted(false)
    setIsIssuedAsNFT(false)
    setNftCurrentStepIdx(-1)
    setListingType(undefined)
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, openWarningDialog, setIsWorkspaceOpen])

  const isNFTFormOpen = nftCurrentStepIdx > -1

  const handleSecondaryButtonClick = () => {
    if (isNFTFormOpen) {
      setNftCurrentStepIdx(nftCurrentStepIdx - 1)
    } else {
      if (tabData) {
        formStatus?.resetForm(tabData)
      }
      setIsIssuedAsNFT(false)
    }
  }

  const NFTActionBarDisabled = useMemo(() => {
    if (nftCurrentStepIdx === 0) {
      return !!listingType
    }
    if (nftCurrentStepIdx === 1) {
      return formStatus?.isValid
    }
    if (nftCurrentStepIdx === 2) {
      return nftTermsAccepted
    }
    return true
  }, [nftCurrentStepIdx, formStatus?.isValid, nftTermsAccepted, listingType])

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
            label={isNFTFormOpen ? 'NFT' : editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
            onCloseClick={closeVideoWorkspace}
          />
          <ScrollContainer actionBarHeight={actionBarHeight}>
            <SwitchTransition>
              <CSSTransition
                key={String(isNFTFormOpen)}
                classNames={transitions.names.fade}
                timeout={parseInt(cVar('animationTimingFast', true))}
              >
                {!isNFTFormOpen ? (
                  <VideoForm
                    videoFormDataForNFT={videoFormDataForNFT}
                    setFormStatus={onSetFormStatus}
                    onSubmit={handleSubmit}
                    setIsIssuedAsNFT={setIsIssuedAsNFT}
                    isIssuedAsNFT={isIssuedAsNFT}
                  />
                ) : (
                  <NFTForm
                    setFormStatus={onSetFormStatus}
                    nftCurrentStepIdx={nftCurrentStepIdx}
                    setListingType={setListingType}
                    listingType={listingType}
                    onSubmit={handleNFTSubmit}
                    toggleTermsAccept={toggleTermsAccept}
                    termsAccepted={nftTermsAccepted}
                  />
                )}
              </CSSTransition>
            </SwitchTransition>
          </ScrollContainer>
          <VideoWorkspaceActionBar
            isEdit={isEdit}
            nftCurrentStepIdx={nftCurrentStepIdx}
            isIssuedAsNFT={isIssuedAsNFT}
            variant={isNFTFormOpen ? 'nft' : isEdit ? 'edit' : 'new'}
            // form can be submitted if both:
            // 1. form is valid
            // 2. the video is a new one OR the form is dirty  (some edit has been made)
            canSubmit={
              (isIssuedAsNFT && formStatus?.isValid
                ? NFTActionBarDisabled
                : formStatus?.isValid && (isEdit ? formStatus.isDirty : true)) || false
            }
            canReset={formStatus?.isDirty || isIssuedAsNFT || false}
            onPrimaryButtonClick={formStatus?.triggerVideoFormSubmit}
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
  isIssuedAsNFT?: boolean
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
  isIssuedAsNFT,
  canReset,
  canSubmit,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onResize,
}) => {
  const mdMatch = useMediaMatch('md')
  const [actionBarRef, actionBarBounds] = useMeasure()

  const isActive = variant === 'new' || canSubmit || isIssuedAsNFT
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
          return isIssuedAsNFT ? 'Next step' : 'Upload'
        case 'edit':
          return isIssuedAsNFT ? 'Next step' : 'Publish changes'
        case 'nft':
          return nftCurrentStepIdx === null || nftCurrentStepIdx < 2
            ? 'Next step'
            : isEdit
            ? 'Issue NFT'
            : 'Upload and issue'
      }
    },
    [nftCurrentStepIdx, isEdit, isIssuedAsNFT]
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
