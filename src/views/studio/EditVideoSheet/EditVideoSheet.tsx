import React, { useCallback, useEffect, useState } from 'react'
import { isValid } from 'date-fns'
import { FileRejection } from 'react-dropzone'
import { Control, Controller, DeepMap, FieldError, useForm, UseFormMethods } from 'react-hook-form'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import {
  Checkbox,
  Datepicker,
  FormField,
  HeaderTextField,
  IconButton,
  MultiFileSelect,
  RadioButton,
  Select,
  TextArea,
} from '@/shared/components'
import { textFieldValidation, requiredValidation } from '@/utils/formValidationOptions'
import { useCategories } from '@/api/hooks'
import { languages } from '@/config/languages'
import { useDrafts } from '@/hooks'
import { EditVideoSheetState, EditVideoSheetTab, useEditVideoSheet } from '@/hooks/useEditVideoSheet'
import {
  ButtonsContainer,
  Container,
  Content,
  DrawerOverlay,
  FileDropperContainer,
  FormContainer,
  StyledActionBar,
  StyledCheckboxContainer,
  StyledRadioContainer,
  Tab,
  TabsContainer,
  TabTitle,
  Topbar,
} from './EditVideoSheet.style'
import { SelectItem } from '@/shared/components/Select/Select'
import { SvgGlyphClose, SvgGlyphMinus, SvgGlyphPlus } from '@/shared/icons'
import { useEditVideoSheetAnimations } from './animations'

const channelId = 'f636f2fd-c047-424e-baab-6e6cfb3e2780' // mocking test channel id

const visibilityOptions: SelectItem[] = [
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
  const handleTabSelect = useCallback(
    (tab?: EditVideoSheetTab) => {
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

  const handleOpen = () => {
    if (sheetState === 'open') {
      return
    }

    if (videoTabs.length === 0) {
      handleAddNewTab()
    }

    setSheetState('open')
  }

  const handleMinimize = () => {
    setSheetState('minimized')
  }

  const handleClose = () => {
    setSheetState('closed')
  }

  useEffect(() => {
    handleTabSelect(selectedVideoTab)
  }, [handleTabSelect, selectedVideoTab])

  const handleRemoveTab = (tab: EditVideoSheetTab) => {
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
      <DrawerOverlay style={{ ...drawerOverlayAnimationProps }} />
      <Container role="dialog" style={{ ...sheetAnimationProps }}>
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
        <Content>
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
            errors={errors}
            clearErrors={clearErrors}
            setFormValue={setFormValue}
          />
        </Content>
        <StyledActionBar
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
  sheetState: EditVideoSheetState
  videoTabs: EditVideoSheetTab[]
  selectedVideoTab?: EditVideoSheetTab
  handleAddNewTab: () => void
  handleRemoveTab: (tab: EditVideoSheetTab) => void
  handleResetVideoTabs: () => void
  handleTabSelect: (tab: EditVideoSheetTab) => void
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
      <IconButton variant="tertiary" onClick={handleAddNewTab}>
        <SvgGlyphPlus />
      </IconButton>
      {videoTabs.map((tab) => (
        <Tab key={tab.id} selected={tab.id === selectedVideoTab?.id} onClick={() => handleTabSelect(tab)}>
          <TabTitle variant="subtitle2">{tab.title}</TabTitle>
          <IconButton size="small" variant="tertiary" onClick={() => handleRemoveTab(tab)}>
            <SvgGlyphClose />
          </IconButton>
        </Tab>
      ))}
    </TabsContainer>
    <ButtonsContainer>
      <IconButton
        variant="tertiary"
        onClick={() => {
          if (sheetState === 'open') {
            handleMinimize()
          } else {
            handleOpen()
          }
        }}
      >
        <SvgGlyphMinus />
      </IconButton>
      <IconButton
        variant="tertiary"
        onClick={() => {
          handleClose()
          handleResetVideoTabs()
        }}
      >
        <SvgGlyphClose />
      </IconButton>
    </ButtonsContainer>
  </Topbar>
)

type FormProps = {
  titleRef: React.Ref<HTMLInputElement> | undefined
  descriptionRef: React.Ref<HTMLTextAreaElement> | undefined
  errors: DeepMap<FormInputs, FieldError>
  control: Control<FormInputs>
  clearErrors: UseFormMethods<FormInputs>['clearErrors']
  setFormValue: UseFormMethods<FormInputs>['setValue']
}
const Form: React.FC<FormProps> = ({ errors, control, descriptionRef, titleRef, setFormValue, clearErrors }) => {
  const { categories, error: categoriesError } = useCategories()
  const createFormSelectFieldHandler = (name: keyof FormInputs) => (value?: string | null) => {
    setFormValue(name, value)
    clearErrors(name)
  }
  const createIsExplicitHandler = (value: boolean) => () => {
    clearErrors('isExplicit')
    setFormValue('isExplicit', value)
  }
  if (categoriesError) throw categoriesError
  return (
    <FormContainer>
      <HeaderTextField
        name="title"
        ref={titleRef}
        value=""
        placeholder="Insert Video Title"
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextArea
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
              value={value}
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
              value={value ?? null}
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
              value={value ?? null}
              items={
                (categories?.map((category) => ({ name: category.name, value: category.id })) as SelectItem[]) ?? []
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
      <FormField
        title="Content Rating"
        description="Please select whether your video contains explicit material (sex, violence, etc.)"
      >
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
