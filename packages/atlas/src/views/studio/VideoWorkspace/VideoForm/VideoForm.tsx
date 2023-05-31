import { formatISO, isValid as isValidDate } from 'date-fns'
import { FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'

import { License } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionChevronB, SvgActionChevronT, SvgActionTrash, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button, TextButton } from '@/components/_buttons/Button'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { SubtitlesCombobox } from '@/components/_inputs/SubtitlesComboBox'
import { Switch } from '@/components/_inputs/Switch'
import { TextArea } from '@/components/_inputs/TextArea'
import { AlertDialogModal } from '@/components/_overlays/AlertDialogModal'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { NftIssuanceInputMetadata, VideoInputAssets, VideoInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useBloatFeesAndPerMbFees, useFee, useJoystream } from '@/providers/joystream'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import {
  VideoFormAssetData,
  VideoFormAssets,
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoAssets,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { SubtitlesInput } from '@/types/subtitles'
import { createId } from '@/utils/createId'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger } from '@/utils/logs'
import { convertSrtToVtt } from '@/utils/subtitles'

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
const JOYSTREAM_LICENSE_CODE = 1009
const SCROLL_TIMEOUT = 500
const MINT_NFT_TIMEOUT = 800
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 84
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
const MINTING_CONFIRMATION_ID = 'minting-confirmation'

type VideoFormProps = {
  onSubmit: (data: VideoFormData) => void
  setFormStatus: (data: VideoWorkspaceFormStatus | null) => void
}

