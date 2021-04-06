import React, { useCallback, useEffect, useState } from 'react'
import { isValid } from 'date-fns'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { FileRejection } from 'react-dropzone'
import { Control, Controller, DeepMap, FieldError, useForm, UseFormMethods } from 'react-hook-form'
import { transitions } from '@/shared/theme'
import { Location } from 'history'
import {
  Button,
  Checkbox,
  Datepicker,
  FormField,
  HeaderTextField,
  Icon,
  MultiFileSelect,
  RadioButton,
  Select,
  SelectedItem,
  Textarea,
} from '@/shared/components'
import { textFieldValidation, requiredValidation } from '@/utils/formValidationOptions'
import { useCategories } from '@/api/hooks'
import { languages } from '@/config/languages'
import { useDrafts } from '@/hooks'
import { TabType, useUploadVideoActionSheet } from './useVideoActionSheet'
import {
  ACTION_SHEET_BAR_HEIGHT,
  ButtonsContainer,
  Container,
  Content,
  DrawerOverlay,
  FileDropperContainer,
  FormContainer,
  plusIconStyle,
  StyledActionBar,
  StyledCheckboxContainer,
  StyledRadioContainer,
  Tab,
  TabsContainer,
  TabTitle,
  Topbar,
} from './UploadEditVideoActionSheet.style'
import { relativeRoutes } from '@/config/routes'
import { UseSelectStateChange } from 'downshift'

const channelId = 'f636f2fd-c047-424e-baab-6e6cfb3e2780' // mocking test channel id

const visibilityOptions: SelectedItem[] = [
  { name: 'Public (Anyone can see this video)', value: 'public' },
  { name: 'Unlisted (Only people with a link can see this video)', value: 'unlisted' },
]

type FormInputs = {
  title: string
  description: string
  selectedVideoVisibility: string | null
  selectedVideoLanguage: string | null
  selectedVideoCategory: string | null
  hasMarketing: boolean | null
  publishedBeforeJoystream: Date | null
  isExplicit: boolean | null
}

