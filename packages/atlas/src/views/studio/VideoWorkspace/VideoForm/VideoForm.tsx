import { useApolloClient } from '@apollo/client'
import { formatISO, isValid as isDateValid } from 'date-fns'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FieldNamesMarkedBoolean, useForm } from 'react-hook-form'
import useMeasure from 'react-use-measure'

import { useCategories, useVideo } from '@/api/hooks'
import {
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  License,
  VideoOrderByInput,
} from '@/api/queries'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB, SvgActionChevronT, SvgControlsCancel } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardRadio } from '@/components/_inputs/OptionCard'
import { RadioButton } from '@/components/_inputs/RadioButton'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { TextField } from '@/components/_inputs/TextField'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { VideoExtrinsicResult, VideoInputAssets, VideoInputMetadata } from '@/joystream-lib'
import { useAssetStore, useRawAssetResolver } from '@/providers/assets'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useStartFileUpload } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import {
  DEFAULT_LICENSE_ID,
  VideoWorkspace,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { writeVideoDataInCache } from '@/utils/cachingAssets'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { useVideoFormAssets } from '@/views/studio/VideoWorkspace/VideoForm/hooks'

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
} from './VideoForm.styles'

const CUSTOM_LICENSE_CODE = 1000
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  badgeText: license.code === DEFAULT_LICENSE_ID ? 'Default' : undefined,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type VideoFormProps = {
  fee: number
  setHasUnsavedAssets: (hasUnsavedAssets: boolean) => void
}

