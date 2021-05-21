import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm, FieldNamesMarkedBoolean } from 'react-hook-form'
import { debounce } from 'lodash'
import { useCategories } from '@/api/hooks'
import {
  useDrafts,
  useAuthorizedUser,
  EditVideoSheetTab,
  useEditVideoSheetTabData,
  EditVideoFormFields,
  useEditVideoSheet,
  useDeleteVideo,
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
  TextField,
} from '@/shared/components'
import { requiredValidation, pastDateValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
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
import { formatISO, isValid } from 'date-fns'
import { MessageDialog } from '@/components'
import { License } from '@/api/queries'

const visibilityOptions: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (video will not appear in feeds and search)', value: false },
]

const CUSTOM_LICENSE_CODE = 1000
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type EditVideoFormProps = {
  onSubmit: (
    data: EditVideoFormFields,
    dirtyFields: FieldNamesMarkedBoolean<EditVideoFormFields>,
    callback: () => void
  ) => void
  onThumbnailFileChange: (file: Blob) => void
  onVideoFileChange: (file: Blob) => void
  onDeleteVideo: (videoId: string) => void
  selectedVideoTab?: EditVideoSheetTab
  fee: number
}

export const EditVideoForm: React.FC<EditVideoFormProps> = ({
  selectedVideoTab,
  onSubmit,
  onThumbnailFileChange,
  onVideoFileChange,
  onDeleteVideo,
  fee,
}) => {
  const { activeChannelId } = useAuthorizedUser()
  const isEdit = !selectedVideoTab?.isDraft

  const [forceReset, setForceReset] = useState(false)
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [cachedSelectedVideoTabId, setCachedSelectedVideoTabId] = useState<string | null>(null)
  const {
    updateSelectedVideoTab,
    setSelectedVideoTabCachedAssets,
    selectedVideoTabCachedDirtyFormData,
    setSelectedVideoTabCachedDirtyFormData,
    sheetState,
  } = useEditVideoSheet()
  const { addDraft, updateDraft } = useDrafts('video', activeChannelId)

  const { categories, error: categoriesError } = useCategories()
  const { tabData, loading: tabDataLoading, error: tabDataError } = useEditVideoSheetTabData(selectedVideoTab)

  const { closeVideoDeleteDialog, confirmDeleteVideo, openVideoDeleteDialog, isDeleteDialogOpen } = useDeleteVideo()

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
    watch,
    reset,
    formState: { dirtyFields, isDirty },
  } = useForm<EditVideoFormFields>({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      isPublic: true,
      language: 'en',
      category: null,
      licenseCode: null,
      licenseAttribution: '',
      licenseCustomText: '',
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

  useEffect(() => {
    if (isEdit) {
      return
    }
    // reset multifileselect when sheetState is closed
    if (sheetState === 'closed') {
      setValue('assets', {
        video: null,
        thumbnail: null,
      })
    }
  }, [sheetState, setValue, isEdit])

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
        const draftData = {
          ...data,
          publishedBeforeJoystream: isValid(data.publishedBeforeJoystream)
            ? formatISO(data.publishedBeforeJoystream as Date)
            : null,
        }
        if (tab.isNew) {
          addDraftFn(draftData, tab.id)
          updateSelectedTabFn({ isNew: false })
        } else {
          updateDraftFn(tab.id, draftData)
        }
      },
      700
    )
  )
  const categorySelectRef = useRef<HTMLDivElement>(null)
  const isExplicitInputRef = useRef<HTMLInputElement>(null)
  const licenseSelectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabDataLoading || !tabData || !selectedVideoTab) {
      return
    }

    // only run this hook if the selected tab changed or we forced reset
    if (selectedVideoTab.id === cachedSelectedVideoTabId && !forceReset) {
      return
    }
    setCachedSelectedVideoTabId(selectedVideoTab.id)
    setForceReset(false)

    // flush any possible changes to the edited draft
    debouncedDraftSave.current.flush()

    setFileSelectError(null)
    reset(tabData)

    if (selectedVideoTabCachedDirtyFormData) {
      // allow a render for the form to reset first and then set fields dirty
      setTimeout(() => {
        const keys = Object.keys(selectedVideoTabCachedDirtyFormData) as Array<keyof EditVideoFormFields>
        keys.forEach((key) => {
          setValue(key, selectedVideoTabCachedDirtyFormData[key], { shouldDirty: true })
        })
      }, 0)
    }
  }, [
    selectedVideoTab,
    cachedSelectedVideoTabId,
    forceReset,
    reset,
    tabDataLoading,
    tabData,
    updateSelectedVideoTab,
    selectedVideoTabCachedDirtyFormData,
    setValue,
  ])

  const handleSubmit = createSubmitHandler(async (data: EditVideoFormFields) => {
    // do initial validation
    if (!isEdit && !data.assets.video?.blob) {
      setFileSelectError('Video file cannot be empty')
      return
    }
    if (!data.assets.thumbnail?.url) {
      setFileSelectError('Thumbnail cannot be empty')
      return
    }

    const callback = () => {
      setForceReset(true)
    }

    debouncedDraftSave.current.flush()

    await onSubmit(data, dirtyFields, callback)
  })

  // with react-hook-form v7 it's possible to call watch((data) => update()), we should use that instead when we upgrade
  const handleFormChange = () => {
    const data = getValues()
    if (!selectedVideoTab?.isDraft) {
      const keysToKeep = Object.keys(dirtyFields) as Array<keyof EditVideoFormFields>
      const dirtyData = keysToKeep.reduce((acc, curr) => {
        acc[curr] = data[curr]
        return acc
      }, {} as Record<string, unknown>)
      setSelectedVideoTabCachedDirtyFormData(dirtyData)
    } else {
      debouncedDraftSave.current(selectedVideoTab, data, addDraft, updateDraft, updateSelectedVideoTab)
    }
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

  const handleFieldFocus = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
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
              maxVideoSize={10 * 1024 * 1024 * 1024}
            />
          )}
        />
        <InputsContainer>
          <StyledHeaderTextField
            name="title"
            ref={register(textFieldValidation({ name: 'Video Title', minLength: 3, maxLength: 40, required: true }))}
            onChange={handleFormChange}
            placeholder="Video title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextArea
            name="description"
            ref={register(textFieldValidation({ name: 'Description', maxLength: 2160 }))}
            onChange={handleFormChange}
            maxLength={2160}
            placeholder="Description of the video to share with your audience"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <FormField
            title="Privacy"
            description="Privacy of the video. Please note that because of nature of the blockchain, even unlisted videos can be publicly visible by querying the blockchain data."
          >
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
          <FormField title="Language" description="Main language used in the video">
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
          <FormField title="Category" description="Category that best describes the content">
            <Controller
              name="category"
              control={control}
              rules={requiredValidation('Video category')}
              onFocus={() => handleFieldFocus(categorySelectRef)}
              render={({ value, onChange }) => (
                <Select
                  containerRef={categorySelectRef}
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
          <FormField title="License">
            <Controller
              name="licenseCode"
              control={control}
              rules={requiredValidation('License')}
              onFocus={() => handleFieldFocus(licenseSelectRef)}
              render={({ value, onChange }) => (
                <Select
                  containerRef={licenseSelectRef}
                  value={value ?? null}
                  items={knownLicensesOptions}
                  placeholder="Choose license type"
                  onChange={(value) => {
                    onChange(value)
                    handleFormChange()
                  }}
                  error={!!errors.licenseCode && !value}
                  helperText={errors.licenseCode?.message}
                />
              )}
            />
          </FormField>
          {knownLicenses.find((license) => license.code === watch('licenseCode'))?.attributionRequired && (
            <FormField title="License attribution">
              <TextField
                name="licenseAttribution"
                ref={register(textFieldValidation({ name: 'License attribution', maxLength: 5000, required: true }))}
                onChange={handleFormChange}
                placeholder="Type your attribution here"
                error={!!errors.licenseAttribution}
                helperText={errors.licenseAttribution?.message}
              />
            </FormField>
          )}

          {watch('licenseCode') === CUSTOM_LICENSE_CODE && (
            <FormField title="Custom license">
              <TextArea
                name="licenseCustomText"
                ref={register(textFieldValidation({ name: 'License', maxLength: 5000, required: true }))}
                onChange={handleFormChange}
                maxLength={5000}
                placeholder="Type your license content here"
                error={!!errors.licenseCustomText}
                helperText={errors.licenseCustomText?.message}
              />
            </FormField>
          )}

          <FormField title="Marketing">
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
            title="Content rating"
            description="Whether your video contains explicit material (sex, violence, etc.)"
          >
            <Controller
              name="isExplicit"
              control={control}
              defaultValue={false}
              rules={{
                validate: (value) => value !== null,
              }}
              onFocus={() => handleFieldFocus(isExplicitInputRef)}
              render={({ value, onChange }) => (
                <StyledRadioContainer>
                  <RadioButton
                    ref={isExplicitInputRef}
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
          <FormField
            title="Prior publication"
            description="If the content you are publishing was originally published outside of Joystream, please provide the original publication date."
          >
            <Controller
              name="publishedBeforeJoystream"
              control={control}
              rules={{
                validate: pastDateValidation,
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
          {isEdit && (
            <DeleteVideoContainer>
              <DeleteVideoButton
                size="large"
                variant="tertiary"
                textColorVariant="error"
                onClick={openVideoDeleteDialog}
              >
                Delete video
              </DeleteVideoButton>
            </DeleteVideoContainer>
          )}
        </InputsContainer>
      </FormWrapper>
      <MessageDialog
        title="Delete this video?"
        exitButton={false}
        description="You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets."
        showDialog={isDeleteDialogOpen}
        onSecondaryButtonClick={closeVideoDeleteDialog}
        onPrimaryButtonClick={() =>
          selectedVideoTab && confirmDeleteVideo(selectedVideoTab.id, () => onDeleteVideo(selectedVideoTab.id))
        }
        error
        variant="warning"
        primaryButtonText="Delete video"
        secondaryButtonText="Cancel"
      />
      <StyledActionBar
        fullWidth={true}
        fee={fee}
        isActive={selectedVideoTab?.isDraft || isDirty}
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
