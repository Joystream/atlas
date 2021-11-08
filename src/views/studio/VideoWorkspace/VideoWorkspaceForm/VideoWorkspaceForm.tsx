import { formatISO, isValid as isDateValid } from 'date-fns'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, DeepMap, FieldNamesMarkedBoolean, useForm } from 'react-hook-form'
import useMeasure from 'react-use-measure'

import { useCategories } from '@/api/hooks'
import { License } from '@/api/queries'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { Datepicker } from '@/components/Datepicker'
import { FormField } from '@/components/FormField'
import { FileErrorType, ImageInputFile, VideoInputFile } from '@/components/MultiFileSelect'
import { OptionCard } from '@/components/OptionCard'
import { RadioButton } from '@/components/RadioButton'
import { Select, SelectItem } from '@/components/Select'
import { TextArea } from '@/components/TextArea'
import { TextField } from '@/components/TextField'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { SvgGlyphChevronDown, SvgGlyphChevronUp, SvgPlayerCancel } from '@/components/icons'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAssetStore, useRawAsset } from '@/providers/assets'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import { useAuthorizedUser } from '@/providers/user'
import {
  DEFAULT_LICENSE_ID,
  VideoWorkspaceFormFields,
  VideoWorkspaceTab,
  useVideoWorkspace,
  useVideoWorkspaceTabData,
} from '@/providers/videoWorkspace'
import { FileType } from '@/types/files'
import { createId } from '@/utils/createId'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'

import {
  DeleteVideoButton,
  ExtendedMarginFormField,
  FormScrolling,
  FormWrapper,
  InputsContainer,
  MoreSettingsDescription,
  MoreSettingsHeader,
  MoreSettingsSection,
  RadioButtonsContainer,
  RadioCardButtonsContainer,
  StyledActionBar,
  StyledMultiFileSelect,
  StyledTitleArea,
} from './VideoWorkspaceForm.style'

const CUSTOM_LICENSE_CODE = 1000
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  badgeText: license.code === DEFAULT_LICENSE_ID ? 'Default' : undefined,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type VideoWorkspaceFormProps = {
  onSubmit: (
    data: VideoWorkspaceFormFields,
    dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceFormFields>,
    callback: () => void
  ) => void
  onThumbnailFileChange: (file: Blob) => void
  onVideoFileChange: (file: Blob) => void
  onDeleteVideo: (videoId: string) => void
  selectedVideoTab?: VideoWorkspaceTab
  fee: number
}

type ValueOf<T> = T[keyof T]