export const VideoForm: React.FC<VideoFormProps> = React.memo(({ fee, setHasUnsavedAssets }) => {
  const [actionBarRef, actionBarBounds] = useMeasure()
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const mdMatch = useMediaMatch('md')
  const { joystream, proxyCallback } = useJoystream()
  const resolveAsset = useRawAssetResolver()
  const startFileUpload = useStartFileUpload()
  const client = useApolloClient()
  const handleTransaction = useTransaction()
  const { activeChannelId, activeMemberId } = useAuthorizedUser()
  const { setEditedVideo, setIsWorkspaceOpen, editedVideoInfo } = useVideoWorkspace()
  const [cachedEditedVideoId, setCachedEditedVideoId] = useState<string>('')
  const { video } = useVideo(editedVideoInfo?.id || '', { fetchPolicy: 'cache-only', skip: !editedVideoInfo?.id })
  const { updateDraft, addDraft, removeDrafts } = useDraftStore((state) => state.actions)

  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

  const deleteVideo = useDeleteVideo()
  const isEdit = !editedVideoInfo?.isDraft

  const { categories, error: categoriesError } = useCategories(undefined, {
    onError: (error) => SentryLogger.error('Failed to fetch categories', 'VideoWorkspace', error),
  })
  const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData()

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

  const {
    handleVideoFileChange,
    handleThumbnailFileChange,
    videoHashPromise,
    thumbnailHashPromise,
    files,
    mediaAsset,
    thumbnailAsset,
  } = useVideoFormAssets(watch, getValues, setValue, dirtyFields, setHasUnsavedAssets)

  const addAsset = useAssetStore((state) => state.actions.addAsset)

  // reset form whenever edited video gets updated
  useEffect(() => {
    if (editedVideoInfo.id === cachedEditedVideoId || !tabData || tabDataLoading) {
      return
    }

    setCachedEditedVideoId(editedVideoInfo.id)
    reset(tabData)
  }, [tabData, tabDataLoading, reset, editedVideoInfo.id, cachedEditedVideoId])

  // we pass the functions explicitly so the debounced function doesn't need to change when those functions change
  const debouncedDraftSave = useRef(
    debounce(
      (
        tab: VideoWorkspace,
        data: VideoWorkspaceVideoFormFields,
        addDraftFn: typeof addDraft,
        updateDraftFn: typeof updateDraft,
        updateSelectedTabFn: typeof setEditedVideo
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
          updateSelectedTabFn({ ...tab, isNew: false })
        } else {
          updateDraftFn(tab.id, draftData)
        }
      },
      700
    )
  )

  const onSubmit = useCallback(
    async (
      data: VideoWorkspaceVideoFormFields,
      dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>,
      callback?: () => void
    ) => {
      if (!editedVideoInfo || !joystream) {
        return
      }
      const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets
      const videoAsset = resolveAsset(videoInputFile.id)
      const thumbnailAsset = resolveAsset(thumbnailInputFile.cropId)

      const isNew = !isEdit
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

      const assets: VideoInputAssets = {}

      const processAssets = async () => {
        if (videoAsset?.blob && videoHashPromise) {
          const ipfsHash = await videoHashPromise
          assets.media = {
            size: videoAsset.blob.size,
            ipfsHash,
            replacedDataObjectId: video?.media?.id,
          }
        } else if (dirtyFields.assets?.video) {
          ConsoleLogger.warn('Missing video data')
        }

        if (thumbnailAsset?.blob && thumbnailHashPromise) {
          const ipfsHash = await thumbnailHashPromise
          assets.thumbnailPhoto = {
            size: thumbnailAsset.blob.size,
            ipfsHash,
            replacedDataObjectId: video?.thumbnailPhoto?.id,
          }
        } else if (dirtyFields.assets?.thumbnail) {
          ConsoleLogger.warn('Missing thumbnail data')
        }
      }

      const uploadAssets = async ({ videoId, assetsIds }: VideoExtrinsicResult) => {
        const uploadPromises: Promise<unknown>[] = []
        if (videoAsset?.blob && assetsIds.media) {
          const { mediaPixelWidth: width, mediaPixelHeight: height } = videoInputFile
          const uploadPromise = startFileUpload(videoAsset.blob, {
            id: assetsIds.media,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
              title: metadata.title,
            },
            type: 'video',
            dimensions: width && height ? { width, height } : undefined,
          })
          uploadPromises.push(uploadPromise)
        }
        if (thumbnailAsset?.blob && assetsIds.thumbnailPhoto) {
          const uploadPromise = startFileUpload(thumbnailAsset.blob, {
            id: assetsIds.thumbnailPhoto,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
            },
            type: 'thumbnail',
            dimensions: thumbnailInputFile.assetDimensions,
            imageCropData: thumbnailInputFile.imageCropData,
          })
          uploadPromises.push(uploadPromise)
        }
        Promise.all(uploadPromises).catch((e) => SentryLogger.error('Unexpected upload failure', 'VideoWorkspace', e))
      }

      const refetchDataAndUploadAssets = async (result: VideoExtrinsicResult) => {
        const { assetsIds, videoId } = result

        // start asset upload
        uploadAssets(result)

        // add resolution for newly created asset
        if (assetsIds.thumbnailPhoto) {
          addAsset(assetsIds.thumbnailPhoto, { url: thumbnailAsset?.url })
        }

        const fetchedVideo = await client.query<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>({
          query: GetVideosConnectionDocument,
          variables: {
            orderBy: VideoOrderByInput.CreatedAtDesc,
            where: {
              id_eq: videoId,
            },
          },
          fetchPolicy: 'network-only',
        })

        if (isNew) {
          if (fetchedVideo.data.videosConnection?.edges[0]) {
            writeVideoDataInCache({
              edge: fetchedVideo.data.videosConnection.edges[0],
              client,
            })
          }

          setEditedVideo({
            id: videoId,
            isDraft: false,
            isNew: false,
          })
          removeDrafts([editedVideoInfo?.id])
        }

        // allow for the changes in refetched video to propagate first
        setTimeout(() => {
          callback?.()
        })
      }

      const completed = await handleTransaction({
        preProcess: processAssets,
        txFactory: async (updateStatus) =>
          isNew
            ? (
                await joystream.extrinsics
              ).createVideo(activeMemberId, activeChannelId, metadata, assets, proxyCallback(updateStatus))
            : (
                await joystream.extrinsics
              ).updateVideo(editedVideoInfo.id, activeMemberId, metadata, assets, proxyCallback(updateStatus)),
        onTxSync: refetchDataAndUploadAssets,
        successMessage: {
          title: isNew ? 'Video successfully created!' : 'Video successfully updated!',
          description: isNew
            ? 'Your video was created and saved on the blockchain. Upload of video assets may still be in progress.'
            : 'Changes to your video were saved on the blockchain.',
        },
      })

      if (completed) {
        setIsWorkspaceOpen(false)
      }
    },
    [
      editedVideoInfo,
      joystream,
      resolveAsset,
      isEdit,
      handleTransaction,
      videoHashPromise,
      thumbnailHashPromise,
      video?.media?.id,
      video?.thumbnailPhoto?.id,
      startFileUpload,
      activeChannelId,
      client,
      addAsset,
      setEditedVideo,
      removeDrafts,
      activeMemberId,
      proxyCallback,
      setIsWorkspaceOpen,
    ]
  )

  const handleSubmit = useMemo(
    () =>
      createSubmitHandler(async (data: VideoWorkspaceVideoFormFields) => {
        // do initial validation
        if (!isEdit && !data.assets.video.id) {
          ConsoleLogger.error('Video file cannot be empty')
          return
        }
        if (!data.assets.thumbnail.cropId) {
          ConsoleLogger.error('Thumbnail cannot be empty')
          return
        }

        debouncedDraftSave.current.flush()

        await onSubmit(data, dirtyFields)
      }),
    [createSubmitHandler, dirtyFields, isEdit, onSubmit]
  )

  useEffect(() => {
    const subscription = watch((data) => {
      if (!Object.keys(dirtyFields).length) {
        return
      }

      if (editedVideoInfo?.isDraft) {
        debouncedDraftSave.current(editedVideoInfo, data, addDraft, updateDraft, setEditedVideo)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [addDraft, dirtyFields, editedVideoInfo, updateDraft, setEditedVideo, watch])

  const handleDeleteVideo = () => {
    editedVideoInfo && deleteVideo(editedVideoInfo.id)
  }

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  const isFormValid = !!mediaAsset && !!thumbnailAsset && isValid

  const isDisabled = useMemo(
    () => !isDirty || (!isEdit && !mediaAsset) || !thumbnailAsset || !isValid || nodeConnectionStatus !== 'connected',
    [isDirty, isEdit, isValid, mediaAsset, nodeConnectionStatus, thumbnailAsset]
  )

  const actionBarPrimaryButton = useMemo(
    () => ({
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
    }),
    [handleSubmit, isDisabled, isEdit, isFormValid]
  )

  const actionBarSecondaryButton = useMemo(
    () => ({
      visible: isEdit && isDirty && nodeConnectionStatus === 'connected',
      text: 'Cancel',
      onClick: () => reset(),
      icon: <SvgControlsCancel width={16} height={16} />,
    }),
    [isDirty, isEdit, nodeConnectionStatus, reset]
  )

  const actionBarDraftBadge = useMemo(
    () => ({
      visible: !isEdit,
      text: mdMatch ? 'Drafts are saved automatically' : 'Saving drafts',
      tooltip: {
        text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
      },
    }),
    [isEdit, mdMatch]
  )

  if (tabDataError || categoriesError) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <FormScrolling actionBarHeight={actionBarBounds.height} isEdit={isEdit} data-scroll-lock-scrollable>
        <FormWrapper as="form">
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
      </FormScrolling>
      <StyledActionBar
        ref={actionBarRef}
        isEdit={isEdit}
        primaryText={`Fee: ${fee} Joy`}
        secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        primaryButton={actionBarPrimaryButton}
        secondaryButton={actionBarSecondaryButton}
        draftBadge={actionBarDraftBadge}
        fullWidth={true}
      />
    </>
  )
})

VideoForm.displayName = 'VideoForm'
