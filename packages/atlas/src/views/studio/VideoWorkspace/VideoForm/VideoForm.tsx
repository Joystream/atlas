import { formatISO } from 'date-fns'
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'

import { useCategories } from '@/api/hooks'
import { License } from '@/api/queries'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button, TextButton } from '@/components/_buttons/Button'
import { SvgActionChevronB, SvgActionChevronT, SvgActionTrash, SvgAlertsWarning24 } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { Switch } from '@/components/_inputs/Switch'
import { TextArea } from '@/components/_inputs/TextArea'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { NftIssuanceInputMetadata, VideoInputMetadata } from '@/joystream-lib'
import { useRawAssetResolver } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import {
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
  Divider,
  FileValidationBanner,
  FormWrapper,
  InputsContainer,
  MoreSettingsSection,
  StyledMultiFileSelect,
  StyledSvgAlertsInformative24,
  StyledTitleArea,
} from './VideoForm.styles'

const CUSTOM_LICENSE_CODE = 1000
const SCROLL_TIMEOUT = 700
const MINT_NFT_TIMEOUT = 1200
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 60
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  caption: license.longName,
  nodeStart: (
    <Information
      multiline
      headerText={license.longName}
      text={license.description}
      placement="top-end"
      offsetX={6}
      offsetY={12}
    />
  ),
}))

type VideoFormProps = {
  onSubmit: (data: VideoFormData) => void
  setFormStatus: (data: VideoWorkspaceFormStatus | null) => void
}