export const VideoWorkspaceForm: React.FC<VideoWorkspaceFormProps> = ({
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
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const mdMatch = useMediaMatch('md')

  const [forceReset, setForceReset] = useState(false)
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [cachedSelectedVideoTabId, setCachedSelectedVideoTabId] = useState<string | null>(null)
  const {
    updateSelectedVideoTab,
    setSelectedVideoTabCachedAssets,
    selectedVideoTabCachedDirtyFormData,
    setSelectedVideoTabCachedDirtyFormData,
    videoWorkspaceState,
  } = useVideoWorkspace()
  const { updateDraft, addDraft } = useDraftStore((state) => state.actions)

  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

  const deleteVideo = useDeleteVideo()

  const { categories, error: categoriesError } = useCategories(undefined, {
    onError: (error) => SentryLogger.error('Failed to fetch categories', 'VideoWorkspace', error),
  })
  const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceTabData(selectedVideoTab)

  const {
    register,
    control,
    handleSubmit: createSubmitHandler,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields, isDirty, isValid },
  } = useForm<VideoWorkspaceFormFields>({
    shouldFocusError: true,
    mode: 'onChange',
    defaultValues: {
      assets: {
        video: {
          contentId: null,
        },
        thumbnail: { cropContentId: null, originalContentId: null },
      },
      ...tabData,
    },
  })

  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const mediaAsset = useRawAsset(watch('assets.video').contentId)
  const thumbnailAsset = useRawAsset(watch('assets.thumbnail').cropContentId)
  const originalThumbnailAsset = useRawAsset(watch('assets.thumbnail').originalContentId)

  useEffect(() => {
    // reset form for edited video on videoWorkspace close
    if (isEdit && videoWorkspaceState === 'closed' && tabData && !tabDataLoading) {
      reset(tabData)
      setMoreSettingsVisible(false)
    }
  }, [isEdit, reset, setValue, videoWorkspaceState, tabData, tabDataLoading])

  useEffect(() => {
    if (isEdit) {
      return
    }
    // reset multifileselect when videoWorkspaceState is closed
    if (videoWorkspaceState === 'closed') {
      setValue('assets', {
        video: { contentId: null },
        thumbnail: { cropContentId: null, originalContentId: null },
      })
    }
  }, [videoWorkspaceState, setValue, isEdit])

  // we pass the functions explicitly so the debounced function doesn't need to change when those functions change
  const debouncedDraftSave = useRef(
    debounce(
      (
        tab: VideoWorkspaceTab,
        data: VideoWorkspaceFormFields,
        addDraftFn: typeof addDraft,
        updateDraftFn: typeof updateDraft,
        updateSelectedTabFn: typeof updateSelectedVideoTab
      ) => {
        const draftData: RawDraft = {
          ...data,
          channelId: activeChannelId,
          type: 'video',
          publishedBeforeJoystream: isDateValid(data.publishedBeforeJoystream)
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
        data: VideoWorkspaceFormFields,
        dirtyFields: DeepMap<VideoWorkspaceFormFields, true>,
        setSelectedVideoTabCachedDirtyFormDataFn: typeof setSelectedVideoTabCachedDirtyFormData
      ) => {
        const keysToKeep = Object.keys(dirtyFields) as Array<keyof VideoWorkspaceFormFields>
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
        const keys = Object.keys(selectedVideoTabCachedDirtyFormData) as Array<keyof VideoWorkspaceFormFields>
        keys.forEach((key) => {
          setValue(key, selectedVideoTabCachedDirtyFormData[key] as ValueOf<VideoWorkspaceFormFields>, {
            shouldDirty: true,
          })
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

  const handleSubmit = createSubmitHandler(async (data: VideoWorkspaceFormFields) => {
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
  })

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

  const handleVideoFileChange = (video: VideoInputFile | null) => {
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

  const handleThumbnailFileChange = (thumbnail: ImageInputFile | null) => {
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

  const handleFileSelectError = useCallback((errorCode: FileErrorType | null, fileType: FileType) => {
    if (!errorCode) {
      setFileSelectError(null)
    } else if (errorCode === 'file-invalid-type') {
      setFileSelectError(
        fileType === 'video'
          ? `Maximum 10GB. Preferred format is WebM (VP9/VP8) or MP4 (H.264)`
          : `Preferred 16:9 image ratio`
      )
    } else if (errorCode === 'file-too-large') {
      setFileSelectError('File too large')
    } else {
      SentryLogger.error('Unknown file select error', 'VideoWorkspaceForm', null, { error: { code: errorCode } })
      setFileSelectError('Unknown error')
    }
  }, [])

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
  const isFormValid = !!mediaAsset && !!thumbnailAsset && isValid

  const isDisabled =
    !isDirty || (!isEdit && !mediaAsset) || !thumbnailAsset || !isValid || nodeConnectionStatus !== 'connected'

  return (
    <>
      <FormScrolling actionBarHeight={actionBarBounds.height} isEdit={isEdit} data-scroll-lock-scrollable>
        <FormWrapper as="form">
          <Controller
            name="assets"
            control={control}
            render={() => (
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
            )}
          />
          <InputsContainer>
            <Controller
              name="title"
              control={control}
              rules={textFieldValidation({ name: 'Video Title', minLength: 3, maxLength: 60, required: true })}
              render={({ field: { value, onChange } }) => (
                <StyledTitleArea onChange={onChange} value={value} min={3} max={60} placeholder="Video title" />
              )}
            />

            <TextArea
              {...register('description', textFieldValidation({ name: 'Description', maxLength: 2160 }))}
              maxLength={2160}
              placeholder="Description of the video to share with your audience"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <FormField title="Category">
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
            <FormField title="Language">
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
              <ExtendedMarginFormField title="Visibility">
                <Controller
                  name="isPublic"
                  control={control}
                  defaultValue={true}
                  rules={{
                    validate: (value) => value !== null,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <RadioCardButtonsContainer>
                      <OptionCard
                        value="true"
                        label="Public"
                        onChange={() => onChange(true)}
                        selectedValue={value?.toString()}
                        helperText="Visible to all"
                      />
                      <OptionCard
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
            <MoreSettingsHeader>
              <Button
                size="large"
                iconPlacement="right"
                textOnly
                icon={moreSettingsVisible ? <SvgGlyphChevronUp /> : <SvgGlyphChevronDown />}
                onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
              >
                Show {moreSettingsVisible ? 'less' : 'more'} settings
              </Button>
              <MoreSettingsDescription variant="body2" secondary visible={!moreSettingsVisible}>
                License, content rating, published before, marketing{isEdit && ', delete video'}
              </MoreSettingsDescription>
            </MoreSettingsHeader>
            <MoreSettingsSection expanded={moreSettingsVisible}>
              <FormField title="License">
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
              </FormField>
              {knownLicenses.find((license) => license.code === watch('licenseCode'))?.attributionRequired && (
                <FormField title="License attribution" optional>
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
                      textFieldValidation({ name: 'License', maxLength: 5000, required: false })
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
                description="If the content you are publishing contains explicit material (sex, violence, etc.), please mark it as mature."
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
                <DeleteVideoButton fullWidth size="large" variant="destructive-secondary" onClick={handleDeleteVideo}>
                  Delete video
                </DeleteVideoButton>
              )}
            </MoreSettingsSection>
          </InputsContainer>
        </FormWrapper>
      </FormScrolling>
      <StyledActionBar
        ref={actionBarRef}
        isEdit={isEdit}
        primaryText={`Fee: ${fee} Joy`}
        secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        primaryButton={{
          text: isEdit ? 'Publish changes' : 'Upload',
          disabled: isDisabled,
          onClick: handleSubmit,
          tooltip: isDisabled
            ? {
                headerText: isEdit
                  ? isFormValid
                    ? 'Change anything to proceed'
                    : 'Fill all required fields to proceed'
                  : 'Fill all required fields to proceed',
                text: isEdit
                  ? isFormValid
                    ? 'To publish changes you have to provide new value to any field'
                    : 'Required: video file, thumbnail, title, category, language'
                  : 'Required: video file, thumbnail, title, category, language',
                icon: true,
              }
            : undefined,
        }}
        secondaryButton={{
          visible: isEdit && isDirty && nodeConnectionStatus === 'connected',
          text: 'Cancel',
          onClick: () => reset(),
          icon: <SvgPlayerCancel width={16} height={16} />,
        }}
        draftBadge={{
          visible: !isEdit,
          text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
          tooltip: {
            text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
          },
        }}
        fullWidth={true}
      />
    </>
  )
}
