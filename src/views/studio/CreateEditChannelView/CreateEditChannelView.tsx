import React, { useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { useChannel } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { ImageCropDialog, ImageCropDialogImperativeHandle, StudioContainer } from '@/components'
import { languages } from '@/config/languages'
import { absoluteRoutes } from '@/config/routes'
import {
  useAsset,
  useConnectionStatus,
  useDisplayDataLostWarning,
  useEditVideoSheet,
  useJoystream,
  useStartFileUpload,
  useTransactionManager,
  useUser,
} from '@/hooks'
import { ChannelAssets, ChannelId, CreateChannelMetadata } from '@/joystream-lib'
import {
  ActionBarTransaction,
  ChannelCover,
  FormField,
  Select,
  SelectItem,
  TextArea,
  Tooltip,
} from '@/shared/components'
import { transitions } from '@/shared/theme'
import { useSnackbar } from '@/store'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { writeUrlInCache } from '@/utils/cachingAssets'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { computeFileHash } from '@/utils/hashing'
import { formatNumberShort } from '@/utils/number'
import { Header, SubTitlePlaceholder, TitlePlaceholder } from '@/views/viewer/ChannelView/ChannelView.style'

import {
  InnerFormContainer,
  StyledAvatar,
  StyledHeaderTextField,
  StyledSubTitle,
  StyledTitleSection,
  TitleContainer,
} from './CreateEditChannelView.style'

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

type ImageAsset = {
  url: string | null
  blob: Blob | null
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

export const CreateEditChannelView: React.FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarHashPromise, setAvatarHashPromise] = useState<Promise<string> | null>(null)
  const [coverHashPromise, setCoverHashPromise] = useState<Promise<string> | null>(null)

  const { activeMemberId, activeChannelId, setActiveUser, refetchActiveMembership } = useUser()
  const { joystream } = useJoystream()
  const { fee, handleTransaction } = useTransactionManager()
  const displaySnackbar = useSnackbar((state) => state.displaySnackbar)
  const { nodeConnectionStatus } = useConnectionStatus()
  const navigate = useNavigate()
  const { getAssetUrl } = useAsset()

  const { channel, loading, error, refetch: refetchChannel, client } = useChannel(activeChannelId || '', {
    skip: newChannel || !activeChannelId,
  })
  const startFileUpload = useStartFileUpload()

  const {
    register,
    handleSubmit: createSubmitHandler,
    control,
    formState: { isDirty, dirtyFields, errors },
    watch,
    setFocus,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      avatar: { url: null, blob: null, assetDimensions: null, imageCropData: null },
      cover: { url: null, blob: null, assetDimensions: null, imageCropData: null },
      title: '',
      description: '',
      language: languages[0].value,
      isPublic: true,
    },
  })

  const { sheetState, anyVideoTabsCachedAssets, setSheetState } = useEditVideoSheet()
  const { openWarningDialog } = useDisplayDataLostWarning()

  useEffect(() => {
    if (newChannel) {
      reset({
        avatar: { url: null, blob: null },
        cover: { url: null, blob: null },
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

    const {
      avatarPhotoUrls,
      avatarPhotoAvailability,
      avatarPhotoDataObject,
      coverPhotoUrls,
      coverPhotoAvailability,
      coverPhotoDataObject,
      title,
      description,
      isPublic,
      language,
    } = channel

    const avatarPhotoUrl = getAssetUrl(avatarPhotoAvailability, avatarPhotoUrls, avatarPhotoDataObject)
    const coverPhotoUrl = getAssetUrl(coverPhotoAvailability, coverPhotoUrls, coverPhotoDataObject)

    const foundLanguage = languages.find(({ value }) => value === language?.iso)

    reset({
      avatar: { blob: null, url: avatarPhotoUrl, assetDimensions: null, imageCropData: null },
      cover: { blob: null, url: coverPhotoUrl, assetDimensions: null, imageCropData: null },
      title: title || '',
      description: description || '',
      isPublic: isPublic ?? false,
      language: foundLanguage?.value || languages[0].value,
    })
  }, [channel, getAssetUrl, loading, newChannel, reset])

  const avatarValue = watch('avatar')
  const coverValue = watch('cover')

  useEffect(() => {
    if (!dirtyFields.avatar || !avatarValue.blob) {
      return
    }

    const hashPromise = computeFileHash(avatarValue.blob)
    setAvatarHashPromise(hashPromise)
  }, [dirtyFields.avatar, avatarValue])

  useEffect(() => {
    if (!dirtyFields.cover || !coverValue.blob) {
      return
    }

    const hashPromise = computeFileHash(coverValue.blob)
    setCoverHashPromise(hashPromise)
  }, [dirtyFields.cover, coverValue])

  const handleSubmit = createSubmitHandler(async (data) => {
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => submit(data) })
    } else {
      await submit(data)
    }
  })

  const submit = async (data: Inputs) => {
    if (!joystream || !activeMemberId) {
      return
    }

    setSheetState('closed')

    const metadata: CreateChannelMetadata = {
      ...(dirtyFields.title ? { title: data.title ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description ?? '' } : {}),
      ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
      ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
    }

    const assets: ChannelAssets = {}
    let avatarContentId = ''
    let coverContentId = ''

    const processAssets = async () => {
      if (dirtyFields.avatar && data.avatar.blob && avatarHashPromise) {
        const [asset, contentId] = joystream.createFileAsset({
          size: data.avatar.blob.size,
          ipfsContentId: await avatarHashPromise,
        })
        assets.avatar = asset
        avatarContentId = contentId
      }

      if (dirtyFields.cover && data.cover.blob && coverHashPromise) {
        const [asset, contentId] = joystream.createFileAsset({
          size: data.cover.blob.size,
          ipfsContentId: await coverHashPromise,
        })
        assets.cover = asset
        coverContentId = contentId
      }
    }

    const uploadAssets = (channelId: ChannelId) => {
      if (data.avatar.blob && avatarContentId) {
        startFileUpload(data.avatar.blob, {
          contentId: avatarContentId,
          owner: channelId,
          parentObject: {
            type: 'channel',
            id: channelId,
          },
          dimensions: data.avatar.assetDimensions ?? undefined,
          imageCropData: data.avatar.imageCropData ?? undefined,
          type: 'avatar',
        })
      }
      if (data.cover.blob && coverContentId) {
        startFileUpload(data.cover.blob, {
          contentId: coverContentId,
          owner: channelId,
          parentObject: {
            type: 'channel',
            id: channelId,
          },
          dimensions: data.cover.assetDimensions ?? undefined,
          imageCropData: data.cover.imageCropData ?? undefined,
          type: 'cover',
        })
      }
    }

    const refetchDataAndCacheAssets = async (channelId: ChannelId) => {
      const setCachedAssets = () => {
        if (data.avatar.blob && avatarContentId) {
          writeUrlInCache({
            url: data.avatar.url,
            fileType: 'avatar',
            parentId: channelId,
            client,
          })
        }
        if (data.cover.blob && coverContentId) {
          writeUrlInCache({
            url: data.cover.url,
            fileType: 'cover',
            parentId: channelId,
            client,
          })
        }
      }

      if (!newChannel) {
        // we can set cached assets before the refetch since cache policy will keep the local URLs
        setCachedAssets()
      }

      const refetchPromiseList = [refetchActiveMembership(), ...(!newChannel ? [refetchChannel()] : [])]
      await Promise.all(refetchPromiseList)

      if (newChannel) {
        setCachedAssets()
        setActiveUser({ channelId })
      }
    }

    handleTransaction({
      preProcess: processAssets,
      txFactory: (updateStatus) =>
        newChannel
          ? joystream.createChannel(activeMemberId, metadata, assets, updateStatus)
          : joystream.updateChannel(activeChannelId ?? '', activeMemberId, metadata, assets, updateStatus),
      onTxFinalize: uploadAssets,
      onTxSync: refetchDataAndCacheAssets,
      onTxClose: (completed) => (completed && newChannel ? navigate(absoluteRoutes.studio.videos()) : undefined),
      successMessage: {
        title: newChannel ? 'Channel successfully created!' : 'Channel successfully updated!',
        description: newChannel
          ? 'Your channel was created and saved on the blockchain. Feel free to start using it!'
          : 'Changes to your channel were saved on the blockchain.',
      },
    })
  }

  if (error) {
    throw error
  }

  const checkoutSteps = [
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

  const hasAvatarUploadFailed = channel?.avatarPhotoAvailability === AssetAvailability.Pending
  const hasCoverUploadFailed = channel?.coverPhotoAvailability === AssetAvailability.Pending

  return (
    <form onSubmit={handleSubmit}>
      <Header>
        <Controller
          name="cover"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <ChannelCover
                coverPhotoUrl={loading ? null : value.url}
                hasCoverUploadFailed={hasCoverUploadFailed}
                onCoverEditClick={() => coverDialogRef.current?.open()}
                editable
                disabled={loading}
              />
              <ImageCropDialog
                imageType="cover"
                onConfirm={(blob, url, assetDimensions, imageCropData) =>
                  onChange({ blob, url, assetDimensions, imageCropData })
                }
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
            render={({ field: { value, onChange } }) => (
              <>
                <StyledAvatar
                  imageUrl={value.url}
                  hasAvatarUploadFailed={hasAvatarUploadFailed}
                  size="fill"
                  onEditClick={() => avatarDialogRef.current?.open()}
                  editable
                  loading={loading}
                />
                <ImageCropDialog
                  imageType="avatar"
                  onConfirm={(blob, url, assetDimensions, imageCropData) =>
                    onChange({ blob, url, assetDimensions, imageCropData })
                  }
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
                  render={({ field: { ref, value, onChange } }) => (
                    <Tooltip text="Click to edit channel title">
                      <StyledHeaderTextField
                        ref={ref}
                        placeholder="Channel title"
                        value={value}
                        onChange={(e) => {
                          onChange(e.currentTarget.value)
                        }}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    </Tooltip>
                  )}
                />
                {!newChannel && (
                  <StyledSubTitle>{channel?.follows ? formatNumberShort(channel.follows) : 0} Followers</StyledSubTitle>
                )}
              </>
            ) : (
              <>
                <TitlePlaceholder />
                <SubTitlePlaceholder />
              </>
            )}
          </TitleContainer>
        </StyledTitleSection>
      </Header>
      <StudioContainer>
        <InnerFormContainer>
          <FormField title="Description">
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
                helperText={errors.description?.message}
              />
            </Tooltip>
          </FormField>
          <FormField title="Language" description="Main language of the content you publish on your channel">
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
                  helperText={(errors.language as FieldError)?.message}
                />
              )}
            />
          </FormField>

          <FormField
            title="Privacy"
            description="Privacy of your channel. Please note that because of nature of the blockchain, even unlisted channels can be publicly visible by querying the blockchain data."
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
                  helperText={(errors.isPublic as FieldError)?.message}
                />
              )}
            />
          </FormField>
          <CSSTransition
            in={sheetState !== 'open'}
            timeout={2 * parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
            unmountOnExit
          >
            <ActionBarTransaction
              disabled={nodeConnectionStatus !== 'connected'}
              fee={fee}
              checkoutSteps={!activeChannelId ? checkoutSteps : undefined}
              isActive={newChannel || (!loading && isDirty)}
              fullWidth={!activeChannelId}
              primaryButtonText={newChannel ? 'Create channel' : 'Publish changes'}
              secondaryButtonText={newChannel ? undefined : 'Cancel'}
              onCancelClick={() => reset()}
              onConfirmClick={handleSubmit}
            />
          </CSSTransition>
        </InnerFormContainer>
      </StudioContainer>
    </form>
  )
}
