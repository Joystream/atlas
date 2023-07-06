import { FC, memo, useCallback, useEffect, useState } from 'react'

import { ActionBarProps } from '@/components/ActionBar'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { MintNftFirstTimeModal } from '@/components/_overlays/MintNftFirstTimeModal'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { usePersonalDataStore } from '@/providers/personalData'
import { VideoWorkspaceFormStatus, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'

import { VideoForm } from './VideoForm'
import { useHandleVideoWorkspaceSubmit } from './VideoWorkspace.hooks'

const MINTING_CONFIRMATION_ID = 'minting-confirmation'

export const VideoWorkspace: FC = memo(() => {
  const [formStatus, setFormStatus] = useState<VideoWorkspaceFormStatus | null>(null)
  const [showMintConfirmationDialog, setShowMintConfirmationDialog] = useState(false)
  const [shouldHideMintModal, setShouldHideMintModal] = useState(false)
  const [txVideoId, setTxVideoId] = useState<string>()

  const mintConfirmationDismissed = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === MINTING_CONFIRMATION_ID)
  )
  const updateMintConfirmationDismiss = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const { isWorkspaceOpen, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const { tabData } = useVideoWorkspaceData()
  const { setNftToMint } = useNftActions()

  const [openEditDialog, closeEditDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      onClick: () => {
        closeEditDialog()
        setIsWorkspaceOpen(false)
      },
      text: 'Confirm and discard',
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeEditDialog(),
    },
  })

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
    if (isEdit && formStatus?.isDirty) {
      openEditDialog()
      return
    }
    if (formStatus?.hasUnsavedAssets) {
      openWarningDialog({ onConfirm: () => setIsWorkspaceOpen(false) })
    } else {
      setIsWorkspaceOpen(false)
    }
  }, [formStatus?.hasUnsavedAssets, formStatus?.isDirty, isEdit, openEditDialog, openWarningDialog, setIsWorkspaceOpen])

  const videoFieldsLocked = tabData?.mintNft && isEdit

  const actionBarProps: ActionBarProps = {
    isActive: isEdit ? !formStatus?.isDisabled || videoFieldsLocked : true,
    fee: formStatus?.actionBarFee,
    feeLoading: formStatus?.actionBarFeeLoading,
    primaryButton: videoFieldsLocked
      ? {
          onClick: closeVideoWorkspace,
          text: 'Close',
          variant: 'secondary',
        }
      : {
          disabled: formStatus?.isDisabled,
          onClick: formStatus?.triggerFormSubmit,
          text: formStatus?.actionBarPrimaryText,
        },
    secondaryButton:
      isEdit && formStatus?.isDirty
        ? {
            text: 'Cancel',
            onClick: () => closeVideoWorkspace(),
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
    <>
      <MintNftFirstTimeModal
        shouldHideNextTime={shouldHideMintModal}
        onShouldHideNextTime={setShouldHideMintModal}
        show={showMintConfirmationDialog}
        onSkip={() => {
          if (shouldHideMintModal) {
            updateMintConfirmationDismiss(MINTING_CONFIRMATION_ID, true)
          }
          setShowMintConfirmationDialog(false)
        }}
        onMint={() => {
          if (shouldHideMintModal) {
            updateMintConfirmationDismiss(MINTING_CONFIRMATION_ID, true)
          }
          if (txVideoId) {
            setNftToMint(txVideoId)
          }
          setShowMintConfirmationDialog(false)
        }}
      />
      <BottomDrawer
        isOpen={isWorkspaceOpen}
        onClose={closeVideoWorkspace}
        title={tabData?.title || 'New video'}
        titleLabel={editedVideoInfo.isNew || editedVideoInfo.isDraft ? 'New' : 'Edit'}
        pageTitle={isEdit ? 'Edit video' : 'New video'}
        actionBar={actionBarProps}
        fixedScrollbar
      >
        <VideoForm
          setFormStatus={setFormStatus}
          onSubmit={(data) =>
            handleVideoWorkspaceSubmit(data).then((videoId) => {
              setTxVideoId(videoId)
              if (!mintConfirmationDismissed && !isEdit && videoId) {
                setShowMintConfirmationDialog(true)
              }
            })
          }
        />
      </BottomDrawer>
    </>
  )
})
VideoWorkspace.displayName = 'VideoWorkspace'
