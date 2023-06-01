import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'
import shallow from 'zustand/shallow'

import { useFullChannel } from '@/api/hooks/channel'
import { ActionBar } from '@/components/ActionBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { NumberFormat } from '@/components/NumberFormat'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { FormField } from '@/components/_inputs/FormField'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { ConnectWithYtModal } from '@/components/_overlays/ConnectWithYtModal'
import {
  ImageCropModal,
  ImageCropModalImperativeHandle,
  ImageCropModalProps,
} from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
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
import { transitions } from '@/styles'
import { createId } from '@/utils/createId'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'
import { SubTitle, SubTitleSkeletonLoader, TitleSkeletonLoader } from '@/views/viewer/ChannelView/ChannelView.styles'

import { CreateEditChannelFormInputs, useCreateEditChannelSubmit } from './CreateEditChannelView.hooks'
import {
  ActionBarTransactionWrapper,
  InnerFormContainer,
  StyledAvatar,
  StyledProgressDrawer,
  StyledTitleSection,
  TitleContainer,
} from './CreateEditChannelView.styles'

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

type CreateEditChannelViewProps = {
  newChannel?: boolean
}

const DEFAULT_LANGUAGE = atlasConfig.derived.popularLanguagesSelectValues[0].value

export const CreateEditChannelView: FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const { memberId, accountId, channelId } = useUser()
  const navigate = useNavigate()
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
      skip: newChannel || !channelId,
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

  useEffect(() => {
    if (newChannel) {
      reset({
        avatar: { contentId: null },
        cover: { contentId: null },
        title: '',
        description: '',
        language: DEFAULT_LANGUAGE,
        isPublic: true,
      })
    }
  }, [newChannel, reset])

  const createChannelMetadata = useCallback(
    (data: CreateEditChannelFormInputs) => {
      return isDirty
        ? {
            ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
            ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
            ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
            ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
            ownerAccount: accountId || '',
          }
        : null
    },
    [accountId, dirtyFields, isDirty, newChannel]
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
    channelId && memberId && channelMetadata && isDirty && !newChannel
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
  const { fullFee: createChannelFee, loading: createChannelFeeLoading } = useFee(
    'createChannelTx',
    memberId && channelMetadata && newChannel
      ? [
          memberId,
          channelMetadata,
          newChannelAssets,
          // use basic buckets config for fee estimation
          { storage: [0], distribution: [{ distributionBucketFamilyId: 0, distributionBucketIndex: 0 }] },
          dataObjectStateBloatBondValue.toString(),
          channelStateBloatBondValue.toString(),
        ]
      : undefined,
    newChannelAssets
  )

  // set default values for editing channel
  useEffect(() => {
    if (loading || newChannel || !channel) {
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
  }, [channel, loading, newChannel, reset])

  const headTags = useHeadTags(newChannel ? 'New channel' : 'Edit channel')

  const handleSubmit = createSubmitHandler(async (data) => {
    if (!joystream || !memberId || !accountId) {
      return
    }

    if (!channelBucketsCount && !newChannel) {
      SentryLogger.error('Channel buckets count is not set', 'CreateEditChannelView')
      return
    }

    setIsWorkspaceOpen(false)
    const metadata: ChannelInputMetadata = {
      ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
      ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
      ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
      ownerAccount: accountId ?? '',
    }

    await handleChannelSubmit(
      {
        metadata,
        channel: channel,
        newChannel: !!newChannel,
        assets: {
          avatarPhoto: data.avatar,
          coverPhoto: data.cover,
        },
        refetchChannel,
        fee: newChannel ? createChannelFee : updateChannelFee,
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

  const progressDrawerSteps = [
    {
      title: 'Add channel title',
      completed: !!dirtyFields.title,
      onClick: () => setFocus('title'),
      required: true,
    },
    {
      title: 'Add description',
      completed: !!dirtyFields.description,
      onClick: () => setFocus('description'),
    },
    {
      title: 'Add avatar image',
      completed: !!(dirtyFields.avatar && avatarContentId),
      onClick: () => avatarDialogRef.current?.open(),
    },
    {
      title: 'Add cover image',
      completed: !!(dirtyFields.cover && coverContentId),
      onClick: () => coverDialogRef.current?.open(),
    },
  ]

  const hasAvatarUploadFailed = isAvatarUploading
    ? false
    : (channel?.avatarPhoto && !channel.avatarPhoto.isAccepted && !dirtyFields.avatar) || false
  const hasCoverUploadFailed = isCoverUploading
    ? false
    : (channel?.coverPhoto && !channel.coverPhoto.isAccepted && !dirtyFields.cover) || false
  const isDisabled = !isDirty || nodeConnectionStatus !== 'connected'

  return (
    <>
      {headTags}
      <ConnectWithYtModal
        show={showConnectToYtDialog}
        onSignUp={() => {
          setShouldContinueYppFlow(true)
          navigate(absoluteRoutes.studio.ypp())
        }}
        onClose={() => navigate(absoluteRoutes.studio.videos())}
      />
      <form onSubmit={(event) => event.preventDefault()}>
        <Controller
          name="cover"
          control={control}
          render={({ field: { value } }) => (
            <>
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
            </>
          )}
        />
        <StyledTitleSection className={transitions.names.slide}>
          <Controller
            name="avatar"
            control={control}
            render={({ field: { value } }) => (
              <>
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
              </>
            )}
          />

          <TitleContainer>
            {!loading || newChannel ? (
              <>
                <Controller
                  name="title"
                  control={control}
                  rules={textFieldValidation({ name: 'Channel name', minLength: 3, maxLength: 40, required: true })}
                  render={({ field: { value, onChange, ref } }) => (
                    <FormField error={errors.title?.message}>
                      <Tooltip text="Click to edit channel title" placement="top-start">
                        <TitleInput
                          ref={ref}
                          min={3}
                          max={40}
                          placeholder="Channel title"
                          value={value}
                          onChange={onChange}
                          error={!!errors.title}
                        />
                      </Tooltip>
                    </FormField>
                  )}
                />
                {!newChannel && (
                  <SubTitle as="span" variant="t200">
                    {channel?.followsNum ? (
                      <NumberFormat as="span" value={channel.followsNum} format="short" variant="t200" />
                    ) : (
                      0
                    )}{' '}
                    Followers
                  </SubTitle>
                )}
              </>
            ) : (
              <>
                <TitleSkeletonLoader />
                <SubTitleSkeletonLoader />
              </>
            )}
          </TitleContainer>
        </StyledTitleSection>
        <LimitedWidthContainer>
          <InnerFormContainer actionBarHeight={actionBarBoundsHeight}>
            <FormField label="Description" error={errors.description?.message}>
              <Tooltip text="Click to edit channel description">
                <TextArea
                  placeholder="Description of your channel to share with your audience"
                  rows={8}
                  {...register(
                    'description',
                    textFieldValidation({ name: 'Description', minLength: 3, maxLength: 1000 })
                  )}
                  maxLength={1000}
                  error={!!errors.description}
                />
              </Tooltip>
            </FormField>
            <FormField
              label="Language"
              description="Main language of the content you publish on your channel"
              error={(errors.language as FieldError)?.message}
            >
              <Controller
                name="language"
                control={control}
                rules={requiredValidation('Language')}
                render={({ field: { value, onChange } }) => (
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
                )}
              />
            </FormField>

            <FormField
              label="Privacy"
              description="Privacy of your channel. Please note that because of nature of the blockchain, even unlisted channels can be publicly visible by querying the blockchain data."
              error={(errors.isPublic as FieldError)?.message}
            >
              <Controller
                name="isPublic"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    items={PUBLIC_SELECT_ITEMS}
                    disabled={loading}
                    value={value}
                    onChange={onChange}
                    error={!!errors.isPublic && !value}
                  />
                )}
              />
            </FormField>
            <CSSTransition
              in={!isWorkspaceOpen}
              timeout={2 * parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
              unmountOnExit
            >
              <ActionBarTransactionWrapper ref={actionBarRef}>
                {!channelId && progressDrawerSteps?.length ? (
                  <StyledProgressDrawer steps={progressDrawerSteps} />
                ) : null}
                <ActionBar
                  fee={newChannel ? createChannelFee : updateChannelFee}
                  feeLoading={newChannel ? createChannelFeeLoading : updateChannelFeeLoading}
                  primaryButton={{
                    text: newChannel ? 'Create channel' : 'Publish changes',
                    disabled: isDisabled,
                    onClick: handleSubmit,
                  }}
                  secondaryButton={
                    !newChannel && isDirty && nodeConnectionStatus === 'connected'
                      ? {
                          text: 'Cancel',
                          onClick: () => reset(),
                        }
                      : undefined
                  }
                  skipFeeCheck
                />
              </ActionBarTransactionWrapper>
            </CSSTransition>
          </InnerFormContainer>
        </LimitedWidthContainer>
      </form>
    </>
  )
}