export const VideoForm: FC<VideoFormProps> = memo(({ onSubmit, setFormStatus }) => {
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const [cachedEditedVideoId, setCachedEditedVideoId] = useState('')
  const [royaltiesFieldEnabled, setRoyaltiesFieldEnabled] = useState(false)
  const [titleTooltipVisible, setTitleTooltipVisible] = useState(true)
  const mintNftFormFieldRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLTextAreaElement>(null)
  const [openEditDialog, closeEditDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      onClick: () => {
        reset()
        closeEditDialog()
      },
      text: 'Confirm and discard',
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeEditDialog(),
    },
  })

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
    mode: 'onSubmit',
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
  } = useVideoFormAssets(watch, getValues, setValue, dirtyFields, trigger, errors)

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
        ...((isNew || dirtyFields.enableComments) && data.enableComments != null
          ? { enableComments: data.enableComments }
          : {}),
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

      const nftMetadata: NftIssuanceInputMetadata | undefined =
        data.mintNft && !videoFieldsLocked
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
    videoFieldsLocked,
    flushDraftSave,
    isNew,
    onSubmit,
    resolveAsset,
    thumbnailHashPromise,
    videoHashPromise,
  ])

  const actionBarPrimaryText = watch('mintNft')
    ? !isEdit
      ? 'Publish & mint'
      : 'Publish changes'
    : !isEdit
    ? 'Publish & upload'
    : 'Publish changes'

  const isFormValid = (isEdit || !!mediaAsset) && !!thumbnailAsset && isValid
  const formStatus: VideoWorkspaceFormStatus = useMemo(
    () => ({
      hasUnsavedAssets,
      isDirty,
      isDisabled: isEdit ? !isDirty : false,
      actionBarPrimaryText,
      isValid: isFormValid,
      triggerFormSubmit: handleSubmit,
      triggerReset: openEditDialog,
    }),
    [actionBarPrimaryText, handleSubmit, hasUnsavedAssets, isDirty, isEdit, isFormValid, openEditDialog]
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
      return `${moreSettingsVisible ? 'Hide' : 'Show'} locked options`
    }
    return `Show ${moreSettingsVisible ? 'less' : 'more'} options`
  }

  if (tabDataError || categoriesError) {
    return <ViewErrorFallback />
  }

  const royaltiesField = (
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
      description="Royalties lets you earn commission from every sale of this NFT."
      label="Royalties"
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
        nodeEnd={
          <Text variant="t300" as="span" color="colorTextMuted">
            %
          </Text>
        }
        disabled={videoFieldsLocked}
      />
    </FormField>
  )

  const videoEditFields = (
    <>
      <FormField optional label="Description" error={errors.description?.message}>
        <TextArea
          counter
          {...register('description', textFieldValidation({ name: 'Description', maxLength: 5000 }))}
          maxLength={5000}
          placeholder="Description of the video to share with your audience"
          error={!!errors.description}
          disabled={videoFieldsLocked}
        />
      </FormField>
      <FormField label="Category" error={errors.category?.message}>
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
      <FormField label="Language">
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
      <FormField label="Visibility">
        <Controller
          name="isPublic"
          control={control}
          defaultValue={true}
          rules={{
            validate: (value) => value !== null,
          }}
          render={({ field: { value, onChange } }) => (
            <OptionCardGroupRadio
              selectedValue={value}
              disabled={videoFieldsLocked}
              onChange={(value) => onChange(value)}
              options={[
                {
                  label: 'Public',
                  caption: 'Everyone can watch your video.',
                  value: true,
                },
                {
                  label: 'Unlisted',
                  caption: 'Anyone with the link can watch your video.',
                  value: false,
                },
              ]}
            />
          )}
        />
      </FormField>
      {!videoFieldsLocked && (
        <>
          <Divider />
          <FormField
            label="NFT"
            description="Minting an NFT creates a record of ownership on the blockchain that can be put on sale. This doesn't impact your intellectual rights to the video."
            ref={mintNftFormFieldRef}
          >
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
                />
              )}
            />
          </FormField>
          {watch('mintNft') && (
            <Banner
              icon={<StyledSvgAlertsInformative24 />}
              title="Heads up!"
              description="You won't be able to edit this video once you mint an NFT for it."
            />
          )}{' '}
          {watch('mintNft') && royaltiesField}
        </>
      )}
    </>
  )

  const alwaysEditableFormFields = (
    <FormField
      label="Comments"
      description="Disabling the comments section does not allow for posting new comments under this video and hides any existing comments made in the past."
    >
      <Controller
        name="enableComments"
        control={control}
        defaultValue={true}
        rules={{
          validate: (value) => value !== null,
        }}
        render={({ field: { value, onChange, ref } }) => (
          <RadioButtonGroup
            ref={ref}
            options={[
              { label: 'Enable comments', value: true },
              { label: 'Disable comments', value: false },
            ]}
            error={!!errors.isExplicit}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          />
        )}
      />
    </FormField>
  )

  return (
    <FormWrapper as="form" onSubmit={handleSubmit}>
      <Controller
        name="assets"
        control={control}
        rules={{
          validate: (value) => {
            if (!!value.video.id && !!value.thumbnail.cropId) {
              return true
            }
            if (!value.video.id) {
              return 'Select video file'
            }
            if (!value.thumbnail.cropId) {
              return 'Select image file'
            }
          },
        }}
        render={() => (
          // don't remove this div
          // without this element position sticky won't work
          <div>
            {errors.assets && (
              <FileValidationBanner
                icon={<SvgAlertsWarning24 width={24} height={24} />}
                description={
                  <Text as="span" variant="t200">
                    {(errors?.assets as FieldError)?.message}
                  </Text>
                }
              />
            )}
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
          rules={textFieldValidation({
            name: 'Video title',
            minLength: MIN_TITLE_LENGTH,
            maxLength: MAX_TITLE_LENGTH,
            required: true,
          })}
          render={({ field: { value, onChange } }) => (
            <StyledTitleArea
              ref={titleInputRef}
              onChange={onChange}
              value={value}
              min={MIN_TITLE_LENGTH}
              max={MAX_TITLE_LENGTH}
              placeholder="Enter video title"
              disabled={videoFieldsLocked}
              error={!!errors.title}
              onFocus={() => setTitleTooltipVisible(false)}
              onBlur={() => setTitleTooltipVisible(true)}
            />
          )}
        />
        {videoFieldsLocked && (
          <Banner
            icon={<StyledSvgAlertsInformative24 />}
            title="There's an NFT for this video"
            description="Only selected options can be changed since there's an NFT minted for this video."
          />
        )}
        {titleTooltipVisible && <Tooltip text="Click to edit" placement="top-start" reference={titleInputRef} />}
        {videoFieldsLocked && alwaysEditableFormFields}
        {!videoFieldsLocked && videoEditFields}
        <Divider />
        <div>
          <TextButton
            size="large"
            iconPlacement="right"
            icon={moreSettingsVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
            onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
          >
            {getHiddenSectionLabel()}
          </TextButton>
          <Text as="p" variant="t200" color="colorText" margin={{ top: 2 }}>
            {!videoFieldsLocked
              ? `License, comments, mature content, paid promotion, published date${isEdit ? ', delete video' : ''}`
              : 'Royalties, description, category, language, visibility, license, mature content, paid promotion, published date'}
          </Text>
        </div>
        <MoreSettingsSection expanded={moreSettingsVisible}>
          {videoFieldsLocked && royaltiesField}
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
                  textFieldValidation({ name: 'License', maxLength: 5000, required: true })
                )}
                maxLength={5000}
                placeholder="Describe your custom license"
                error={!!errors.licenseCustomText}
              />
            </FormField>
          )}
          {!videoFieldsLocked && alwaysEditableFormFields}
          <FormField label="Mature content">
            <Controller
              name="isExplicit"
              control={control}
              defaultValue={false}
              rules={{
                validate: (value) => value !== null,
              }}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value ?? false}
                  label="My video contains mature content such as sex, violence, etc."
                  onChange={onChange}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField label="Paid promotion">
            <Controller
              name="hasMarketing"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value ?? false}
                  label="My video contains paid promotion content."
                  onChange={onChange}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField
            label="Published before"
            error={errors.publishedBeforeJoystream ? 'Please provide a valid date.' : ''}
            optional
            description="If you are reuploading content that you already published in the past on another platform you can enter the original publish date below."
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
          {isEdit && !videoFieldsLocked && (
            <Button
              fullWidth
              size="large"
              variant="destructive-secondary"
              icon={<SvgActionTrash />}
              onClick={handleDeleteVideo}
            >
              Delete video
            </Button>
          )}
        </MoreSettingsSection>
      </InputsContainer>
    </FormWrapper>
  )
})

VideoForm.displayName = 'VideoForm'
