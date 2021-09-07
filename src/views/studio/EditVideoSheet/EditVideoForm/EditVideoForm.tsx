import { formatISO, isValid } from 'date-fns'
import { debounce } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, DeepMap, FieldError, FieldNamesMarkedBoolean, useForm } from 'react-hook-form'
import useMeasure from 'react-use-measure'

import { useCategories } from '@/api/hooks'
import { License } from '@/api/queries'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { useAssetStore, useRawAsset } from '@/providers/assets'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import {
  EditVideoFormFields,
  EditVideoSheetTab,
  useEditVideoSheet,
  useEditVideoSheetTabData,
} from '@/providers/editVideoSheet'
import { useAuthorizedUser } from '@/providers/user'
import { Checkbox } from '@/shared/components/Checkbox'
import { Datepicker } from '@/shared/components/Datepicker'
import { FormField } from '@/shared/components/FormField'
import { FileErrorType, ImageInputFile, VideoInputFile } from '@/shared/components/MultiFileSelect'
import { RadioButton } from '@/shared/components/RadioButton'
import { RadioCardButton } from '@/shared/components/RadioCardButton'
import { Select, SelectItem } from '@/shared/components/Select'
import { TextArea } from '@/shared/components/TextArea'
import { TextField } from '@/shared/components/TextField'
import { SvgGlyphInfo } from '@/shared/icons'
import { createId } from '@/utils/createId'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'
import { StyledActionBar } from '@/views/studio/EditVideoSheet/EditVideoSheet.style'

import {
  DeleteVideoButton,
  DeleteVideoContainer,
  ExtendedMarginFormField,
  FormScrolling,
  FormWrapper,
  InputsContainer,
  RadioButtonsContainer,
  RadioCardButtonsContainer,
  StyledMultiFileSelect,
  StyledTitleArea,
} from './EditVideoForm.style'

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

