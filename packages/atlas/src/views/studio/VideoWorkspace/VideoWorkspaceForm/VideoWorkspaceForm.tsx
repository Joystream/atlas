import { useApolloClient } from '@apollo/client'
import { formatISO, isValid as isDateValid } from 'date-fns'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, DeepMap, FieldNamesMarkedBoolean, useForm } from 'react-hook-form'
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
import { FileErrorType, ImageInputFile, VideoInputFile } from '@/components/_inputs/MultiFileSelect'
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
import { useAssetStore, useRawAsset, useRawAssetResolver } from '@/providers/assets'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useStartFileUpload } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import {
  DEFAULT_LICENSE_ID,
  VideoWorkspace,
  VideoWorkspaceAssets,
  VideoWorkspaceCachedDirtyFormData,
  VideoWorkspaceFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { FileType } from '@/types/files'
import { writeVideoDataInCache } from '@/utils/cachingAssets'
import { createId } from '@/utils/createId'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

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
} from './VideoWorkspaceForm.styles'

const CUSTOM_LICENSE_CODE = 1000
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  badgeText: license.code === DEFAULT_LICENSE_ID ? 'Default' : undefined,
  tooltipText: license.description,
  tooltipHeaderText: license.longName,
}))

type VideoWorkspaceFormProps = {
  onThumbnailFileChange: (file: Blob) => void
  onVideoFileChange: (file: Blob) => void
  editedVideoInfo?: VideoWorkspace
  fee: number
  thumbnailHashPromise: Promise<string> | null
  videoHashPromise: Promise<string> | null
  setAssetsCache: (assets: VideoWorkspaceAssets | null) => void
}

type ValueOf<T> = T[keyof T]

