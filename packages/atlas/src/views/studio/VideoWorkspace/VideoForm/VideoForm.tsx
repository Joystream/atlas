import { formatISO } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCategories } from '@/api/hooks'
import { License } from '@/api/queries'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardRadio } from '@/components/_inputs/OptionCard'
import { RadioButton } from '@/components/_inputs/RadioButton'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { Switch } from '@/components/_inputs/Switch'
import { TextArea } from '@/components/_inputs/TextArea'
import { TextField } from '@/components/_inputs/TextField'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { VideoInputMetadata } from '@/joystream-lib'
import { useRawAssetResolver } from '@/providers/assets'
import {
  DEFAULT_LICENSE_ID,
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { useVideoFormAssets, useVideoFormDraft } from '@/views/studio/VideoWorkspace/VideoForm/hooks'

import {
  DeleteVideoButton,
  ExtendedMarginFormField,
  FormWrapper,
  InputsContainer,
  MoreSettingsDescription,
  MoreSettingsHeader,
  MoreSettingsSection,
  RadioButtonsContainer,
  RadioCardButtonsContainer,
  StyledMultiFileSelect,
  StyledTitleArea,
  SwitchFormField,
  SwitchNftWrapper,
} from './VideoForm.styles'
import { convertVideoFormDataToFormFields } from './utils'

import { StyledSvgWarning, YellowText } from '../VideoWorkspace.style'

const CUSTOM_LICENSE_CODE = 1000
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  badgeText: license.code === DEFAULT_LICENSE_ID ? 'Default' : undefined,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type VideoFormProps = {
  onSubmit: (data: VideoFormData) => void
  setFormStatus: (data: VideoWorkspaceFormStatus<VideoWorkspaceVideoFormFields> | null) => void
  videoFormDataForNft: VideoFormData | null
  setIsIssuedAsNft: (isIssuedAsNft: boolean) => void
  isIssuedAsNft: boolean
}

export const VideoForm: React.FC<VideoFormProps> = React.memo(
  ({ onSubmit, setFormStatus, isIssuedAsNft, setIsIssuedAsNft, videoFormDataForNft }) => {
    const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
    const [cachedEditedVideoId, setCachedEditedVideoId] = useState('')
    const [actionBarPrimaryText, setActionBarPrimaryText] = useState('')

    const { editedVideoInfo } = useVideoWorkspace()
    const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData()

    const resolveAsset = useRawAssetResolver()

    const deleteVideo = useDeleteVideo()
    const isEdit = !editedVideoInfo?.isDraft

    const { categories, error: categoriesError } = useCategories(undefined, {
      onError: (error) => SentryLogger.error('Failed to fetch categories', 'VideoWorkspace', error),
    })

    const {
      register,
      control,
      handleSubmit: createSubmitHandler,
      getValues,
      setValue,
      watch,
      reset,
      formState: { errors, dirtyFields, isDirty, isValid },
    } = useForm<VideoWorkspaceVideoFormFields>({
      shouldFocusError: true,
      mode: 'onChange',
    })

    // manage assets used by the form
    const {
      handleVideoFileChange,
      handleThumbnailFileChange,
      videoHashPromise,
      thumbnailHashPromise,
      files,
      mediaAsset,
      thumbnailAsset,
      hasUnsavedAssets,
    } = useVideoFormAssets(watch, getValues, setValue, dirtyFields)

    // manage draft saving
    const { flushDraftSave } = useVideoFormDraft(watch, dirtyFields)

    // reset form whenever edited video gets updated
    useEffect(() => {
      if (editedVideoInfo.id === cachedEditedVideoId || !tabData || tabDataLoading) {
        return
      }
      setCachedEditedVideoId(editedVideoInfo.id)

      reset(tabData)

      if (videoFormDataForNft) {
        setTimeout(() => {
          const videoFormFields = convertVideoFormDataToFormFields(videoFormDataForNft)
          Object.entries(videoFormFields).forEach(([key, value]) => {
            setValue(key as keyof VideoWorkspaceVideoFormFields, value, { shouldDirty: true })
          })
        }, 0)
      }
    }, [tabData, tabDataLoading, reset, editedVideoInfo.id, cachedEditedVideoId, setValue, videoFormDataForNft])
    const handleSubmit = useCallback(() => {
      flushDraftSave()

      const handler = createSubmitHandler(async (data) => {
        const isNew = !isEdit

        if (!editedVideoInfo) {
          return
        }

        const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets
        const videoAsset = resolveAsset(videoInputFile.id)
        const thumbnailAsset = resolveAsset(thumbnailInputFile.cropId)

        if (isNew && (!videoAsset || !videoHashPromise)) {
          ConsoleLogger.error('Video file cannot be empty')
          return
        }

        if (isNew && (!thumbnailAsset || !thumbnailHashPromise)) {
          ConsoleLogger.error('Thumbnail cannot be empty')
          return
        }

        const license = {
          code: data.licenseCode ?? undefined,
          attribution: data.licenseAttribution ?? undefined,
          customText: data.licenseCustomText ?? undefined,
        }
        const anyLicenseFieldsDirty =
          dirtyFields.licenseCode || dirtyFields.licenseAttribution || dirtyFields.licenseCustomText

        const metadata: VideoInputMetadata = {
          ...(isNew || dirtyFields.title ? { title: data.title } : {}),
          ...(isNew || dirtyFields.description ? { description: data.description } : {}),
          ...(isNew || dirtyFields.category ? { category: Number(data.category) } : {}),
          ...(isNew || dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
          ...((isNew || dirtyFields.hasMarketing) && data.hasMarketing != null
            ? { hasMarketing: data.hasMarketing }
            : {}),
          ...((isNew || dirtyFields.isExplicit) && data.isExplicit != null ? { isExplicit: data.isExplicit } : {}),
          ...((isNew || dirtyFields.language) && data.language != null ? { language: data.language } : {}),
          ...(isNew || anyLicenseFieldsDirty ? { license } : {}),
          ...((isNew || dirtyFields.publishedBeforeJoystream) && data.publishedBeforeJoystream != null
            ? {
                publishedBeforeJoystream: formatISO(data.publishedBeforeJoystream),
              }
            : {}),
          ...(isNew || dirtyFields.assets?.video
            ? {
                mimeMediaType: videoInputFile?.mimeType,
              }
            : {}),
          ...(isNew || dirtyFields.assets?.video ? { duration: Math.round(videoInputFile?.duration || 0) } : {}),
          ...(isNew || dirtyFields.assets?.video ? { mediaPixelHeight: videoInputFile?.mediaPixelHeight } : {}),
          ...(isNew || dirtyFields.assets?.video ? { mediaPixelWidth: videoInputFile?.mediaPixelWidth } : {}),
        }

        const videoWidth = videoInputFile?.mediaPixelWidth
        const videoHeight = videoInputFile?.mediaPixelHeight

        onSubmit({
          metadata,
          assets: {
            ...(videoAsset?.blob && videoInputFile.id && videoHashPromise
              ? {
                  media: {
                    id: videoInputFile.id,
                    blob: videoAsset.blob,
                    url: videoAsset.url || undefined,
                    hashPromise: videoHashPromise,
                    dimensions: videoWidth && videoHeight ? { height: videoHeight, width: videoWidth } : undefined,
                  },
                }
              : {}),
            ...(thumbnailAsset?.blob &&
            thumbnailInputFile.cropId &&
            thumbnailInputFile.originalId &&
            thumbnailHashPromise
              ? {
                  thumbnailPhoto: {
                    id: thumbnailInputFile.cropId,
                    originalId: thumbnailInputFile.originalId,
                    blob: thumbnailAsset.blob,
                    url: thumbnailAsset.url || undefined,
                    hashPromise: thumbnailHashPromise,
                    dimensions: thumbnailInputFile?.assetDimensions,
                    cropData: thumbnailInputFile?.imageCropData,
                  },
                }
              : {}),
          },
        })
      })

      return handler()
    }, [
      createSubmitHandler,
      dirtyFields,
      editedVideoInfo,
      flushDraftSave,
      isEdit,
      onSubmit,
      resolveAsset,
      thumbnailHashPromise,
      videoHashPromise,
    ])

    const formDisabled = useMemo(() => {
      if (isValid) {
        return isEdit ? isDirty || isIssuedAsNft : true
      }
      return false
    }, [isValid, isEdit, isDirty, isIssuedAsNft])

    const isFormValid = (isEdit || !!mediaAsset) && !!thumbnailAsset && isValid
    const formStatus: VideoWorkspaceFormStatus<VideoWorkspaceVideoFormFields> = useMemo(
      () => ({
        hasUnsavedAssets,
        isDirty,
        isDisabled: formDisabled,
        actionBarPrimaryText,
        isValid: isFormValid,
        resetForm: reset,
        triggerFormSubmit: handleSubmit,
      }),
      [actionBarPrimaryText, formDisabled, handleSubmit, hasUnsavedAssets, isDirty, isFormValid, reset]
    )

    // sent updates on form status to VideoWorkspace
    useEffect(() => {
      setFormStatus(formStatus)
    }, [formStatus, setFormStatus])

    useEffect(() => {
      if (isIssuedAsNft) {
        setActionBarPrimaryText('Next')
        return
      }
      if (isEdit) {
        setActionBarPrimaryText('Publish changes')
      }
      setActionBarPrimaryText('Upload')
    }, [isEdit, isIssuedAsNft])

    const handleDeleteVideo = () => {
      editedVideoInfo && deleteVideo(editedVideoInfo.id)
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
      <FormWrapper as="form" onSubmit={handleSubmit}>
        <Controller
          name="assets"
          control={control}
          render={() => (
            // don't remove this div
            // without this element position sticky won't work
            <div>
              <StyledMultiFileSelect
                files={files}
                onVideoChange={handleVideoFileChange}
                onThumbnailChange={handleThumbnailFileChange}
                editMode={isEdit}
                maxVideoSize={10 * 1024 * 1024 * 1024}
              />
            </div>
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
                    <OptionCardRadio
                      value="true"
                      label="Public"
                      onChange={() => onChange(true)}
                      selectedValue={value?.toString()}
                      helperText="Visible to all"
                    />
                    <OptionCardRadio
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
            <SwitchFormField title="Issue as Nft">
              <SwitchNftWrapper>
                <Switch
                  label="Toggle to list this video as an Nft"
                  value={isIssuedAsNft}
                  onChange={(e) => setIsIssuedAsNft(e?.currentTarget.checked || false)}
                />
                <Information
                  placement="top"
                  arrowDisabled
                  text="By issuing your video as an Nft you will be able to sell it on auction or hold its ownership written on blockchain for yourself"
                />
              </SwitchNftWrapper>
              {isIssuedAsNft && (
                <Banner
                  id="issuing-nft"
                  dismissable={false}
                  icon={<StyledSvgWarning width={24} height={24} />}
                  description={
                    <>
                      <Text variant="t200">After issuing this as an Nft </Text>
                      <YellowText variant="t200">editing options of this video will be disabled</YellowText>
                    </>
                  }
                />
              )}
            </SwitchFormField>
          </FormField>
          <MoreSettingsHeader>
            <Button
              size="large"
              iconPlacement="right"
              textOnly
              icon={moreSettingsVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
              onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
            >
              Show {moreSettingsVisible ? 'less' : 'more'} settings
            </Button>
            <MoreSettingsDescription as="p" variant="t200" secondary visible={!moreSettingsVisible}>
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
    )
  }
)

VideoForm.displayName = 'VideoForm'
