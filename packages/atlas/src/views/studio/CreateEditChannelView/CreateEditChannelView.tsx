import { FC, useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useFullChannel } from '@/api/hooks'
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
import {
  ImageCropModal,
  ImageCropModalImperativeHandle,
  ImageCropModalProps,
} from '@/components/_overlays/ImageCropModal'
import { languages } from '@/config/languages'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { ChannelExtrinsicResult, ChannelInputAssets, ChannelInputMetadata } from '@/joystream-lib'
import { useAsset, useAssetStore, useOperatorsContext, useRawAsset } from '@/providers/assets'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useStartFileUpload } from '@/providers/uploadsManager/useStartFileUpload'
import { useUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { createId } from '@/utils/createId'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { computeFileHash } from '@/utils/hashing'
import { SentryLogger } from '@/utils/logs'
import { SubTitle, SubTitleSkeletonLoader, TitleSkeletonLoader } from '@/views/viewer/ChannelView/ChannelView.styles'

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

type ImageAsset = {
  contentId: string | null
  assetDimensions: AssetDimensions | null
  imageCropData: ImageCropData | null
}
type Inputs = {
  title?: string
  description?: string
  isPublic: boolean
  language: string
  avatar: ImageAsset
  cover: ImageAsset
}

type CreateEditChannelViewProps = {
  newChannel?: boolean
}

export const CreateEditChannelView: FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const [avatarHashPromise, setAvatarHashPromise] = useState<Promise<string> | null>(null)
  const [coverHashPromise, setCoverHashPromise] = useState<Promise<string> | null>(null)

  const { memberId, accountId, channelId, setActiveUser, refetchUserMemberships } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const addNewChannelIdToUploadsStore = useUploadsStore((state) => state.actions.addNewChannelId)
  const navigate = useNavigate()
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })

  const { channel, loading, error } = useFullChannel(channelId || '', {
    skip: newChannel || !channelId,
    onError: (error) =>
      SentryLogger.error('Failed to fetch channel', 'CreateEditChannelView', error, {
        channel: { id: channelId },
      }),
  })
  const startFileUpload = useStartFileUpload()

  // trigger use asset to make sure the channel assets get resolved
  useAsset(channel?.avatarPhoto)
  useAsset(channel?.coverPhoto)

  const {
    register,
    handleSubmit: createSubmitHandler,
    control,
    formState: { isDirty, dirtyFields, errors, isValid },
    watch,
    setFocus,
    setValue,
    reset,
  } = useForm<Inputs>({
    mode: 'onSubmit',
    defaultValues: {
      avatar: { contentId: null, assetDimensions: null, imageCropData: null },
      cover: { contentId: null, assetDimensions: null, imageCropData: null },
      title: '',
      description: '',
      language: languages[0].value,
      isPublic: true,
    },
  })

  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const avatarAsset = useRawAsset(watch('avatar').contentId)
  const coverAsset = useRawAsset(watch('cover').contentId)

  const { isWorkspaceOpen, setIsWorkspaceOpen } = useVideoWorkspace()
  const { fetchOperators } = useOperatorsContext()

  useEffect(() => {
    if (newChannel) {
      reset({
        avatar: { contentId: null },
        cover: { contentId: null },
        title: '',
        description: '',
        language: languages[0].value,
        isPublic: true,
      })
    }
  }, [newChannel, reset])

  useEffect(() => {
    if (loading || newChannel || !channel) {
      return
    }

    const { title, description, isPublic, language } = channel

    const foundLanguage = languages.find(({ value }) => value === language?.iso)

    reset({
      avatar: {
        contentId: channel.avatarPhoto?.id,
        assetDimensions: null,
        imageCropData: null,
      },
      cover: {
        contentId: channel.coverPhoto?.id,
        assetDimensions: null,
        imageCropData: null,
      },
      title: title || '',
      description: description || '',
      isPublic: isPublic ?? false,
      language: foundLanguage?.value || languages[0].value,
    })
  }, [channel, loading, newChannel, reset])

  useEffect(() => {
    if (!dirtyFields.avatar || !avatarAsset?.blob) {
      return
    }

    const hashPromise = computeFileHash(avatarAsset.blob)
    setAvatarHashPromise(hashPromise)
  }, [dirtyFields.avatar, avatarAsset])

  useEffect(() => {
    if (!dirtyFields.cover || !coverAsset?.blob) {
      return
    }

    const hashPromise = computeFileHash(coverAsset.blob)
    setCoverHashPromise(hashPromise)
  }, [dirtyFields.cover, coverAsset])

  const headTags = useHeadTags(newChannel ? 'New channel' : 'Edit channel')

  const handleSubmit = createSubmitHandler(async (data) => {
    await submit(data)
  })

  const handleCoverChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData
  ) => {
    const newCoverAssetId = `local-cover-${createId()}`
    addAsset(newCoverAssetId, { url: croppedUrl, blob: croppedBlob })
    setValue('cover', { contentId: newCoverAssetId, assetDimensions, imageCropData }, { shouldDirty: true })
  }

  const handleAvatarChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData
  ) => {
    const newAvatarAssetId = `local-avatar-${createId()}`
    addAsset(newAvatarAssetId, { url: croppedUrl, blob: croppedBlob })
    setValue('avatar', { contentId: newAvatarAssetId, assetDimensions, imageCropData }, { shouldDirty: true })
  }

  const submit = async (data: Inputs) => {
    if (!joystream || !memberId || !accountId) {
      return
    }

    setIsWorkspaceOpen(false)

    const metadata: ChannelInputMetadata = {
      ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
      ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
      ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
      ownerAccount: accountId,
    }

    const assets: ChannelInputAssets = {}

    const processAssets = async () => {
      if (dirtyFields.avatar && avatarAsset?.blob && avatarHashPromise) {
        const ipfsHash = await avatarHashPromise
        assets.avatarPhoto = {
          size: avatarAsset.blob.size,
          ipfsHash,
          replacedDataObjectId: channel?.avatarPhoto?.id,
        }
      }

      if (dirtyFields.cover && coverAsset?.blob && coverHashPromise) {
        const ipfsHash = await coverHashPromise
        assets.coverPhoto = {
          size: coverAsset.blob.size,
          ipfsHash,
          replacedDataObjectId: channel?.coverPhoto?.id,
        }
      }
    }

    const uploadAssets = async ({ channelId, assetsIds }: ChannelExtrinsicResult) => {
      const uploadPromises: Promise<unknown>[] = []
      if (avatarAsset?.blob && assetsIds.avatarPhoto) {
        const uploadPromise = startFileUpload(avatarAsset.blob, {
          id: assetsIds.avatarPhoto,
          owner: channelId,
          parentObject: {
            type: 'channel',
            id: channelId,
          },
          dimensions: data.avatar.assetDimensions ?? undefined,
          imageCropData: data.avatar.imageCropData ?? undefined,
          type: 'avatar',
        })
        uploadPromises.push(uploadPromise)
      }
      if (coverAsset?.blob && assetsIds.coverPhoto) {
        const uploadPromise = startFileUpload(coverAsset.blob, {
          id: assetsIds.coverPhoto,
          owner: channelId,
          parentObject: {
            type: 'channel',
            id: channelId,
          },
          dimensions: data.cover.assetDimensions ?? undefined,
          imageCropData: data.cover.imageCropData ?? undefined,
          type: 'cover',
        })
        uploadPromises.push(uploadPromise)
      }
      Promise.all(uploadPromises).catch((e) =>
        SentryLogger.error('Unexpected upload failure', 'CreateEditChannelView', e)
      )
    }

    const refetchDataAndUploadAssets = async (result: ChannelExtrinsicResult) => {
      const { channelId, assetsIds } = result
      if (assetsIds.avatarPhoto && avatarAsset?.url) {
        addAsset(assetsIds.avatarPhoto, { url: avatarAsset.url })
      }
      if (assetsIds.coverPhoto && coverAsset?.url) {
        addAsset(assetsIds.coverPhoto, { url: coverAsset.url })
      }

      if (newChannel) {
        // add channel to new channels list before refetching membership to make sure UploadsManager doesn't complain about missing assets
        addNewChannelIdToUploadsStore(channelId)
      }

      // membership includes full list of channels so the channel update will be fetched too
      await refetchUserMemberships()

      if (newChannel) {
        // when creating a channel, refetch operators before uploading so that storage bag assignments gets populated for a new channel
        setActiveUser({ channelId })
        fetchOperators().then(() => {
          uploadAssets(result)
        })
      } else {
        uploadAssets(result)
      }
    }

    const completed = await handleTransaction({
      preProcess: processAssets,
      txFactory: async (updateStatus) =>
        newChannel
          ? (await joystream.extrinsics).createChannel(memberId, metadata, assets, proxyCallback(updateStatus))
          : (
              await joystream.extrinsics
            ).updateChannel(channelId ?? '', memberId, metadata, assets, proxyCallback(updateStatus)),
      onTxSync: refetchDataAndUploadAssets,
    })

    if (completed && newChannel) {
      navigate(absoluteRoutes.studio.videos())
    }
  }

  if (error) {
    return <ViewErrorFallback />
  }

  const progressDrawerSteps = [
    {
      title: 'Add channel title',
      completed: !!dirtyFields.title,
      onClick: () => setFocus('title'),
    },
    {
      title: 'Add description',
      completed: !!dirtyFields.description,
      onClick: () => setFocus('description'),
    },
    {
      title: 'Add avatar image',
      completed: !!dirtyFields.avatar,
      onClick: () => avatarDialogRef.current?.open(),
    },
    {
      title: 'Add cover image',
      completed: !!dirtyFields.cover,
      onClick: () => coverDialogRef.current?.open(),
    },
  ]

  const hasAvatarUploadFailed = (channel?.avatarPhoto && !channel.avatarPhoto.isAccepted) || false
  const hasCoverUploadFailed = (channel?.coverPhoto && !channel.coverPhoto.isAccepted) || false
  const isDisabled = !isDirty || nodeConnectionStatus !== 'connected'

  return (
    <form onSubmit={handleSubmit}>
      {headTags}
      <Controller
        name="cover"
        control={control}
        render={() => (
          <>
            <ChannelCover
              assetUrl={loading ? null : coverAsset?.url}
              hasCoverUploadFailed={hasCoverUploadFailed}
              onCoverEditClick={() => coverDialogRef.current?.open()}
              editable
              disabled={loading}
            />
            <ImageCropModal
              imageType="cover"
              onConfirm={handleCoverChange}
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
          render={() => (
            <>
              <StyledAvatar
                assetUrl={avatarAsset?.url}
                hasAvatarUploadFailed={hasAvatarUploadFailed}
                size="fill"
                onClick={() => avatarDialogRef.current?.open()}
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
                render={({ field: { value, onChange } }) => (
                  <FormField error={errors.title?.message}>
                    <Tooltip text="Click to edit channel title" placement="top-start">
                      <TitleInput
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
                <SubTitle variant="t200">
                  {channel?.follows ? <NumberFormat value={channel.follows} format="short" variant="t200" /> : 0}{' '}
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
                  items={languages}
                  disabled={loading}
                  value={value}
                  onChange={onChange}
                  error={!!errors.language && !value}
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
              {!channelId && progressDrawerSteps?.length ? <StyledProgressDrawer steps={progressDrawerSteps} /> : null}
              <ActionBar
                primaryText="Fee: 0 Joy"
                secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
                primaryButton={{
                  text: newChannel ? 'Create channel' : 'Publish changes',
                  disabled: isDisabled,
                  onClick: handleSubmit,
                  tooltip: isDisabled
                    ? {
                        headerText: newChannel
                          ? 'Fill all required fields to proceed'
                          : isValid
                          ? 'Change anything to proceed'
                          : 'Fill all required fields to proceed',
                        text: newChannel
                          ? 'Required: title'
                          : isValid
                          ? 'To publish changes you have to provide new value to any field'
                          : 'Required: title',
                        icon: true,
                      }
                    : undefined,
                }}
                secondaryButton={
                  !newChannel && isDirty && nodeConnectionStatus === 'connected'
                    ? {
                        text: 'Cancel',
                        onClick: () => reset(),
                      }
                    : undefined
                }
              />
            </ActionBarTransactionWrapper>
          </CSSTransition>
        </InnerFormContainer>
      </LimitedWidthContainer>
    </form>
  )
}
