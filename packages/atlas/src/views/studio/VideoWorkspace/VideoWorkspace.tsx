import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useHeadTags } from '@/hooks/useHeadTags'
import {
  VideoWorkspaceFormFields,
  VideoWorkspaceState,
  VideoWorkspaceTab,
  useVideoWorkspace,
} from '@/providers/videoWorkspace'
import { cVar, transitions } from '@/styles'
import { computeFileHash } from '@/utils/hashing'

import { NFTWorkspaceForm } from './NFTWorkspaceForm'
import { Container, DrawerOverlay } from './VideoWorkspace.style'
import { VideoWorkspaceForm } from './VideoWorkspaceForm'
import { VideoWorkspaceTabsBar } from './VideoWorkspaceTabsBar'

export const VideoWorkspace: React.FC = React.memo(() => {
  // videoWorkspace state
  const {
    videoWorkspaceState,
    setVideoWorkspaceState,
    videoTabs,
    selectedVideoTabIdx,
    setSelectedVideoTabIdx,
    addVideoTab,
    removeVideoTab,
    anyVideoTabsCachedAssets,
    hasVideoTabAnyCachedAssets,
  } = useVideoWorkspace()
  const [isIssuedAsNFTChecked, setIsIssuedAsNFTChecked] = useState(false)
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as VideoWorkspaceTab | undefined
  const { openWarningDialog } = useDisplayDataLostWarning()

  const isEdit = !selectedVideoTab?.isDraft
  const headTags = useHeadTags(isEdit ? 'Edit video' : 'New video')

  // transaction management
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [dialogState, setDialogState] = useState<VideoWorkspaceState>('unset')
  const prevDialogState = useRef(dialogState)

  const {
    register,
    control,
    handleSubmit: createSubmitHandler,
    getValues,
    setValue,
    watch,
    reset,
    formState,
  } = useForm<VideoWorkspaceFormFields>({
    shouldFocusError: true,
    mode: 'onChange',
  })

  useEffect(() => {
    if (prevDialogState.current === 'minimized' && videoWorkspaceState === 'open') {
      setDialogState('maximized')
    } else {
      setDialogState(videoWorkspaceState)
    }
    prevDialogState.current = videoWorkspaceState
  }, [videoWorkspaceState])

  useEffect(() => {
    if (videoWorkspaceState === 'closed' || !anyVideoTabsCachedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [videoWorkspaceState, anyVideoTabsCachedAssets])

  const handleVideoFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const handleThumbnailFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const toggleMinimizedVideoWorkspace = useCallback(() => {
    setVideoWorkspaceState(videoWorkspaceState === 'open' ? 'minimized' : 'open')
  }, [setVideoWorkspaceState, videoWorkspaceState])

  const handleDeleteVideo = useCallback(
    (videoId: string) => {
      const videoTabIdx = videoTabs.findIndex((vt) => vt.id === videoId)
      removeVideoTab(videoTabIdx)

      // close the videoWorkspace if we closed the last tab
      setVideoWorkspaceState(videoTabs.length === 1 ? 'closed' : 'minimized')
    },
    [removeVideoTab, setVideoWorkspaceState, videoTabs]
  )

  const closeVideoWorkspace = useCallback(() => {
    setValue('isIssuedAsNFT', false)
    setIsIssuedAsNFTChecked(false)
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => setVideoWorkspaceState('closed') })
    } else {
      setVideoWorkspaceState('closed')
    }
  }, [anyVideoTabsCachedAssets, openWarningDialog, setValue, setVideoWorkspaceState])

  const handleRemoveVideoTab = useCallback(
    (tabIdx: number) => {
      if (hasVideoTabAnyCachedAssets(tabIdx)) {
        openWarningDialog({ onConfirm: () => removeVideoTab(tabIdx) })
      } else {
        removeVideoTab(tabIdx)
      }
    },
    [hasVideoTabAnyCachedAssets, openWarningDialog, removeVideoTab]
  )

  const onTabSelect = useCallback(
    (tabIdx: number) => {
      setSelectedVideoTabIdx(tabIdx)
      setVideoWorkspaceState('open')
    },
    [setSelectedVideoTabIdx, setVideoWorkspaceState]
  )

  const onNewTabClick = useCallback(() => addVideoTab(), [addVideoTab])

  return (
    <>
      {dialogState === 'open' && headTags}
      <CSSTransition
        in={['open', 'maximized'].includes(dialogState)}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace-drawer"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={['open', 'minimized', 'maximized'].includes(dialogState)}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="video-workspace"
      >
        <Container role="dialog" dialogState={dialogState}>
          <VideoWorkspaceTabsBar
            videoTabs={videoTabs}
            selectedVideoTab={selectedVideoTab}
            videoWorkspaceState={videoWorkspaceState}
            onAddNewTabClick={onNewTabClick}
            onRemoveTabClick={handleRemoveVideoTab}
            onTabSelect={onTabSelect}
            onCloseClick={closeVideoWorkspace}
            onToggleMinimizedClick={toggleMinimizedVideoWorkspace}
          />
          <SwitchTransition>
            <CSSTransition
              key={String(isIssuedAsNFTChecked)}
              classNames={transitions.names.fade}
              timeout={parseInt(cVar('animationTimingFast', true))}
            >
              {!isIssuedAsNFTChecked ? (
                <VideoWorkspaceForm
                  setIsIssuedAsNFTChecked={setIsIssuedAsNFTChecked}
                  isIssuedAsNFTChecked={isIssuedAsNFTChecked}
                  onDeleteVideo={handleDeleteVideo}
                  selectedVideoTab={selectedVideoTab}
                  onThumbnailFileChange={handleThumbnailFileChange}
                  onVideoFileChange={handleVideoFileChange}
                  fee={0}
                  thumbnailHashPromise={thumbnailHashPromise}
                  videoHashPromise={videoHashPromise}
                  register={register}
                  control={control}
                  createSubmitHandler={createSubmitHandler}
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  reset={reset}
                  formState={formState}
                />
              ) : (
                <NFTWorkspaceForm
                  videoId={selectedVideoTab?.id ?? ''}
                  onGoBack={() => setIsIssuedAsNFTChecked(false)}
                  isEdit={!selectedVideoTab?.isDraft}
                  fee={0}
                />
              )}
            </CSSTransition>
          </SwitchTransition>
        </Container>
      </CSSTransition>
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