export const VideoForm: FC<VideoFormProps> = memo(({ onSubmit, setFormStatus }) => {
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const [cachedEditedVideoId, setCachedEditedVideoId] = useState('')
  const [royaltiesFieldEnabled, setRoyaltiesFieldEnabled] = useState(false)
  const [titleTooltipVisible, setTitleTooltipVisible] = useState(true)
  const [showMintConfirmationDialog, setShowMintConfirmationDialog] = useState(false)
  const [dismissMintConfirmation, setDismissMintConfirmation] = useState(false)
  const mintNftFormFieldRef = useRef<HTMLDivElement>(null)
  const assetErrorBanner = useRef<HTMLDivElement>(null)
  const { memberId, channelId } = useUser()
  const { displaySnackbar } = useSnackbar()

  const updateMintConfirmationDismiss = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const mintConfirmationDismissed = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === MINTING_CONFIRMATION_ID)
  )

  const { editedVideoInfo } = useVideoWorkspace()
  const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData()

  const {
    chainState: { nftMaxCreatorRoyaltyPercentage, nftMinCreatorRoyaltyPercentage },
  } = useJoystream()

  const deleteVideo = useDeleteVideo()
  const isEdit = !editedVideoInfo?.isDraft
  const isNew = !isEdit
  const mintNft = editedVideoInfo?.mintNft

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
  })
  const formData = getValues()

  const videoFieldsLocked = tabData?.mintNft && isEdit

  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)

  const createVideoInputMetadata = useCallback(
    (data: VideoWorkspaceVideoFormFields): VideoInputMetadata => {
      const videoInputFile = data?.assets?.video
      const license = {
        code: data.licenseCode ?? undefined,
        attribution: data.licenseAttribution ?? undefined,
        customText: data.licenseCustomText ?? undefined,
      }
      const anyLicenseFieldsDirty =
        dirtyFields.licenseCode || dirtyFields.licenseAttribution || dirtyFields.licenseCustomText

      return {
        ...(isNew || dirtyFields.title ? { title: data.title } : {}),
        ...(isNew || dirtyFields.description ? { description: data.description } : {}),
        ...(isNew || dirtyFields.category ? { category: data.category } : {}),
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
        ...((isNew || dirtyFields.publishedBeforeJoystream) &&
        data.publishedBeforeJoystream != null &&
        isValidDate(data.publishedBeforeJoystream)
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
        ...(isNew || dirtyFields.subtitlesArray
          ? {
              subtitles: data.subtitlesArray?.map((subtitle, idx) => ({
                id: subtitle.id || `new-subtitle-${idx}`,
                language: subtitle.languageIso,
                type: subtitle?.type,
                mimeType: 'text/vtt',
              })),
            }
          : {}),
        clearSubtitles: !data.subtitlesArray?.length,
      }
    },
    [dirtyFields, isNew]
  )

  const createNftInputMetadata = useCallback(
    (data: VideoWorkspaceVideoFormFields): NftIssuanceInputMetadata | undefined => {
      return data.mintNft && !videoFieldsLocked
        ? {
            royalty: data.nftRoyaltiesPercent || undefined,
          }
        : undefined
    },
    [videoFieldsLocked]
  )

  // for fee only
  const createBasicVideoInputAssetsInfo = (
    assets?: VideoWorkspaceVideoAssets,
    subtitles?: SubtitlesInput[]
  ): VideoInputAssets => {
    if (!assets) {
      return {}
    }
    return {
      ...(assets.video?.blob?.size
        ? {
            media: {
              ipfsHash: '',
              size: assets.video.blob.size,
            },
          }
        : {}),
      ...(assets.thumbnail?.blob?.size
        ? {
            thumbnailPhoto: {
              ipfsHash: '',
              size: assets.thumbnail.blob.size,
            },
          }
        : {}),
      ...(subtitles?.length
        ? { subtitles: subtitles.map((subtitle) => ({ ipfsHash: '', size: subtitle.file?.size || 0 })) }
        : {}),
    }
  }

  const videoInputMetadata = createVideoInputMetadata(formData)
  const nftMetadata = createNftInputMetadata(formData)
  const assets = createBasicVideoInputAssetsInfo(formData.assets, formData.subtitlesArray ?? undefined)

  const { videoStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const isSigned = memberId && channelId
  const { fullFee: createVideoFee, loading: createVideoFeeLoading } = useFee(
    'createVideoTx',
    isSigned && isNew
      ? [
          memberId,
          channelId,
          videoInputMetadata,
          nftMetadata,
          assets,
          dataObjectStateBloatBondValue.toString(),
          videoStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    assets
  )
  const { fullFee: updateVideoFee, loading: updateVideoFeeLoading } = useFee(
    'updateVideoTx',
    isSigned && isEdit && editedVideoInfo.id
      ? [
          editedVideoInfo.id,
          memberId,
          videoInputMetadata,
          nftMetadata,
          assets,
          [], // provide empty removedAssetsId array to simplify fee calculation
          dataObjectStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    assets
  )

  // manage assets used by the form
  const {
    handleVideoFileChange,
    handleThumbnailFileChange,
    videoHashPromise,
    thumbnailHashPromise,
    files,
    mediaAsset,
    thumbnailAsset,
    subtitlesHashesPromises,
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
      () => setValue('mintNft', tabData.mintNft || mintNft, { shouldDirty: true }),
      MINT_NFT_TIMEOUT
    )

    return () => {
      clearTimeout(scrollTimeout)
      clearTimeout(setMintNftTimeout)
    }
  }, [touchedFields, mintNft, setValue, tabData, getValues])

  const submitHandler = useMemo(
    () =>
      createSubmitHandler(async (data) => {
        if (!editedVideoInfo) {
          return
        }

        const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets

        if (isNew && (!videoInputFile.blob || !videoHashPromise)) {
          ConsoleLogger.error('Video file cannot be empty')
          return
        }

        if (isNew && (!thumbnailAsset || !thumbnailHashPromise)) {
          ConsoleLogger.error('Thumbnail cannot be empty')
          return
        }

        const metadata = createVideoInputMetadata(data)

        const videoWidth = videoInputFile?.mediaPixelWidth
        const videoHeight = videoInputFile?.mediaPixelHeight

        const mappedSubtitles: PartialBy<VideoFormAssetData, 'blob'>[] | undefined = data?.subtitlesArray?.map(
          (subtitle, idx) => ({
            id: metadata.subtitles?.[idx].id || createId(),
            blob: subtitle.file,
            hashPromise: subtitlesHashesPromises[idx] || Promise.resolve(''),
            subtitlesLanguageIso: subtitle.languageIso,
          })
        )
        const mappedFilteredSubtitles: VideoFormAssets['subtitles'] = mappedSubtitles?.filter(
          (subtitle): subtitle is VideoFormAssetData => !!subtitle.blob
        )

        const assets: VideoFormAssets = {
          ...(videoInputFile?.blob && videoInputFile.id && videoHashPromise
            ? {
                media: {
                  id: videoInputFile.id,
                  blob: videoInputFile.blob,
                  url: videoInputFile.url || undefined,
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
                  name: (thumbnailInputFile.originalBlob as File)?.name,
                },
              }
            : {}),
          ...(mappedFilteredSubtitles?.length
            ? {
                subtitles: mappedFilteredSubtitles,
              }
            : {}),
        }

        const nftMetadata = createNftInputMetadata(data)

        onSubmit({
          metadata,
          assets,
          nftMetadata,
        })
      }),
    [
      createNftInputMetadata,
      createSubmitHandler,
      createVideoInputMetadata,
      editedVideoInfo,
      isNew,
      onSubmit,
      subtitlesHashesPromises,
      thumbnailAsset,
      thumbnailHashPromise,
      videoHashPromise,
    ]
  )

  const handleSubmit = useCallback(() => {
    flushDraftSave()

    if (!mintConfirmationDismissed && formData.mintNft) {
      setShowMintConfirmationDialog(true)
      return
    }

    return submitHandler()
  }, [flushDraftSave, formData.mintNft, mintConfirmationDismissed, submitHandler])

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
      actionBarFee: isEdit ? updateVideoFee : createVideoFee,
      actionBarFeeLoading: isEdit ? updateVideoFeeLoading : createVideoFeeLoading,
      isValid: isFormValid,
      triggerFormSubmit: handleSubmit,
    }),
    [
      actionBarPrimaryText,
      createVideoFee,
      createVideoFeeLoading,
      handleSubmit,
      hasUnsavedAssets,
      isDirty,
      isEdit,
      isFormValid,
      updateVideoFee,
      updateVideoFeeLoading,
    ]
  )

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus(formStatus)
  }, [formStatus, setFormStatus])

  useLayoutEffect(() => {
    if (errors.assets && assetErrorBanner.current) {
      assetErrorBanner.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.assets])

  const handleDeleteVideo = () => {
    editedVideoInfo && deleteVideo(editedVideoInfo.id)
  }

  const categoriesSelectItems: SelectItem[] =
    displayCategories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.defaultVideoCategory,
    })) || []

  const getHiddenSectionLabel = () => {
    if (videoFieldsLocked) {
      return `${moreSettingsVisible ? 'Hide' : 'Show'} locked options`
    }
    return `Show ${moreSettingsVisible ? 'less' : 'more'} options`
  }

  if (tabDataError) {
    return <ViewErrorFallback />
  }

  const royaltiesField = (
    <FormField
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
      description="Royalties let you earn commissions from every sale of this NFT. Sale commissions go out to your channel account."
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
          {...register('description', {
            maxLength: {
              value: 5000,
              message: 'Enter a valid description.',
            },
          })}
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
          rules={{
            required: {
              value: true,
              message: 'Select a video category.',
            },
          }}
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
      <FormField label="Language" error={errors.language?.message}>
        <Controller
          name="language"
          control={control}
          rules={requiredValidation('Video language')}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              items={[
                { name: 'TOP LANGUAGES', value: '', isSeparator: true },
                ...atlasConfig.derived.popularLanguagesSelectValues,
                { name: 'ALL LANGUAGES', value: '', isSeparator: true },
                ...atlasConfig.derived.languagesSelectValues,
              ]}
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
              description="You won’t be able to edit this video once you mint an NFT for it. Sale revenue and potential commissions will go out to your channel account, from where they can be withdrawn to your membership account."
            />
          )}{' '}
          {watch('mintNft') && royaltiesField}
        </>
      )}
    </>
  )

  return (
    <FormWrapper as="form">
      <AlertDialogModal
        show={showMintConfirmationDialog}
        title="Mint NFT for this video?"
        description="Minting NFT for this video means you won’t be able to edit in the future. Are you sure you want to continue?"
        additionalActionsNode={
          <Checkbox value={dismissMintConfirmation} onChange={setDismissMintConfirmation} label="Don't ask me again" />
        }
        primaryButton={{
          text: 'Publish & mint',
          onClick: () => {
            setShowMintConfirmationDialog(false)
            if (dismissMintConfirmation) {
              updateMintConfirmationDismiss(MINTING_CONFIRMATION_ID, true)
            }
            submitHandler()
          },
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setShowMintConfirmationDialog(false),
        }}
      />
      <Controller
        name="assets"
        control={control}
        rules={{
          validate: (value) => {
            if (!value) return false

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
              <div ref={assetErrorBanner}>
                <FileValidationBanner
                  icon={<SvgAlertsWarning24 width={24} height={24} />}
                  description={
                    <Text as="span" variant="t200">
                      {(errors?.assets as FieldError)?.message}
                    </Text>
                  }
                />
              </div>
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
          rules={{
            maxLength: {
              value: MAX_TITLE_LENGTH,
              message: 'Enter a valid video title.',
            },
            minLength: {
              value: MIN_TITLE_LENGTH,
              message: 'Enter a valid video title.',
            },
            required: {
              value: true,
              message: 'Enter a video title.',
            },
          }}
          render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
            return (
              <Tooltip text="Click to edit" placement="top-start" hidden={!titleTooltipVisible || videoFieldsLocked}>
                <FormField error={error?.message}>
                  <StyledTitleArea
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    min={MIN_TITLE_LENGTH}
                    max={MAX_TITLE_LENGTH}
                    placeholder="Enter video title"
                    disabled={videoFieldsLocked}
                    error={!!error}
                    onFocus={() => setTitleTooltipVisible(false)}
                    onBlur={() => setTitleTooltipVisible(true)}
                  />
                </FormField>
              </Tooltip>
            )
          }}
        />
        {videoFieldsLocked && (
          <Banner
            icon={<StyledSvgAlertsInformative24 />}
            title="There's an NFT for this video"
            description="You can't edit or delete this video, having minted an NFT for it."
          />
        )}
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
              ? `Subtitles, license, comments, mature content, paid promotion, published date${
                  isEdit ? ', delete video' : ''
                }`
              : 'Subtitles, royalties, description, category, language, visibility, subtitles, license, comments, mature content, paid promotion, published date'}
          </Text>
        </div>
        <MoreSettingsSection expanded={moreSettingsVisible}>
          <Controller
            control={control}
            name="subtitlesArray"
            rules={{
              validate: (value) => {
                const languageWithoutFile = value?.find((language) => !language.file && !language.asset)
                return value && languageWithoutFile ? 'Provide a file for every new subtitles language.' : true
              },
            }}
            render={({ field: { onChange, value: subtitlesArray } }) => {
              return (
                <FormField label="Subtitles" optional error={(errors?.subtitlesArray as FieldError)?.message}>
                  <SubtitlesCombobox
                    disabled={videoFieldsLocked}
                    error={!!errors?.subtitlesArray}
                    onLanguageAdd={(subtitlesLanguage) => {
                      onChange([...(subtitlesArray ? subtitlesArray : []), { ...subtitlesLanguage }])
                    }}
                    onLanguageDelete={(subtitlesLanguage) => {
                      onChange(
                        subtitlesArray?.filter(
                          (prevSubtitles) =>
                            !(
                              prevSubtitles.languageIso === subtitlesLanguage.languageIso &&
                              prevSubtitles.type === subtitlesLanguage.type
                            )
                        )
                      )
                    }}
                    onSubtitlesAdd={async ({ languageIso, file, type }) => {
                      const isSrt = file && file?.name.match(/\.srt$/)
                      let newFile = file
                      if (isSrt) {
                        try {
                          newFile = await convertSrtToVtt(file)
                        } catch (error) {
                          displaySnackbar({
                            title: 'Something went wrong',
                            description:
                              'There was a problem with processing subtitles file. Try again or select different file.',
                            iconType: 'error',
                          })
                          return
                        }
                      }
                      onChange(
                        subtitlesArray?.map((subtitles) =>
                          subtitles.languageIso === languageIso && subtitles.type === type
                            ? { ...subtitles, file: newFile, isUploadedAsSrt: isSrt }
                            : subtitles
                        )
                      )
                    }}
                    languagesIso={atlasConfig.content.languages.map(({ isoCode }) => isoCode)}
                    popularLanguagesIso={atlasConfig.content.popularLanguages}
                    subtitlesArray={subtitlesArray}
                  />
                </FormField>
              )
            }}
          />

          {videoFieldsLocked && royaltiesField}
          {videoFieldsLocked && videoEditFields}
          <Controller
            name="licenseCode"
            defaultValue={JOYSTREAM_LICENSE_CODE}
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
                {...register('licenseCustomText', {
                  maxLength: {
                    value: 5000,
                    message: 'Enter a valid custom license.',
                  },
                  required: {
                    value: true,
                    message: 'Provide a custom license.',
                  },
                })}
                maxLength={5000}
                placeholder="Describe your custom license"
                error={!!errors.licenseCustomText}
              />
            </FormField>
          )}
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
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
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
            error={errors.publishedBeforeJoystream ? 'Enter a valid date.' : ''}
            optional
            description="If you are reuploading content that you already published in the past on another platform you can enter the original publish date below."
          >
            <Controller
              name="publishedBeforeJoystream"
              control={control}
              rules={{
                validate: (value) => {
                  return pastDateValidation(value)
                },
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