export type SheetState = 'closed' | 'open' | 'minimized'
export const UploadEditVideoActionSheet: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // sheet state
  const uploadVideoMatch = useMatch({ path: `${relativeRoutes.studio.uploadVideo()}` })
  const [sheetState, setSheetState] = useState<SheetState>('closed')
  const [containerRef, containerBounds] = useMeasure()
  const [actionBarRef, actionBarBounds] = useMeasure()
  const [cachedLocation, setCachedLocation] = useState<Location>()

  // animations overlay
  const [DrawerOverlayAnimationProps, setDrawerOverlayAnimationProps] = useSpring(() => ({
    from: { opacity: '0' },
    duration: transitions.timings.sharp,
    opacity: '0',
  }))
  useEffect(() => {
    if (sheetState === 'open') setDrawerOverlayAnimationProps({ opacity: 1 })
    if (sheetState === 'minimized') setDrawerOverlayAnimationProps({ opacity: 0 })
    if (sheetState === 'closed') setDrawerOverlayAnimationProps({ opacity: 0 })
  }, [setDrawerOverlayAnimationProps, sheetState])

  // animations sheet
  // 1 extra px to account for the border
  const transform = containerBounds.height ? containerBounds.height - ACTION_SHEET_BAR_HEIGHT + 1 : 10000
  const [animationProps, setAnimationProps] = useSpring(() => ({
    from: { transform: 'translateY(10000px)' },
    duration: transitions.timings.sharp,
    transform: 'translateY(10000px)',
    opacity: '1',
  }))
  useEffect(() => {
    if (sheetState === 'open') setAnimationProps({ transform: 'translateY(0)', opacity: 1 })
    if (sheetState === 'minimized') setAnimationProps({ transform: `translateY(${transform}px)`, opacity: 1 })
    if (sheetState === 'closed')
      setAnimationProps({ transform: `translateY(${containerBounds.height || 10000}px)`, opacity: 0 })
  }, [containerBounds.height, setAnimationProps, sheetState, transform])

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
  const { register, watch, handleSubmit, control, setValue: setFormValue, reset, clearErrors, errors } = useForm<
    FormInputs
  >({
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
  const watchAllFormFields = watch()

  // Tabs
  const { drafts, removeDraft, removeAllDrafts, addDraft, updateDraft } = useDrafts('video', channelId)
  const {
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } = useUploadVideoActionSheet()
  const handleTabSelect = useCallback(
    (tab?: TabType) => {
      // reset({
      //   title: '',
      //   selectedVideoVisibility: null,
      //   selectedVideoLanguage: null,
      //   selectedVideoCategory: null,
      //   description: '',
      //   hasMarketing: false,
      //   publishedBeforeJoystream: null,
      //   isExplicit: '',
      // })
      if (tab) {
        setSelectedVideoTab(tab)
        setFormValue('title', tab?.title)
        setFormValue('description', tab.description)
        setFormValue(
          'selectedVideoVisibility',
          tab.isPublic === undefined ? null : tab.isPublic ? 'public' : 'unlisted'
        )
        setFormValue('selectedVideoLanguage', tab.language ?? null)
        setFormValue('selectedVideoCategory', tab.categoryId ?? null)
        setFormValue('publishedBeforeJoystream', tab.publishedBeforeJoystream ?? null)
        setFormValue('hasMarketing', tab.hasMarketing ?? null)
        setFormValue('isExplicit', tab.isExplicit === undefined ? null : tab.isExplicit)
      }
    },
    [setFormValue, setSelectedVideoTab]
  )
  const handleClose = useCallback(() => {
    navigate(cachedLocation?.pathname ?? relativeRoutes.studio.index())
    setSheetState('closed')
  }, [cachedLocation?.pathname, navigate])
  const handleAddNewTab = useCallback(async () => {
    const newDraft = await addDraft({
      channelId: channelId,
      title: 'New Draft',
      // description: 'asdgasdgjkahskldhjklahjskldhjlhjskljlkhjsdljal;sjdlja;sdj;ajl;dj;ajsd;ljal;d',
      // isPublic: false,
      // language: 'es',
      // categoryId: '02c287dc-0b35-41f8-a494-9d98e312fbff',
      // hasMarketing: true,
      // isExplicit: true,
      // publishedBeforeJoystream: '28/12/1994',
    })
    addVideoTab(newDraft)
    handleTabSelect(newDraft)
  }, [addDraft, addVideoTab, handleTabSelect])
  const handleMinimize = useCallback(() => {
    setSheetState?.('minimized')
    navigate(cachedLocation?.pathname ?? relativeRoutes.studio.index())
  }, [cachedLocation?.pathname, navigate])
  const handleOpen = useCallback(() => {
    if (sheetState !== 'open') {
      if (videoTabs.length === 0) {
        console.log('new tab on open')
        handleAddNewTab()
      }
      setSheetState('open')
      navigate(relativeRoutes.studio.uploadVideo())
    }
  }, [handleAddNewTab, navigate, sheetState, videoTabs.length])

  useEffect(() => {
    if (uploadVideoMatch) {
      handleOpen()
    } else if (sheetState === 'open') {
      handleMinimize()
    }
  }, [uploadVideoMatch, sheetState, handleOpen, handleMinimize])
  useEffect(() => {
    handleTabSelect(selectedVideoTab)
  }, [handleTabSelect, selectedVideoTab])
  useEffect(() => {
    if (!uploadVideoMatch) {
      setCachedLocation(location)
    }
  }, [location, cachedLocation, uploadVideoMatch])

  const handleRemoveTab = (tab: TabType) => {
    removeVideoTab(tab)
    console.log('remove tab')
    // we are closing the last tab
    if (videoTabs.length === 1) {
      handleClose()
      console.log('close if no tabs')
    }
  }
  return (
    <>
      <DrawerOverlay style={{ ...DrawerOverlayAnimationProps }} />
      <Container ref={containerRef} role="dialog" style={{ ...animationProps }}>
        <TabsBar
          sheetState={sheetState}
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          handleAddNewTab={handleAddNewTab}
          handleRemoveTab={handleRemoveTab}
          handleTabSelect={handleTabSelect}
          handleResetVideoTabs={resetVideoTabs}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleMinimize={handleMinimize}
        />
        <Content height={transform - actionBarBounds.height}>
          <FileDropperContainer>
            <MultiFileSelect
              files={files}
              error={fileSelectError}
              onError={setFileSelectError}
              onDropRejected={handleFileRejections}
              onChangeFiles={setFiles}
              croppedImageUrl={croppedImageUrl}
              onCropImage={setCroppedImageUrl}
            />
          </FileDropperContainer>
          <Form
            control={control}
            titleRef={register(textFieldValidation('Video Title', 3, 20))}
            descriptionRef={register(textFieldValidation('Description', 0, 2160))}
            height={transform - actionBarBounds.height}
            errors={errors}
            clearErrors={clearErrors}
            setFormValue={setFormValue}
          />
        </Content>
        <StyledActionBar
          ref={actionBarRef}
          primaryText={`Fee: ${99} Joy`}
          secondaryText="Every change to the blockchain requires making a nominal transaction."
          primaryButtonText={`Start Publishing`}
          detailsText="Video details saved as draft (2 min ago)"
          tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
          detailsTextIcon="info"
        />
      </Container>
    </>
  )
}

type TabsBarProps = {
  sheetState: SheetState
  videoTabs: TabType[]
  selectedVideoTab?: TabType
  handleAddNewTab: () => void
  handleRemoveTab: (tab: TabType) => void
  handleResetVideoTabs: () => void
  handleTabSelect: (tab: TabType) => void
  handleMinimize: () => void
  handleOpen: () => void
  handleClose: () => void
}
const TabsBar: React.FC<TabsBarProps> = ({
  videoTabs,
  handleAddNewTab,
  handleTabSelect,
  handleRemoveTab,
  handleResetVideoTabs,
  handleMinimize,
  handleOpen,
  handleClose,
  sheetState,
  selectedVideoTab,
}) => (
  <Topbar>
    <TabsContainer>
      <Button variant="tertiary" icon="plus" iconCss={plusIconStyle} onClick={handleAddNewTab} />
      {videoTabs.map((tab) => (
        <Tab key={tab.id} selected={tab.id === selectedVideoTab?.id} onClick={() => handleTabSelect(tab)}>
          <TabTitle variant="subtitle2">{tab.title}</TabTitle>
          <Button size="small" icon="close" variant="tertiary" onClick={() => handleRemoveTab(tab)}></Button>
        </Tab>
      ))}
    </TabsContainer>
    <ButtonsContainer>
      <Button
        icon="minus"
        variant="tertiary"
        onClick={() => {
          if (sheetState === 'open') {
            handleMinimize()
          } else {
            handleOpen()
          }
        }}
      ></Button>
      <Button
        icon="close"
        variant="tertiary"
        onClick={() => {
          handleClose()
          handleResetVideoTabs()
        }}
      ></Button>
    </ButtonsContainer>
  </Topbar>
)

type FormProps = {
  height: number
  titleRef: React.Ref<HTMLInputElement> | undefined
  descriptionRef: React.Ref<HTMLTextAreaElement> | undefined
  errors: DeepMap<FormInputs, FieldError>
  control: Control<FormInputs>
  clearErrors: UseFormMethods<FormInputs>['clearErrors']
  setFormValue: UseFormMethods<FormInputs>['setValue']
}
const Form: React.FC<FormProps> = ({
  height,
  errors,
  control,
  descriptionRef,
  titleRef,
  setFormValue,
  clearErrors,
}) => {
  const { categories, error: categoriesError } = useCategories()
  const createFormSelectFieldHandler = (name: keyof FormInputs) => (changes: UseSelectStateChange<SelectedItem>) => {
    setFormValue(name, changes.selectedItem?.value)
    clearErrors(name)
  }
  const createIsExplicitHandler = (value: boolean) => () => {
    clearErrors('isExplicit')
    setFormValue('isExplicit', value)
  }
  if (categoriesError) throw categoriesError
  return (
    <FormContainer height={height}>
      <HeaderTextField
        name="title"
        ref={titleRef}
        value=""
        placeholder="Insert Video Title"
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <Textarea
        name="description"
        ref={descriptionRef}
        maxLength={2160}
        placeholder="Add video description"
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <FormField title="Video Visibility">
        <Controller
          name="selectedVideoVisibility"
          control={control}
          rules={requiredValidation('Video visibility')}
          render={({ value }) => (
            <Select
              value={visibilityOptions.find((o) => o.value === value) ?? null}
              items={visibilityOptions}
              onChange={createFormSelectFieldHandler('selectedVideoVisibility')}
              error={!!errors.selectedVideoVisibility && !value}
              helperText={errors.selectedVideoVisibility?.message}
            />
          )}
        />
      </FormField>
      <FormField title="Video Language">
        <Controller
          name="selectedVideoLanguage"
          control={control}
          rules={requiredValidation('Video language')}
          render={({ value }) => (
            <Select
              value={languages.find((l) => l.value === value) ?? null}
              items={[...languages]}
              onChange={createFormSelectFieldHandler('selectedVideoLanguage')}
              error={!!errors.selectedVideoLanguage && !value}
              helperText={errors.selectedVideoLanguage?.message}
            />
          )}
        />
      </FormField>
      <FormField title="Video Category">
        <Controller
          name="selectedVideoCategory"
          control={control}
          rules={requiredValidation('Video category')}
          render={({ value }) => (
            <Select
              value={
                (categories
                  ?.map((category) => ({ name: category.name, value: category.id }))
                  ?.find((c) => c.value === value) as SelectedItem) ?? null
              }
              items={
                (categories?.map((category) => ({ name: category.name, value: category.id })) as SelectedItem[]) ?? []
              }
              onChange={createFormSelectFieldHandler('selectedVideoCategory')}
              error={!!errors.selectedVideoCategory && !value}
              helperText={errors.selectedVideoCategory?.message}
            />
          )}
        />
      </FormField>
      <FormField
        title="Published Before"
        description="If the content you are publishing was originally published outside of Joystream, please provide the original publication date."
      >
        <Controller
          name="publishedBeforeJoystream"
          control={control}
          rules={{ validate: (publishedBeforeJoystream) => isValid(publishedBeforeJoystream) }}
          render={({ value }) => (
            <Datepicker
              value={value}
              onChange={(publishedBeforeJoystream) =>
                setFormValue('publishedBeforeJoystream', publishedBeforeJoystream)
              }
              onBlur={() => clearErrors('publishedBeforeJoystream')}
              error={!!errors.publishedBeforeJoystream}
            />
          )}
        />
      </FormField>
      <FormField title="Marketing" description="Please select whether your video contains paid promotions">
        <StyledCheckboxContainer>
          <Controller
            as={Checkbox}
            name="hasMarketing"
            rules={{ required: true }}
            error={!!errors.hasMarketing}
            control={control}
            value={false}
            label="My video features a paid promotion material"
          />
        </StyledCheckboxContainer>
      </FormField>
      <FormField title="Content Rating" description="Please select whether your video contains explicit material (sex, violence, etc.)">
        <Controller
          name="isExplicit"
          control={control}
          rules={{ required: true }}
          render={({ value }) => (
            <StyledRadioContainer>
              <RadioButton
                value={'false'}
                label="All audiences"
                onChange={createIsExplicitHandler(false)}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
              />
              <RadioButton
                value={'true'}
                label="Mature"
                onChange={createIsExplicitHandler(true)}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
              />
            </StyledRadioContainer>
          )}
        />
      </FormField>
    </FormContainer>
  )
}