type ValueOf<T> = T[keyof T]

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
  const [actionBarRef, actionBarBounds] = useMeasure()

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
  const { updateDraft, addDraft } = useDraftStore((state) => state.actions)

  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

  const deleteVideo = useDeleteVideo()

  const { categories, error: categoriesError } = useCategories(undefined, {
    onError: (error) => SentryLogger.error('Failed to fetch categories', 'EditVideoSheet', error),
  })
  const { tabData, loading: tabDataLoading, error: tabDataError } = useEditVideoSheetTabData(selectedVideoTab)

  const {
    register,
    control,
    handleSubmit: createSubmitHandler,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields, isDirty },
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
        video: {
          contentId: null,
        },
        thumbnail: { cropContentId: null, originalContentId: null },
      },
    },
  })

  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const mediaAsset = useRawAsset(watch('assets.video').contentId)
  const thumbnailAsset = useRawAsset(watch('assets.thumbnail').cropContentId)
  const originalThumbnailAsset = useRawAsset(watch('assets.thumbnail').originalContentId)

  useEffect(() => {
    // reset form for edited video on sheet close
    if (isEdit && sheetState === 'closed' && tabData && !tabDataLoading) {
      reset(tabData)
    }
  }, [isEdit, reset, setValue, sheetState, tabData, tabDataLoading])

  useEffect(() => {
    if (isEdit) {
      return
    }
    // reset multifileselect when sheetState is closed
    if (sheetState === 'closed') {
      setValue('assets', {
        video: { contentId: null },
        thumbnail: { cropContentId: null, originalContentId: null },
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
        const draftData: RawDraft = {
          ...data,
          channelId: activeChannelId,
          type: 'video',
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

  const debouncedSetSelectedVideoTabCachedDirtyFormData = useRef(
    debounce(
      (
        data: EditVideoFormFields,
        dirtyFields: DeepMap<EditVideoFormFields, true>,
        setSelectedVideoTabCachedDirtyFormDataFn: typeof setSelectedVideoTabCachedDirtyFormData
      ) => {
        const keysToKeep = Object.keys(dirtyFields) as Array<keyof EditVideoFormFields>
        const dirtyData = keysToKeep.reduce((acc, curr) => {
          acc[curr] = data[curr]
          return acc
        }, {} as Record<string, unknown>)
        setSelectedVideoTabCachedDirtyFormDataFn(dirtyData)
      },
      700
    )
  )

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
          setValue(key, selectedVideoTabCachedDirtyFormData[key] as ValueOf<EditVideoFormFields>, { shouldDirty: true })
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

  const handleSubmit = createSubmitHandler(
    async (data: EditVideoFormFields) => {
      // do initial validation
      if (!isEdit && !data.assets.video.contentId) {
        setFileSelectError('Video file cannot be empty')
        return
      }
      if (!data.assets.thumbnail.cropContentId) {
        setFileSelectError('Thumbnail cannot be empty')
        return
      }

      const callback = () => {
        if (!isEdit) {
          setForceReset(true)
        }
      }

      debouncedDraftSave.current.flush()

      await onSubmit(data, dirtyFields, callback)
    },
    (errors) => {
      const error = Object.values(errors)[0] as FieldError
      const ref = error.ref as HTMLElement
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  )

  useEffect(() => {
    const subscription = watch((data) => {
      if (!Object.keys(dirtyFields).length) {
        return
      }
      if (!selectedVideoTab?.isDraft) {
        debouncedSetSelectedVideoTabCachedDirtyFormData.current(
          data,
          dirtyFields,
          setSelectedVideoTabCachedDirtyFormData
        )
      } else {
        debouncedDraftSave.current(selectedVideoTab, data, addDraft, updateDraft, updateSelectedVideoTab)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [
    addDraft,
    dirtyFields,
    selectedVideoTab,
    setSelectedVideoTabCachedDirtyFormData,
    updateDraft,
    updateSelectedVideoTab,
    watch,
  ])

  const handleVideoFileChange = async (video: VideoInputFile | null) => {
    const currentAssetsValue = getValues('assets')

    if (!video) {
      setValue('assets', { ...currentAssetsValue, video: { contentId: null } }, { shouldDirty: true })
      return
    }

    const newAssetId = `local-video-${createId()}`
    addAsset(newAssetId, { url: video.url, blob: video.blob })

    const updatedVideo = {
      contentId: newAssetId,
      ...video,
    }
    const updatedAssets = {
      ...currentAssetsValue,
      video: updatedVideo,
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
    }
    setFileSelectError(null)
  }

  const handleThumbnailFileChange = async (thumbnail: ImageInputFile | null) => {
    const currentAssetsValue = getValues('assets')

    if (!thumbnail) {
      setValue(
        'assets',
        { ...currentAssetsValue, thumbnail: { cropContentId: null, originalContentId: null } },
        { shouldDirty: true }
      )
      return
    }

    const newCropAssetId = `local-thumbnail-crop-${createId()}`
    addAsset(newCropAssetId, { url: thumbnail.url, blob: thumbnail.blob })
    const newOriginalAssetId = `local-thumbnail-original-${createId()}`
    addAsset(newOriginalAssetId, { blob: thumbnail.originalBlob })

    const updatedThumbnail = {
      cropContentId: newCropAssetId,
      originalContentId: newOriginalAssetId,
      ...thumbnail,
    }
    const updatedAssets = {
      ...currentAssetsValue,
      thumbnail: updatedThumbnail,
    }
    setValue('assets', updatedAssets, { shouldDirty: true })

    if (selectedVideoTab?.isDraft) {
      setSelectedVideoTabCachedAssets(updatedAssets)
    }
    if (thumbnail?.blob) {
      onThumbnailFileChange(thumbnail.blob)
    }
    setFileSelectError(null)
  }

  const handleFileSelectError = async (errorCode: FileErrorType | null) => {
    if (!errorCode) {
      setFileSelectError(null)
    } else if (errorCode === 'file-invalid-type') {
      setFileSelectError('Invalid file type')
    } else if (errorCode === 'file-too-large') {
      setFileSelectError('File too large')
    } else {
      SentryLogger.error('Unknown file select error', 'EditVideoForm', null, { error: { code: errorCode } })
      setFileSelectError('Unknown error')
    }
  }

  const handleDeleteVideo = () => {
    selectedVideoTab && deleteVideo(selectedVideoTab.id, () => onDeleteVideo(selectedVideoTab.id))
  }

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  if (tabDataError || categoriesError) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <FormScrolling actionBarHeight={actionBarBounds.height}>
        <FormWrapper>
          <Controller
            name="assets"
            control={control}
            render={() => (
              <div>
                <StyledMultiFileSelect
                  files={{
                    video: mediaAsset,
                    thumbnail: { ...thumbnailAsset, originalBlob: originalThumbnailAsset?.blob },
                  }}
                  onVideoChange={handleVideoFileChange}
                  onThumbnailChange={handleThumbnailFileChange}
                  editMode={isEdit}
                  error={fileSelectError}
                  onError={handleFileSelectError}
                  maxVideoSize={10 * 1024 * 1024 * 1024}
                />
              </div>
            )}
          />
          <InputsContainer>
            <StyledTitleArea
              {...register(
                'title',
                textFieldValidation({ name: 'Video Title', minLength: 3, maxLength: 40, required: true })
              )}
              placeholder="Video title"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextArea
              {...register('description', textFieldValidation({ name: 'Description', maxLength: 2160 }))}
              maxLength={2160}
              placeholder="Description of the video to share with your audience"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <FormField title="Category" description="Category that best describes the content">
              <Controller
                name="category"
                control={control}
                rules={requiredValidation('Video category')}
                render={({ field: { value, onChange, ref } }) => (
                  <Select
                    containerRef={ref}
                    value={value}
                    items={categoriesSelectItems}
                    onChange={onChange}
                    error={!!errors.category && !value}
                    helperText={errors.category?.message}
                  />
                )}
              />
            </FormField>
            <FormField title="Language" description="Main language used in the video">
              <Controller
                name="language"
                control={control}
                rules={requiredValidation('Video language')}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    items={languages}
                    onChange={onChange}
                    error={!!errors.language && !value}
                    helperText={errors.language?.message}
                  />
                )}
              />
              <ExtendedMarginFormField
                title="Privacy"
                description="Privacy of the video. Please note that because of nature of the blockchain, even unlisted videos can be publicly visible by querying the blockchain data."
              >
                <Controller
                  name="isPublic"
                  control={control}
                  defaultValue={true}
                  rules={{
                    validate: (value) => value !== null,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <RadioCardButtonsContainer>
                      <RadioCardButton
                        value="true"
                        label="Public"
                        onChange={() => onChange(true)}
                        selectedValue={value?.toString()}
                        helperText="Visible to all"
                      />
                      <RadioCardButton
                        value="false"
                        label="Unlisted"
                        onChange={() => onChange(false)}
                        selectedValue={value?.toString()}
                        helperText="Visible with link only"
                      />
                    </RadioCardButtonsContainer>
                  )}
                />
              </ExtendedMarginFormField>
            </FormField>
            <ExtendedMarginFormField title="License">
              <Controller
                name="licenseCode"
                control={control}
                rules={requiredValidation('License')}
                render={({ field: { value, onChange, ref } }) => (
                  <Select
                    containerRef={ref}
                    value={value}
                    items={knownLicensesOptions}
                    placeholder="Choose license type"
                    onChange={onChange}
                    error={!!errors.licenseCode && !value}
                    helperText={errors.licenseCode?.message}
                  />
                )}
              />
            </ExtendedMarginFormField>
            {knownLicenses.find((license) => license.code === watch('licenseCode'))?.attributionRequired && (
              <FormField title="License attribution">
                <TextField
                  {...register(
                    'licenseAttribution',
                    textFieldValidation({ name: 'License attribution', maxLength: 5000 })
                  )}
                  placeholder="Type your attribution here"
                  error={!!errors.licenseAttribution}
                  helperText={errors.licenseAttribution?.message}
                />
              </FormField>
            )}

            {watch('licenseCode') === CUSTOM_LICENSE_CODE && (
              <FormField title="Custom license">
                <TextArea
                  {...register(
                    'licenseCustomText',
                    textFieldValidation({ name: 'License', maxLength: 5000, required: true })
                  )}
                  maxLength={5000}
                  placeholder="Type your license content here"
                  error={!!errors.licenseCustomText}
                  helperText={errors.licenseCustomText?.message}
                />
              </FormField>
            )}

            <ExtendedMarginFormField
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
                render={({ field: { value, onChange, ref } }) => (
                  <RadioButtonsContainer>
                    <RadioButton
                      ref={ref}
                      value="false"
                      label="All audiences"
                      onChange={() => onChange(false)}
                      selectedValue={value?.toString()}
                      error={!!errors.isExplicit}
                      helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
                    />
                    <RadioButton
                      value="true"
                      label="Mature"
                      onChange={() => onChange(true)}
                      selectedValue={value?.toString()}
                      error={!!errors.isExplicit}
                      helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
                    />
                  </RadioButtonsContainer>
                )}
              />
            </ExtendedMarginFormField>
            <ExtendedMarginFormField
              title="Prior publication"
              optional
              description="If the content you are publishing was originally published outside of Joystream, please provide the original publication date."
            >
              <Controller
                name="publishedBeforeJoystream"
                control={control}
                rules={{
                  validate: (value) => pastDateValidation(value),
                }}
                render={({ field: { value, onChange } }) => (
                  <Datepicker
                    value={value}
                    onChange={onChange}
                    error={!!errors.publishedBeforeJoystream}
                    helperText={errors.publishedBeforeJoystream ? 'Please provide a valid date.' : ''}
                  />
                )}
              />
            </ExtendedMarginFormField>
            <FormField title="Marketing" optional>
              <Controller
                name="hasMarketing"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    value={value ?? false}
                    label="My video features a paid promotion material"
                    onChange={onChange}
                  />
                )}
              />
            </FormField>
            {isEdit && (
              <DeleteVideoContainer>
                <DeleteVideoButton size="large" variant="destructive-secondary" onClick={handleDeleteVideo}>
                  Delete video
                </DeleteVideoButton>
              </DeleteVideoContainer>
            )}
          </InputsContainer>
        </FormWrapper>
      </FormScrolling>
      <StyledActionBar
        ref={actionBarRef}
        disabled={nodeConnectionStatus !== 'connected'}
        fullWidth={true}
        fee={fee}
        isActive={selectedVideoTab?.isDraft || isDirty}
        primaryButtonText={isEdit ? 'Publish changes' : 'Upload'}
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
        primaryButtonTooltipText={
          isEdit
            ? {
                headerText: 'Change anything to proceed',
                text: 'To publish changes you have to provide new value to any field',
                icon: true,
              }
            : {
                headerText: 'Fill all required fields to proceed',
                text: 'Required: video file, thumbnail, title, category, language',
                icon: true,
              }
        }
      />
    </>
  )
}
