import React, { useCallback, useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { MultiFileSelect } from '@/shared/components'
import { textFieldValidation } from '@/utils/formValidationOptions'
import { EditVideoSheetState, EditVideoSheetTab, useDrafts, useEditVideoSheet, useOverlayManager } from '@/hooks'
import { Container, Content, DrawerOverlay, StyledActionBar } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm, FormInputs } from './EditVideoForm'
import { SvgGlyphInfo } from '@/shared/icons'

const channelId = 'f636f2fd-c047-424e-baab-6e6cfb3e2780' // mocking test channel id

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
  const { lockScroll, unlockScroll } = useOverlayManager()
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  // forms state
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)
  const handleFileRejections = (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setFileSelectError(invalidSize.message)
      invalidType && setFileSelectError(invalidType.message)
    }
  }
  const { register, control, setValue: setFormValue, reset, clearErrors, errors } = useForm<FormInputs>({
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

  // Tabs
  const { addDraft } = useDrafts('video', channelId)

  const selectTab = useCallback(
    (tab: EditVideoSheetTab) => {
      setSelectedVideoTab(tab)
      reset({
        title: tab?.title,
        description: tab.description,
        selectedVideoVisibility: tab.isPublic === undefined ? null : tab.isPublic ? 'public' : 'unlisted',
        selectedVideoLanguage: tab.language ?? null,
        selectedVideoCategory: tab.categoryId ?? null,
        hasMarketing: tab.hasMarketing ?? null,
        publishedBeforeJoystream: tab.publishedBeforeJoystream ?? null,
        isExplicit: tab.isExplicit === undefined ? null : tab.isExplicit,
      })
    },
    [reset, setSelectedVideoTab]
  )

  const addNewTab = useCallback(async () => {
    const newDraft = await addDraft({
      channelId: channelId,
      title: 'New Draft',
    })
    addVideoTab(newDraft)
    selectTab(newDraft)
  }, [addDraft, addVideoTab, selectTab])

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (sheetState === 'open') {
      if (videoTabs.length === 0) {
        addNewTab()
      }
      lockScroll()
    }
    if (sheetState === 'closed' || sheetState === 'minimized') {
      unlockScroll()
    }
  }, [sheetState, cachedSheetState, videoTabs.length, addNewTab, lockScroll, unlockScroll])

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
  return (
    <>
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container role="dialog" style={sheetAnimationProps}>
        <EditVideoTabsBar
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          onAddNewTabClick={addNewTab}
          onRemoveTabClick={removeTab}
          onTabSelect={selectTab}
          onCloseClick={closeSheet}
          onToggleMinimizedClick={toggleMinimizedSheet}
        />
        <Content>
          <MultiFileSelect
            files={files}
            error={fileSelectError}
            onError={setFileSelectError}
            onDropRejected={handleFileRejections}
            onChangeFiles={setFiles}
            croppedImageUrl={croppedImageUrl}
            onCropImage={setCroppedImageUrl}
          />
          <EditVideoForm
            control={control}
            titleRef={register(textFieldValidation('Video Title', 3, 20))}
            descriptionRef={register(textFieldValidation('Description', 0, 2160))}
            errors={errors}
            clearErrors={clearErrors}
            setFormValue={setFormValue}
          />
        </Content>
        <StyledActionBar
          fee={99}
          primaryButtonText="Publish video"
          detailsText="Drafts are saved automatically"
          tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
          detailsTextIcon={<SvgGlyphInfo />}
        />
      </Container>
    </>
  )
}