export const VideoWorkspaceForm: React.FC<VideoWorkspaceFormProps> = React.memo(
  ({
    editedVideoInfo,
    onThumbnailFileChange,
    onVideoFileChange,
    fee,
    thumbnailHashPromise,
    videoHashPromise,
    setAssetsCache,
  }) => {
    const { setVideoWorkspaceState } = useVideoWorkspace()
    const isEdit = !editedVideoInfo?.isDraft
    const [actionBarRef, actionBarBounds] = useMeasure()
    const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
    const mdMatch = useMediaMatch('md')
    const { joystream, proxyCallback } = useJoystream()
    const resolveAsset = useRawAssetResolver()
    const startFileUpload = useStartFileUpload()
    const client = useApolloClient()
    const handleTransaction = useTransaction()
    const { activeChannelId, activeMemberId } = useAuthorizedUser()
    const removeDrafts = useDraftStore((state) => state.actions.removeDrafts)
    const [forceReset, setForceReset] = useState(false)
    const [fileSelectError, setFileSelectError] = useState<string | null>(null)
    const [cachededitedVideoInfoId, setCachededitedVideoInfoId] = useState<string | null>(null)
    const { setEditedVideo, videoWorkspaceState } = useVideoWorkspace()
    const [videoCachedDirtyFormData, setVideoCachedDirtyFormData] = useState<VideoWorkspaceCachedDirtyFormData>()
    const { video } = useVideo(editedVideoInfo?.id || '', { fetchPolicy: 'cache-only', skip: !editedVideoInfo?.id })
    const { updateDraft, addDraft } = useDraftStore((state) => state.actions)

    const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

    const deleteVideo = useDeleteVideo()

    const { categories, error: categoriesError } = useCategories(undefined, {
      onError: (error) => SentryLogger.error('Failed to fetch categories', 'VideoWorkspace', error),
    })
    const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData(editedVideoInfo)

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
    })

    const addAsset = useAssetStore((state) => state.actions.addAsset)
    const mediaAsset = useRawAsset(watch('assets.video.contentId'))
    const thumbnailAsset = useRawAsset(watch('assets.thumbnail.cropContentId'))
    const originalThumbnailAsset = useRawAsset(watch('assets.thumbnail.originalContentId'))

    useEffect(() => {
      // reset form for edited video on videoWorkspace close
      if (isEdit && videoWorkspaceState === 'closed' && tabData && !tabDataLoading) {
        reset(tabData)
        setMoreSettingsVisible(false)
      }
    }, [isEdit, reset, setValue, videoWorkspaceState, tabData, tabDataLoading])
    useEffect(() => {
      // reset multifileselect when videoWorkspaceState is closed
      if (videoWorkspaceState === 'closed') {
        setVideoCachedDirtyFormData({})

        if (isEdit) {
          return
        }

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
          tab: VideoWorkspace,
          data: VideoWorkspaceFormFields,
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

    const debouncedSeteditedVideoInfoCachedDirtyFormData = useRef(
      debounce(
        (
          data: VideoWorkspaceFormFields,
          dirtyFields: DeepMap<VideoWorkspaceFormFields, true>,
          seteditedVideoInfoCachedDirtyFormDataFn: typeof setVideoCachedDirtyFormData
        ) => {
          const keysToKeep = Object.keys(dirtyFields) as Array<keyof VideoWorkspaceFormFields>
          const dirtyData = keysToKeep.reduce((acc, curr) => {
            acc[curr] = data[curr]
            return acc
          }, {} as Record<string, unknown>)
          seteditedVideoInfoCachedDirtyFormDataFn(dirtyData)
        },
        700
      )
    )

    useEffect(() => {
      if (tabDataLoading || !tabData || !editedVideoInfo) {
        return
      }

      // only run this hook if the selected tab changed or we forced reset
      if (editedVideoInfo.id === cachededitedVideoInfoId && !forceReset) {
        return
      }
      setCachededitedVideoInfoId(editedVideoInfo.id)
      setForceReset(false)

      // flush any possible changes to the edited draft
      debouncedDraftSave.current.flush()

      setFileSelectError(null)
      reset(tabData)

      if (videoCachedDirtyFormData) {
        // allow a render for the form to reset first and then set fields dirty
        setTimeout(() => {
          const keys = Object.keys(videoCachedDirtyFormData) as Array<keyof VideoWorkspaceFormFields>
          keys.forEach((key) => {
            setValue(key, videoCachedDirtyFormData[key] as ValueOf<VideoWorkspaceFormFields>, {
              shouldDirty: true,
            })
          })
        }, 0)
      }
    }, [
      editedVideoInfo,
      cachededitedVideoInfoId,
      videoCachedDirtyFormData,
      forceReset,
      reset,
      tabDataLoading,
      tabData,
      setEditedVideo,
      setValue,
    ])

    const onSubmit = useCallback(
      async (
        data: VideoWorkspaceFormFields,
        dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceFormFields>,
        callback?: () => void
      ) => {
        if (!editedVideoInfo || !joystream) {
          return
        }
        const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets
        const videoAsset = resolveAsset(videoInputFile.contentId)
        const thumbnailAsset = resolveAsset(thumbnailInputFile.cropContentId)

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
              ...editedVideoInfo,
              id: videoId,
              isDraft: false,
            })
            removeDrafts([editedVideoInfo?.id])
          }
          setAssetsCache(null)
          setVideoCachedDirtyFormData({})

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
          setVideoWorkspaceState('closed')
        }
      },
      [
        activeChannelId,
        activeMemberId,
        addAsset,
        client,
        handleTransaction,
        isEdit,
        joystream,
        proxyCallback,
        removeDrafts,
        resolveAsset,
        editedVideoInfo,
        setAssetsCache,
        setVideoCachedDirtyFormData,
        setVideoWorkspaceState,
        startFileUpload,
        thumbnailHashPromise,
        setEditedVideo,
        video?.media?.id,
        video?.thumbnailPhoto?.id,
        videoHashPromise,
      ]
    )

    const handleSubmit = useMemo(
      () =>
        createSubmitHandler(async (data: VideoWorkspaceFormFields) => {
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
        }),
      [createSubmitHandler, dirtyFields, isEdit, onSubmit]
    )

    useEffect(() => {
      const subscription = watch((data) => {
        if (!Object.keys(dirtyFields).length) {
          return
        }

        if (!editedVideoInfo?.isDraft) {
          debouncedSeteditedVideoInfoCachedDirtyFormData.current(data, dirtyFields, setVideoCachedDirtyFormData)
        } else {
          debouncedDraftSave.current(editedVideoInfo, data, addDraft, updateDraft, setEditedVideo)
        }
      })
      return () => {
        subscription.unsubscribe()
      }
    }, [addDraft, dirtyFields, editedVideoInfo, setVideoCachedDirtyFormData, updateDraft, setEditedVideo, watch])

    const handleVideoFileChange = useCallback(
      (video: VideoInputFile | null) => {
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

        if (editedVideoInfo?.isDraft) {
          setAssetsCache(updatedAssets)
        }
        if (video?.blob) {
          onVideoFileChange(video.blob)
        }

        setFileSelectError(null)
      },
      [addAsset, getValues, onVideoFileChange, editedVideoInfo?.isDraft, setAssetsCache, setValue]
    )

    const handleThumbnailFileChange = useCallback(
      (thumbnail: ImageInputFile | null) => {
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

        if (editedVideoInfo?.isDraft) {
          setAssetsCache(updatedAssets)
        }
        if (thumbnail?.blob) {
          onThumbnailFileChange(thumbnail.blob)
        }
        setFileSelectError(null)
      },
      [addAsset, getValues, onThumbnailFileChange, editedVideoInfo?.isDraft, setAssetsCache, setValue]
    )

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
      editedVideoInfo && deleteVideo(editedVideoInfo.id)
    }

    const categoriesSelectItems: SelectItem[] =
      categories?.map((c) => ({
        name: c.name || 'Unknown category',
        value: c.id,
      })) || []

    const files = useMemo(
      () => ({
        video: mediaAsset,
        thumbnail: { ...thumbnailAsset, originalBlob: originalThumbnailAsset?.blob },
      }),
      [mediaAsset, originalThumbnailAsset?.blob, thumbnailAsset]
    )

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
                    error={fileSelectError}
                    onError={handleFileSelectError}
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
  }
)

VideoWorkspaceForm.displayName = 'VideoWorkspaceForm'
