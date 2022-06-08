import { formatISO } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCategories } from '@/api/hooks'
import { License } from '@/api/queries'
import { Information } from '@/components/Information'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardRadio } from '@/components/_inputs/OptionCard'
import { RadioButton } from '@/components/_inputs/RadioButton'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { Switch } from '@/components/_inputs/Switch'
import { TextArea } from '@/components/_inputs/TextArea'
import { languages } from '@/config/languages'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { NftIssuanceInputMetadata, VideoInputMetadata } from '@/joystream-lib'
import { useRawAssetResolver } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'
import {
  DEFAULT_LICENSE_ID,
  VideoFormAssets,
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { useVideoFormAssets, useVideoFormDraft } from './VideoForm.hooks'
import {
  FormWrapper,
  InputsContainer,
  MoreSettingsDescription,
  MoreSettingsSection,
  RadioButtonsContainer,
  RadioCardButtonsContainer,
  StyledBanner,
  StyledMultiFileSelect,
  StyledTitleArea,
  SwitchFormField,
  SwitchNftWrapper,
  VideoLink,
} from './VideoForm.styles'

import { StyledSvgWarning, YellowText } from '../VideoWorkspace.style'

const CUSTOM_LICENSE_CODE = 1000
const SCROLL_TIMEOUT = 700
const MINT_NFT_TIMEOUT = 1200
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  badgeText: license.code === DEFAULT_LICENSE_ID ? 'Default' : undefined,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type VideoFormProps = {
  onSubmit: (data: VideoFormData) => void
  setFormStatus: (data: VideoWorkspaceFormStatus | null) => void
}

export const VideoForm: React.FC<VideoFormProps> = React.memo(({ onSubmit, setFormStatus }) => {
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const [cachedEditedVideoId, setCachedEditedVideoId] = useState('')
  const [royaltiesFieldEnabled, setRoyaltiesFieldEnabled] = useState(false)
  const mintNftFormFieldRef = useRef<HTMLDivElement>(null)

  const { editedVideoInfo } = useVideoWorkspace()
  const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData()

  const {
    chainState: { nftMaxCreatorRoyaltyPercentage, nftMinCreatorRoyaltyPercentage },
  } = useJoystream()
  const resolveAsset = useRawAssetResolver()

  const deleteVideo = useDeleteVideo()
  const isEdit = !editedVideoInfo?.isDraft
  const isNew = !isEdit
  const mintNft = editedVideoInfo?.mintNft

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
    trigger,
    reset,
    formState: { errors, dirtyFields, isDirty, touchedFields, isValid },
  } = useForm<VideoWorkspaceVideoFormFields>({
    shouldFocusError: true,
    mode: 'onChange',
  })

  const videoFieldsLocked = tabData?.mintNft && isEdit

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
  }, [tabData, tabDataLoading, reset, mintNft, editedVideoInfo.id, cachedEditedVideoId, setValue])

  // animate scroll to Mint an NFT switch and toggle it, if user selected it from video tile context menu
  useEffect(() => {
    if (!mintNft || !mintNftFormFieldRef.current || !tabData || getValues('mintNft') || touchedFields.mintNft) {
      return
    }
    const scrollTimeout = setTimeout(
      () => mintNftFormFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      SCROLL_TIMEOUT
    )
    const setMintNftTimeout = setTimeout(
      () => setValue('mintNft', tabData.mintNft || mintNft, { shouldTouch: true }),
      MINT_NFT_TIMEOUT
    )

    return () => {
      clearTimeout(scrollTimeout)
      clearTimeout(setMintNftTimeout)
    }
  }, [touchedFields, mintNft, setValue, tabData, getValues])

  const handleSubmit = useCallback(() => {
    flushDraftSave()

    const handler = createSubmitHandler(async (data) => {
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
      const assets: VideoFormAssets = {
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
        ...(thumbnailAsset?.blob && thumbnailInputFile.cropId && thumbnailInputFile.originalId && thumbnailHashPromise
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
      }

      const nftMetadata: NftIssuanceInputMetadata | undefined = data.mintNft
        ? {
            royalty: data.nftRoyaltiesPercent || undefined,
          }
        : undefined

      onSubmit({
        metadata,
        assets,
        nftMetadata,
      })
    })

    return handler()
  }, [
    createSubmitHandler,
    dirtyFields,
    editedVideoInfo,
    flushDraftSave,
    isNew,
    onSubmit,
    resolveAsset,
    thumbnailHashPromise,
    videoHashPromise,
  ])

  const actionBarPrimaryText = watch('mintNft') ? 'Publish & mint' : !isEdit ? 'Publish & upload' : 'Publish changes'

  const isFormValid = (isEdit || !!mediaAsset) && !!thumbnailAsset && isValid
  const formStatus: VideoWorkspaceFormStatus = useMemo(
    () => ({
      hasUnsavedAssets,
      isDirty,
      isDisabled: isEdit ? isDirty || !!mintNft : isFormValid,
      actionBarPrimaryText,
      isValid: isFormValid,
      triggerFormSubmit: handleSubmit,
      triggerReset: reset,
    }),
    [actionBarPrimaryText, handleSubmit, hasUnsavedAssets, isDirty, isEdit, isFormValid, mintNft, reset]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

  const handleDeleteVideo = () => {
    editedVideoInfo && deleteVideo(editedVideoInfo.id)
  }

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  const getHiddenSectionLabel = () => {
    if (videoFieldsLocked) {
      return `${moreSettingsVisible ? 'Hide' : 'Show'} non-editable fields`
    }
    return `Show ${moreSettingsVisible ? 'less' : 'more'} settings`
  }

  if (tabDataError || categoriesError) {
    return <ViewErrorFallback />
  }

  const videoEditFields = (
    <>
      <FormField error={errors.description?.message}>
        <TextArea
          {...register('description', textFieldValidation({ name: 'Description', maxLength: 5000 }))}
          maxLength={5000}
          placeholder="Description of the video to share with your audience"
          error={!!errors.description}
          disabled={videoFieldsLocked}
        />
      </FormField>
      <FormField label="Video category" error={errors.category?.message}>
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
              disabled={videoFieldsLocked}
            />
          )}
        />
      </FormField>
      <FormField label="Video language">
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
              disabled={videoFieldsLocked}
            />
          )}
        />
      </FormField>
      <FormField label="Video visibility">
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
                disabled={videoFieldsLocked}
              />
              <OptionCardRadio
                value="false"
                label="Unlisted"
                onChange={() => onChange(false)}
                selectedValue={value?.toString()}
                helperText="Visible with link only"
                disabled={videoFieldsLocked}
              />
            </RadioCardButtonsContainer>
          )}
        />
      </FormField>
    </>
  )

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
              disabled={videoFieldsLocked}
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
            <StyledTitleArea
              onChange={onChange}
              value={value}
              min={3}
              max={60}
              placeholder="Video title"
              disabled={videoFieldsLocked}
            />
          )}
        />
        {!videoFieldsLocked && videoEditFields}
        <SwitchFormField label="Mint NFT" ref={mintNftFormFieldRef}>
          <SwitchNftWrapper>
            <Controller
              name="mintNft"
              control={control}
              defaultValue={false}
              render={({ field: { value, onChange } }) => (
                <Switch
                  label="Mint NFT for this video"
                  value={value}
                  onChange={(e) => {
                    if (!e?.currentTarget.checked) {
                      trigger()
                      setRoyaltiesFieldEnabled(false)
                      setValue('nftRoyaltiesPercent', undefined)
                    }
                    onChange(e)
                  }}
                  disabled={videoFieldsLocked}
                />
              )}
            />
            <Information
              placement="top"
              arrowDisabled
              text="Minting an NFT creates a record of ownership on the blockchain that can be put on sale. This will not impact your intellectual rights of the video."
            />
          </SwitchNftWrapper>
          {watch('mintNft') && (
            <>
              <StyledBanner
                id="issuing-nft"
                dismissable={false}
                icon={<StyledSvgWarning width={24} height={24} />}
                description={
                  !videoFieldsLocked ? (
                    <Text variant="t200">
                      You <YellowText>won’t be able to edit this video</YellowText> once you mint an NFT for it.
                    </Text>
                  ) : (
                    <Text variant="t200">
                      Many fields are disabled after minting an NFT for this video -
                      <VideoLink to={absoluteRoutes.viewer.video(editedVideoInfo.id)}>
                        &nbsp;go to it's video page.
                      </VideoLink>
                    </Text>
                  )
                }
              />
              <FormField
                switchable
                error={errors.nftRoyaltiesPercent?.message}
                switchProps={{
                  value: videoFieldsLocked ? !!watch('nftRoyaltiesPercent') : royaltiesFieldEnabled,
                  onChange: (e) => {
                    if (e?.currentTarget.checked) {
                      setValue('nftRoyaltiesPercent', 1)
                    } else {
                      setValue('nftRoyaltiesPercent', undefined, { shouldValidate: true })
                      trigger()
                    }
                    setRoyaltiesFieldEnabled(!!e?.currentTarget.checked)
                  },
                  disabled: videoFieldsLocked,
                }}
                label="Set creator's royalties"
                tooltip={{ text: 'Setting royalties lets you earn commission from every sale of this NFT.' }}
              >
                <Input
                  type="number"
                  {...register('nftRoyaltiesPercent', {
                    valueAsNumber: true,
                    min: {
                      value: nftMinCreatorRoyaltyPercentage,
                      message: `Creator royalties cannot be lower than ${nftMinCreatorRoyaltyPercentage}%`,
                    },
                    max: {
                      value: nftMaxCreatorRoyaltyPercentage,
                      message: `Creator royalties cannot be higher than ${nftMaxCreatorRoyaltyPercentage}%`,
                    },
                  })}
                  error={!!errors.nftRoyaltiesPercent}
                  placeholder="—"
                  nodeEnd={<Pill variant="default" label="%" />}
                  disabled={videoFieldsLocked}
                />
              </FormField>
            </>
          )}
        </SwitchFormField>
        <div>
          <Button
            size="large"
            iconPlacement="right"
            textOnly
            icon={moreSettingsVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
            onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
          >
            {getHiddenSectionLabel()}
          </Button>
          <MoreSettingsDescription as="p" variant="t200" secondary>
            {!videoFieldsLocked
              ? `License, content rating, published before, marketing${isEdit ? ', delete video' : ''}`
              : 'Description, video category, video language, video visibility, licence, content rating, published before, marketing'}
          </MoreSettingsDescription>
        </div>
        <MoreSettingsSection expanded={moreSettingsVisible}>
          {videoFieldsLocked && videoEditFields}
          <Controller
            name="licenseCode"
            control={control}
            rules={requiredValidation('License')}
            render={({ field: { value, onChange, ref } }) => (
              <FormField label="License" error={errors.licenseCode?.message}>
                <Select
                  containerRef={ref}
                  value={value}
                  items={knownLicensesOptions}
                  placeholder="Choose license type"
                  onChange={onChange}
                  error={!!errors.licenseCode && !value}
                  disabled={videoFieldsLocked}
                />
              </FormField>
            )}
          />
          {knownLicenses.find((license) => license.code === watch('licenseCode'))?.attributionRequired && (
            <FormField label="License attribution" error={errors.licenseAttribution?.message} optional>
              <Input
                {...register(
                  'licenseAttribution',
                  textFieldValidation({ name: 'License attribution', maxLength: 5000 })
                )}
                placeholder="Type your attribution here"
                error={!!errors.licenseAttribution}
                disabled={videoFieldsLocked}
              />
            </FormField>
          )}

          {watch('licenseCode') === CUSTOM_LICENSE_CODE && (
            <FormField label="Custom license" error={errors.licenseCustomText?.message}>
              <TextArea
                {...register(
                  'licenseCustomText',
                  textFieldValidation({ name: 'License', maxLength: 5000, required: false })
                )}
                maxLength={5000}
                placeholder="Type your license content here"
                error={!!errors.licenseCustomText}
              />
            </FormField>
          )}

          <FormField
            label="Content rating"
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
                    disabled={videoFieldsLocked}
                  />
                  <RadioButton
                    value="true"
                    label="Mature"
                    onChange={() => onChange(true)}
                    selectedValue={value?.toString()}
                    error={!!errors.isExplicit}
                    helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
                    disabled={videoFieldsLocked}
                  />
                </RadioButtonsContainer>
              )}
            />
          </FormField>
          <FormField
            label="Prior publication"
            error={errors.publishedBeforeJoystream ? 'Please provide a valid date.' : ''}
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
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField label="Marketing" optional>
            <Controller
              name="hasMarketing"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value ?? false}
                  label="My video features a paid promotion material"
                  onChange={onChange}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          {isEdit && !videoFieldsLocked && (
            <Button fullWidth size="large" variant="destructive-secondary" onClick={handleDeleteVideo}>
              Delete video
            </Button>
          )}
        </MoreSettingsSection>
      </InputsContainer>
    </FormWrapper>
  )
})

VideoForm.displayName = 'VideoForm'
