import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm, FieldNamesMarkedBoolean } from 'react-hook-form'
import { debounce } from 'lodash'
import { useCategories } from '@/api/hooks'
import {
  useDrafts,
  useActiveUser,
  EditVideoSheetTab,
  useEditVideoSheetTabData,
  EditVideoFormFields,
  useEditVideoSheet,
} from '@/hooks'
import {
  Checkbox,
  Datepicker,
  FormField,
  MultiFileSelect,
  RadioButton,
  Select,
  SelectItem,
  TextArea,
} from '@/shared/components'
import { requiredValidation, pastDateValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { languages } from '@/config/languages'
import {
  InputsContainer,
  StyledHeaderTextField,
  StyledRadioContainer,
  DeleteVideoContainer,
  DeleteVideoButton,
  FormWrapper,
} from './EditVideoForm.style'
import { StyledActionBar } from '@/views/studio/EditVideoSheet/EditVideoSheet.style'
import { SvgGlyphInfo } from '@/shared/icons'
import { FileErrorType, ImageInputFile, VideoInputFile } from '@/shared/components/MultiFileSelect/MultiFileSelect'

const visibilityOptions: SelectItem<boolean>[] = [
  { name: 'Public (Anyone can see this video)', value: true },
  { name: 'Unlisted (Only people with a link can see this video)', value: false },
]

type EditVideoFormProps = {
  onSubmit: (data: EditVideoFormFields, dirtyFields: FieldNamesMarkedBoolean<EditVideoFormFields>) => void
  onThumbnailFileChange: (file: Blob) => void
  onVideoFileChange: (file: Blob) => void
  selectedVideoTab?: EditVideoSheetTab
}

export const EditVideoForm: React.FC<EditVideoFormProps> = ({
  selectedVideoTab,
  onSubmit,
  onThumbnailFileChange,
  onVideoFileChange,
}) => {
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const isEdit = !selectedVideoTab?.isDraft

  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [cachedSelectedVideoTabId, setCachedSelectedVideoTabId] = useState<string | null>(null)
  const { addDraft, updateDraft } = useDrafts('video', channelId)
  const { updateSelectedVideoTab, setSelectedVideoTabCachedAssets } = useEditVideoSheet()

  const { categories, error: categoriesError } = useCategories()
  const { data: tabData, loading: tabDataLoading, error: tabDataError } = useEditVideoSheetTabData(selectedVideoTab)

  if (categoriesError) {
    throw categoriesError
  }

  if (tabDataError) {
    throw tabDataError
  }

  const {
    register,
    control,
    handleSubmit: createSubmitHandler,
    errors,
    getValues,
    setValue,
    reset,
    formState: { dirtyFields, isDirty },
  } = useForm<EditVideoFormFields>({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      isPublic: true,
      language: 'en',
      category: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: null,
      assets: {
        video: null,
        thumbnail: null,
      },
    },
  })

  // we pass the functions explicitly so the debounced function doesn't need to change when those functions change
  const debouncedDraftSave = useRef(
    debounce(
      (
        tab: EditVideoSheetTab,
        data: EditVideoFormFields,
        addDraftFn: typeof addDraft,
        updateDraftFn: typeof updateDraft,
        updateSelectedTabFn: typeof updateSelectedVideoTab
      ) => {
        if (tab.isFresh) {
          addDraftFn(data, tab.id)
          updateSelectedTabFn({ isFresh: false })
        } else {
          updateDraftFn(tab.id, data)
        }
      },
      700
    )
  )

  useEffect(() => {
    if (tabDataLoading || !tabData || !selectedVideoTab) {
      return
    }

    // only run this hook if the selected tab changed
    if (selectedVideoTab.id === cachedSelectedVideoTabId) {
      return
    }
    setCachedSelectedVideoTabId(selectedVideoTab.id)

    // flush any possible changes to the edited draft
    debouncedDraftSave.current.flush()

    setFileSelectError(null)
    reset(tabData)
  }, [selectedVideoTab, cachedSelectedVideoTabId, reset, tabDataLoading, tabData, updateSelectedVideoTab])

  const handleSubmit = createSubmitHandler(async (data: EditVideoFormFields) => {
    // do initial validation
    if (!isEdit && !data.assets.video?.blob) {
      setFileSelectError('Video file cannot be empty')
      return
    }
    if ((!isEdit || dirtyFields.assets?.thumbnail) && !data.assets.thumbnail?.blob) {
      setFileSelectError('Thumbnail cannot be empty')
    }

    await onSubmit(data, dirtyFields)
  })

  // with react-hook-form v7 it's possible to call watch((data) => update()), we should use that instead when we upgrade
  const handleFormChange = () => {
    if (!selectedVideoTab?.isDraft) {
      return
    }
    const data = getValues()
    debouncedDraftSave.current(selectedVideoTab, data, addDraft, updateDraft, updateSelectedVideoTab)
  }

  const handleVideoFileChange = async (video: VideoInputFile | null) => {
    const updatedAssets = {
      ...getValues('assets'),
      video,
    }
    setValue('assets', updatedAssets, { shouldDirty: true })
    if (selectedVideoTab?.isDraft) {
      setSelectedVideoTabCachedAssets(updatedAssets)
    }
    if (video?.blob) {
      onVideoFileChange(video.blob)
    }

    if (!dirtyFields.title && video?.title) {
      // TODO: don't change it if the draft was saved and reloaded
      const videoNameWithoutExtension = video.title.replace(/\.[^.]+$/, '')
      setValue('title', videoNameWithoutExtension, { shouldDirty: true })
      handleFormChange()
    }
  }

  const handleThumbnailFileChange = async (thumbnail: ImageInputFile | null) => {
    const updatedAssets = {
      ...getValues('assets'),
      thumbnail,
    }
    setValue('assets', updatedAssets, { shouldDirty: true })
    if (selectedVideoTab?.isDraft) {
      setSelectedVideoTabCachedAssets(updatedAssets)
    }
    if (thumbnail?.blob) {
      onThumbnailFileChange(thumbnail.blob)
    }
  }

  const handleFileSelectError = async (errorCode: FileErrorType | null) => {
    if (!errorCode) {
      setFileSelectError(null)
    } else if (errorCode === 'file-invalid-type') {
      setFileSelectError('Invalid file type')
    } else if (errorCode === 'file-too-large') {
      setFileSelectError('File too large')
    } else {
      console.error({ message: 'Unknown file select error', code: errorCode })
      setFileSelectError('Unknown error')
    }
  }

  const handleDeleteVideo = () => {
    // TODO add logic for deleting video
  }

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  return (
    <>
      <FormWrapper>
        <Controller
          name="assets"
          control={control}
          render={({ value }) => (
            <MultiFileSelect
              files={value}
              onVideoChange={handleVideoFileChange}
              onThumbnailChange={handleThumbnailFileChange}
              editMode={isEdit}
              error={fileSelectError}
              onError={handleFileSelectError}
              // TODO: change
              maxVideoSize={2 * 1024 * 1024 * 1024}
            />
          )}
        />
        <InputsContainer>
          <StyledHeaderTextField
            name="title"
            ref={register(textFieldValidation('Video Title', 3, 40))}
            onChange={handleFormChange}
            placeholder="Insert Video Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextArea
            name="description"
            ref={register(textFieldValidation('Description', 0, 2160))}
            onChange={handleFormChange}
            maxLength={2160}
            placeholder="Add video description"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <FormField title="Video Visibility">
            <Controller
              name="isPublic"
              control={control}
              rules={{
                validate: (value) => value !== null,
              }}
              render={({ value, onChange }) => (
                <Select
                  value={value}
                  items={visibilityOptions}
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                  error={!!errors.isPublic && !value}
                  helperText={errors.isPublic ? 'Video visibility must be selected' : ''}
                />
              )}
            />
          </FormField>
          <FormField title="Video Language">
            <Controller
              name="language"
              control={control}
              rules={requiredValidation('Video language')}
              render={({ value, onChange }) => (
                <Select
                  value={value ?? null}
                  items={languages}
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                  error={!!errors.language && !value}
                  helperText={errors.language?.message}
                />
              )}
            />
          </FormField>
          <FormField title="Video Category">
            <Controller
              name="category"
              control={control}
              rules={requiredValidation('Video category')}
              render={({ value, onChange }) => (
                <Select
                  value={value ?? null}
                  items={categoriesSelectItems}
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                  error={!!errors.category && !value}
                  helperText={errors.category?.message}
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
              rules={{
                validate: (publishedBeforeJoystream) => pastDateValidation(publishedBeforeJoystream),
              }}
              render={({ value, onChange }) => (
                <Datepicker
                  value={value}
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                  error={!!errors.publishedBeforeJoystream}
                  helperText={errors.publishedBeforeJoystream ? 'Please provide a valid date.' : ''}
                />
              )}
            />
          </FormField>
          <FormField title="Marketing" description="Please select whether your video contains paid promotions">
            <Controller
              name="hasMarketing"
              control={control}
              render={({ value, onChange }) => (
                <Checkbox
                  value={value}
                  label="My video features a paid promotion material"
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                />
              )}
            />
          </FormField>
          <FormField
            title="Content Rating"
            description="Please select whether your video contains explicit material (sex, violence, etc.)"
          >
            <Controller
              name="isExplicit"
              control={control}
              defaultValue={false}
              rules={{
                validate: (value) => value !== null,
              }}
              render={({ value, onChange }) => (
                <StyledRadioContainer>
                  <RadioButton
                    value="false"
                    label="All audiences"
                    onChange={() => {
                      onChange(false)
                      handleFormChange()
                    }}
                    selectedValue={value?.toString()}
                    error={!!errors.isExplicit}
                    helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
                  />
                  <RadioButton
                    value="true"
                    label="Mature"
                    onChange={() => {
                      onChange(true)
                      handleFormChange()
                    }}
                    selectedValue={value?.toString()}
                    error={!!errors.isExplicit}
                    helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
                  />
                </StyledRadioContainer>
              )}
            />
          </FormField>
          {isEdit && (
            <DeleteVideoContainer>
              <DeleteVideoButton size="large" variant="tertiary" textColorVariant="error" onClick={handleDeleteVideo}>
                Delete video
              </DeleteVideoButton>
            </DeleteVideoContainer>
          )}
        </InputsContainer>
      </FormWrapper>
      <StyledActionBar
        fee={0}
        isActive={!isEdit || isDirty}
        primaryButtonText={isEdit ? 'Publish changes' : 'Start publishing'}
        onConfirmClick={handleSubmit}
        detailsText={isEdit ? undefined : 'Drafts are saved automatically'}
        tooltipText={
          isEdit
            ? undefined
            : 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.'
        }
        detailsTextIcon={isEdit ? undefined : <SvgGlyphInfo />}
        secondaryButtonText={isEdit ? 'Cancel' : undefined}
        onCancelClick={isEdit ? () => reset() : undefined}
      />
    </>
  )
}
