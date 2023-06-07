import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import useResizeObserver from 'use-resize-observer'
import shallow from 'zustand/shallow'

import { useFullChannel } from '@/api/hooks/channel'
import { ActionBar } from '@/components/ActionBar'
import { Portal } from '@/components/Portal'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { FormField } from '@/components/_inputs/FormField'
import { TextInput } from '@/components/_inputs/Input/Input.styles'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import {
  ImageCropModal,
  ImageCropModalImperativeHandle,
  ImageCropModalProps,
} from '@/components/_overlays/ImageCropModal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { ChannelInputAssets, ChannelInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useBloatFeesAndPerMbFees, useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { requiredValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'
import {
  CreateEditChannelFormInputs,
  useCreateEditChannelSubmit,
} from '@/views/studio/CreateEditChannelView/CreateEditChannelView.hooks'
import { StyledAvatar } from '@/views/studio/CreateEditChannelView/CreateEditChannelView.styles'

import { InputsWrapper } from './GeneralTab.styles'

const DEFAULT_LANGUAGE = atlasConfig.derived.popularLanguagesSelectValues[0].value

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

export const GeneralTab = ({ actionBarPortal }: { actionBarPortal: any }) => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  console.log('channel view')
  const { memberId, accountId, channelId } = useUser()
  const cachedChannelId = useRef(channelId)
  const firstRender = useRef(true)
  const { joystream } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })
  const handleChannelSubmit = useCreateEditChannelSubmit()
  const smMatch = useMediaMatch('sm')

  const [showConnectToYtDialog, setShowConnectToYtDialog] = useState(false)
  const setShouldContinueYppFlow = useYppStore((store) => store.actions.setShouldContinueYppFlow)
  const {
    channel,
    loading,
    error,
    refetch: refetchChannel,
  } = useFullChannel(
    channelId || '',
    {
      skip: !channelId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch channel', 'CreateEditChannelView', error, {
          channel: { id: channelId },
        }),
    },
    { where: { channel: { isPublic_eq: undefined, isCensored_eq: undefined } } }
  )
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)

  const {
    register,
    handleSubmit: createSubmitHandler,
    control,
    formState: { isDirty, dirtyFields, errors },
    watch,
    setFocus,
    setValue,
    reset,
    getValues,
  } = useForm<CreateEditChannelFormInputs>({
    mode: 'onSubmit',
    defaultValues: {
      avatar: { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      cover: { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      title: '',
      description: '',
      language: DEFAULT_LANGUAGE,
      isPublic: true,
    },
  })
  const avatarContentId = watch('avatar').contentId
  const coverContentId = watch('cover').contentId

  const isAvatarUploading = useUploadsStore(
    (state) =>
      avatarContentId
        ? state.uploadsStatus[avatarContentId]?.lastStatus === 'processing' ||
          state.uploadsStatus[avatarContentId]?.lastStatus === 'inProgress' ||
          state.uploadsStatus[avatarContentId]?.lastStatus === 'reconnecting'
        : null,
    shallow
  )
  const isCoverUploading = useUploadsStore(
    (state) =>
      coverContentId
        ? state.uploadsStatus[coverContentId]?.lastStatus === 'processing' ||
          state.uploadsStatus[coverContentId]?.lastStatus === 'inProgress' ||
          state.uploadsStatus[coverContentId]?.lastStatus === 'reconnecting'
        : null,
    shallow
  )

  const { isWorkspaceOpen, setIsWorkspaceOpen } = useVideoWorkspace()

  const createChannelMetadata = useCallback(
    (data: CreateEditChannelFormInputs) => {
      return isDirty
        ? {
            ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
            ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
            ...(dirtyFields.language ? { language: data.language } : {}),
            ...(dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
            ownerAccount: accountId || '',
          }
        : null
    },
    [accountId, dirtyFields, isDirty]
  )

  const createChannelAssets = useCallback((): [ChannelInputAssets, string[]] => {
    const replacedAssetsIds: string[] = []
    const newAssets: ChannelInputAssets = {}
    const avatarAsset = getValues('avatar')
    const coverAsset = getValues('cover')
    if (avatarAsset?.croppedBlob?.size) {
      newAssets.avatarPhoto = {
        size: avatarAsset?.croppedBlob.size,
        ipfsHash: '',
      }
    }
    if (channel?.avatarPhoto?.id && channel?.avatarPhoto?.id !== avatarAsset.contentId) {
      replacedAssetsIds.push(channel.avatarPhoto.id)
    }
    if (coverAsset?.croppedBlob?.size) {
      newAssets.coverPhoto = {
        size: coverAsset.croppedBlob.size,
        ipfsHash: '',
      }
    }
    if (channel?.coverPhoto?.id && channel?.coverPhoto?.id !== coverAsset.contentId) {
      replacedAssetsIds.push(channel.coverPhoto.id)
    }
    return [newAssets, replacedAssetsIds]
  }, [channel?.avatarPhoto?.id, channel?.coverPhoto?.id, getValues])

  const channelMetadata = createChannelMetadata(watch())
  const [newChannelAssets, removedChannelAssetsIds] = createChannelAssets()

  const { channelStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const { fullFee: updateChannelFee, loading: updateChannelFeeLoading } = useFee(
    'updateChannelTx',
    channelId && memberId && channelMetadata && isDirty
      ? [
          channelId,
          memberId,
          channelMetadata,
          newChannelAssets,
          removedChannelAssetsIds,
          dataObjectStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    newChannelAssets
  )

  // set default values for editing channel
  useEffect(() => {
    if (loading || !channel) {
      return
    }

    const { title, description, isPublic, language, avatarPhoto, coverPhoto } = channel

    const foundLanguage = atlasConfig.derived.languagesSelectValues.find(({ value }) => value === language)
    const isChannelChanged = cachedChannelId.current !== channel.id

    // This condition should prevent from updating cover/avatar when the upload is done
    if (isChannelChanged || firstRender.current) {
      reset({
        avatar: {
          contentId: avatarPhoto?.id,
          assetDimensions: null,
          imageCropData: null,
          originalBlob: undefined,
          originalUrl: channel.avatarPhoto?.resolvedUrl,
        },
        cover: {
          contentId: coverPhoto?.id,
          assetDimensions: null,
          imageCropData: null,
          originalBlob: undefined,
          originalUrl: channel.coverPhoto?.resolvedUrl,
        },
        title: title || '',
        description: description || '',
        isPublic: isPublic ?? false,
        language: foundLanguage?.value || DEFAULT_LANGUAGE,
      })
      firstRender.current = false
      cachedChannelId.current = channel.id
    }
  }, [channel, loading, reset])

  const handleSubmit = createSubmitHandler(async (data) => {
    if (!joystream || !memberId || !accountId) {
      return
    }

    if (!channelBucketsCount) {
      SentryLogger.error('Channel buckets count is not set', 'CreateEditChannelView')
      return
    }

    setIsWorkspaceOpen(false)
    const metadata: ChannelInputMetadata = {
      ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
      ...(dirtyFields.language ? { language: data.language } : {}),
      ...(dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
      ownerAccount: accountId ?? '',
    }

    await handleChannelSubmit(
      {
        metadata,
        channel: channel,
        assets: {
          avatarPhoto: data.avatar,
          coverPhoto: data.cover,
        },
        refetchChannel,
        fee: updateChannelFee,
        newChannel: false,
      },
      () => reset(getValues()),
      setValue,
      () =>
        atlasConfig.features.ypp.googleConsoleClientId &&
        atlasConfig.features.ypp.youtubeSyncApiUrl &&
        setTimeout(() => setShowConnectToYtDialog(true), 2000)
    )
  })

  const handleCoverChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData,
    originalBlob
  ) => {
    const newCoverAssetId = `local-cover-${createId()}`
    setValue(
      'cover',
      {
        contentId: newCoverAssetId,
        assetDimensions,
        croppedBlob,
        imageCropData,
        originalBlob,
        croppedUrl,
      },
      { shouldDirty: true }
    )
  }

  const handleAvatarChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData,
    originalBlob
  ) => {
    const newAvatarAssetId = `local-avatar-${createId()}`
    setValue(
      'avatar',
      { contentId: newAvatarAssetId, assetDimensions, imageCropData, originalBlob, croppedUrl, croppedBlob },
      { shouldDirty: true }
    )
  }

  const handleDeleteAvatar = () => {
    setValue(
      'avatar',
      { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      { shouldDirty: true }
    )
  }

  const handleDeleteCover = () => {
    setValue(
      'cover',
      {
        contentId: null,
        assetDimensions: null,
        imageCropData: null,
        originalBlob: undefined,
        croppedUrl: undefined,
        originalUrl: undefined,
      },
      { shouldDirty: true }
    )
  }

  if (error) {
    return <ViewErrorFallback />
  }

  const hasAvatarUploadFailed = isAvatarUploading
    ? false
    : (channel?.avatarPhoto && !channel.avatarPhoto.isAccepted && !dirtyFields.avatar) || false
  const hasCoverUploadFailed = isCoverUploading
    ? false
    : (channel?.coverPhoto && !channel.coverPhoto.isAccepted && !dirtyFields.cover) || false
  const hideActionBar = !isDirty || nodeConnectionStatus !== 'connected'

  return (
    <>
      <form>
        <EntitySettingTemplate
          title="Channel branding"
          description="Show your followers what your channel is about with customized avatar, cover & description."
        >
          <InputsWrapper>
            <FormField label="Channel name">
              <TextInput inputSize="large" {...register('title')} />
            </FormField>

            <Controller
              name="avatar"
              control={control}
              render={({ field: { value } }) => (
                <FormField label="Channel avatar" description="Max file size is 5MB.">
                  <StyledAvatar
                    assetUrl={loading ? null : value.croppedUrl || value.originalUrl}
                    hasAvatarUploadFailed={hasAvatarUploadFailed}
                    size={smMatch ? 136 : 88}
                    onClick={() => {
                      avatarDialogRef.current?.open(
                        value.originalBlob,
                        value.imageCropData || undefined,
                        !!value.originalBlob
                      )
                    }}
                    editable
                    loading={loading}
                  />
                  <ImageCropModal
                    imageType="avatar"
                    onConfirm={handleAvatarChange}
                    onError={() =>
                      displaySnackbar({
                        title: 'Cannot load the image. Choose another.',
                        iconType: 'error',
                      })
                    }
                    ref={avatarDialogRef}
                    onDelete={handleDeleteAvatar}
                  />
                </FormField>
              )}
            />

            <Controller
              name="cover"
              control={control}
              render={({ field: { value } }) => (
                <FormField label="Channel cover" description="Max file size is 5MB. Recommended image ratio is 16:9.">
                  <ChannelCover
                    assetUrl={loading ? null : value.croppedUrl || value.originalUrl}
                    hasCoverUploadFailed={hasCoverUploadFailed}
                    onCoverEditClick={() => {
                      coverDialogRef.current?.open(
                        value.originalBlob,
                        value.imageCropData || undefined,
                        !!value.originalBlob
                      )
                    }}
                    editable
                    disabled={loading}
                  />
                  <ImageCropModal
                    imageType="cover"
                    onConfirm={handleCoverChange}
                    onDelete={handleDeleteCover}
                    onError={() =>
                      displaySnackbar({
                        title: 'Cannot load the image. Choose another.',
                        iconType: 'error',
                      })
                    }
                    ref={coverDialogRef}
                  />
                </FormField>
              )}
            />
            <FormField label="Channel description">
              <TextArea {...register('description')} />
            </FormField>
          </InputsWrapper>
        </EntitySettingTemplate>
        <EntitySettingTemplate
          title="Channel settings"
          description="Reach the right audience by selecting the channel settings that work best for you."
        >
          <InputsWrapper>
            <Controller
              name="language"
              control={control}
              rules={requiredValidation('Language')}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Language"
                  description="Main language of the content you publish on your channel"
                  error={(errors.language as FieldError)?.message}
                >
                  <Select
                    items={[
                      { name: 'TOP LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.popularLanguagesSelectValues,
                      { name: 'ALL LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.languagesSelectValues,
                    ]}
                    disabled={loading}
                    value={value}
                    error={!!errors.language && !value}
                    onChange={onChange}
                  />
                </FormField>
              )}
            />

            <Controller
              name="isPublic"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Privacy"
                  description="Privacy of your channel. Please note that because of nature of the blockchain, even unlisted channels can be publicly visible by querying the blockchain data."
                  error={(errors.isPublic as FieldError)?.message}
                >
                  <Select
                    items={PUBLIC_SELECT_ITEMS}
                    disabled={loading}
                    value={value}
                    onChange={onChange}
                    error={!!errors.isPublic && !value}
                  />
                </FormField>
              )}
            />
          </InputsWrapper>
        </EntitySettingTemplate>
      </form>
      {!hideActionBar && (
        <Portal containerRef={actionBarPortal}>
          <ActionBar
            fee={updateChannelFee}
            feeLoading={updateChannelFeeLoading}
            primaryButton={{
              text: 'Publish changes',
              onClick: handleSubmit,
            }}
            secondaryButton={
              isDirty && nodeConnectionStatus === 'connected'
                ? {
                    text: 'Cancel',
                    onClick: () => reset(),
                  }
                : undefined
            }
            skipFeeCheck
          />
        </Portal>
      )}
    </>
  )
}
