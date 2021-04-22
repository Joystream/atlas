import React, { useCallback, useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { MultiFileSelect } from '@/shared/components'
import { textFieldValidation } from '@/utils/formValidationOptions'
import {
  EditVideoSheetState,
  EditVideoSheetTab,
  useDrafts,
  VideoDraft,
  useEditVideoSheet,
  useOverlayManager,
  useActiveUser,
} from '@/hooks'
import { Container, Content, DrawerOverlay, StyledActionBar } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm, FormInputs } from './EditVideoForm'
import { SvgGlyphInfo } from '@/shared/icons'

type FileStateWithDraftId = {
  id?: string
  files: FileState
}

type CroppedImageUrlsWithDraftId = {
  id?: string
  url: string | null
}

export const EditVideoSheet: React.FC = () => {
  // sheet state
  const {
    sheetState,
    setSheetState,
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } = useEditVideoSheet()
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const { lockScroll, unlockScroll } = useOverlayManager()
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  // forms state
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileStateWithDraftId[]>([])
  const [croppedImageUrls, setCroppedImageUrls] = useState<CroppedImageUrlsWithDraftId[]>([])
  const handleFileRejections = (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setFileSelectError(invalidSize.message)
      invalidType && setFileSelectError(invalidType.message)
    }
  }
  const { register, control, setValue: setFormValue, handleSubmit, reset, clearErrors, errors } = useForm<FormInputs>({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      selectedVideoVisibility: 'public',
      selectedVideoLanguage: 'en',
      selectedVideoCategory: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: null,
    },
  })
  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  const resetFields = (video: VideoDraft | null) => ({
    title: video?.title,
    description: video?.description,
    selectedVideoVisibility: video?.isPublic === undefined ? null : video.isPublic ? 'public' : 'unlisted',
    selectedVideoLanguage: video?.language ?? null,
    selectedVideoCategory: video?.categoryId ?? null,
    hasMarketing: video?.hasMarketing ?? null,
    publishedBeforeJoystream: video?.publishedBeforeJoystream ?? '',
    isExplicit: video?.isExplicit === undefined ? null : video.isExplicit,
  })

  // Tabs
  const { addDraft, drafts, getDraft } = useDrafts('video', channelId)

  const selectTab = useCallback(
    async (tab: EditVideoSheetTab) => {
      const currentDraft = await getDraft(tab.id)
      currentDraft && reset(resetFields(currentDraft))
      setSelectedVideoTab(tab)
    },
    [getDraft, reset, setSelectedVideoTab]
  )

  const addNewTab = useCallback(async () => {
    const newDraft = await addDraft({
      channelId: channelId,
      title: 'New Draft',
    })
    addVideoTab(newDraft)
    reset(resetFields(newDraft))
    setSelectedVideoTab(newDraft)
  }, [addDraft, channelId, addVideoTab, reset, setSelectedVideoTab])

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (sheetState === 'open') {
      selectedVideoTab && reset(resetFields(selectedVideoTab))
      if (videoTabs.length === 0) {
        addNewTab()
      }
      lockScroll()
    }
    if (sheetState === 'closed' || sheetState === 'minimized') {
      unlockScroll()
    }
  }, [sheetState, cachedSheetState, videoTabs.length, addNewTab, lockScroll, unlockScroll, reset, selectedVideoTab])

  useEffect(() => {
    if (sheetState === 'closed') {
      return
    }
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'Do you want to leave this page? Changes that you made may not be saved.'
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [sheetState])

  const toggleMinimizedSheet = () => {
    setSheetState(sheetState === 'open' ? 'minimized' : 'open')
  }

  const closeSheet = () => {
    resetVideoTabs()
    setSheetState('closed')
  }

  const removeTab = (tab: EditVideoSheetTab) => {
    removeVideoTab(tab)
    // we are closing the last tab
    if (videoTabs.length === 1) {
      closeSheet()
    }
  }

  const handleChangeFiles = (changeFiles: FileState) => {
    const hasFiles = files.some((f) => f.id === selectedVideoTab?.id)
    if (hasFiles) {
      const newFiles = files.map((f) => {
        if (f.id === selectedVideoTab?.id) {
          return { ...f, ...changeFiles }
        }
        return f
      })
      setFiles(newFiles)
    } else {
      setFiles([...files, { id: selectedVideoTab?.id, files: changeFiles }])
    }
  }

  const handleCropImage = (image: string | null) => {
    const hasImage = croppedImageUrls.some((item) => item.id === selectedVideoTab?.id)
    if (hasImage) {
      const newImages = croppedImageUrls.map((item) => {
        if (item.id === selectedVideoTab?.id) {
          return { ...item, url: image }
        }
        return item
      })
      setCroppedImageUrls(newImages)
    } else {
      setCroppedImageUrls([...croppedImageUrls, { id: selectedVideoTab?.id, url: image }])
    }
  }

  const currentFilesWithDraftId = files.find((f) => f.id === selectedVideoTab?.id) || {
    draftId: selectedVideoTab?.id,
    files: {
      video: null,
      image: null,
    },
  }

  const currentCroppedImgUrl = croppedImageUrls.find((item) => item.id === selectedVideoTab?.id)?.url || null

  const videoTabsWithTitle = videoTabs
    .map((tab) => {
      const draft = drafts.find((draft) => draft.id === tab.id)
      const filename = files.find((item) => item.id === tab.id)?.files.video?.name

      if (draft?.title === 'New Draft' && filename) {
        return { ...tab, title: filename }
      }
      return { ...tab, title: draft?.title }
    })
    .filter((tab) => tab.title !== undefined)

  return (
    <>
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container role="dialog" style={sheetAnimationProps}>
        <EditVideoTabsBar
          videoTabs={videoTabsWithTitle}
          selectedVideoTab={selectedVideoTab}
          onAddNewTabClick={addNewTab}
          onRemoveTabClick={removeTab}
          onTabSelect={selectTab}
          onCloseClick={closeSheet}
          onToggleMinimizedClick={toggleMinimizedSheet}
        />
        <Content>
          <MultiFileSelect
            files={currentFilesWithDraftId.files}
            error={fileSelectError}
            onError={setFileSelectError}
            onDropRejected={handleFileRejections}
            onChangeFiles={handleChangeFiles}
            croppedImageUrl={currentCroppedImgUrl}
            onCropImage={handleCropImage}
          />
          <EditVideoForm
            control={control}
            titleRef={register(textFieldValidation('Video Title', 3, 20))}
            descriptionRef={register(textFieldValidation('Description', 0, 2160))}
            errors={errors}
            clearErrors={clearErrors}
            setFormValue={setFormValue}
            draftId={selectedVideoTab?.id}
          />
        </Content>
        <StyledActionBar
          fee={99}
          primaryButtonText="Publish video"
          onConfirmClick={onSubmit}
          detailsText="Drafts are saved automatically"
          tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
          detailsTextIcon={<SvgGlyphInfo />}
        />
      </Container>
    </>
  )
}
