import React, { useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { languages } from '@/config/languages'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { ImageCropDialog, ImageCropDialogImperativeHandle, StudioContainer } from '@/components'
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
import {
  InnerFormContainer,
  StyledAvatar,
  StyledTitleSection,
  TitleContainer,
  StyledHeaderTextField,
  StyledSubTitle,
} from './CreateEditChannelView.style'
import { Header, SubTitlePlaceholder, TitlePlaceholder } from '@/views/viewer/ChannelView/ChannelView.style'
import { useChannel, useRandomStorageProviderUrl } from '@/api/hooks'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { formatNumberShort } from '@/utils/number'
import { writeUrlInCache } from '@/utils/cachingAssets'
import {
  useUser,
  useJoystream,
  useSnackbar,
  useUploadsManager,
  useEditVideoSheet,
  useDisplayDataLostWarning,
  useTransactionManager,
} from '@/hooks'
import { ChannelAssets, ChannelId, CreateChannelMetadata } from '@/joystream-lib'
import { createUrlFromAsset } from '@/utils/asset'
import { absoluteRoutes } from '@/config/routes'
import { computeFileHash } from '@/utils/hashing'

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

const CreateEditChannelView: React.FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarHashPromise, setAvatarHashPromise] = useState<Promise<string> | null>(null)
  const [coverHashPromise, setCoverHashPromise] = useState<Promise<string> | null>(null)

  const storageProviderUrl = useRandomStorageProviderUrl()

  const { activeMemberId, activeChannelId, setActiveUser, refetchActiveMembership } = useUser()
  const { joystream } = useJoystream()
  const { fee, handleTransaction } = useTransactionManager()
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

  const { channel, loading, error, refetch: refetchChannel, client } = useChannel(activeChannelId || '', {
    skip: newChannel || !activeChannelId,
  })
  const { startFileUpload } = useUploadsManager(activeChannelId || '')

  const {
    register,
    handleSubmit: createSubmitHandler,
    control,
    formState: { isDirty, dirtyFields },
    watch,
    reset,
    errors,
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

  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  const { sheetState, anyVideoTabsCachedAssets, setSheetState } = useEditVideoSheet()
  const { DataLostWarningDialog, openWarningDialog } = useDisplayDataLostWarning()

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

    const avatarPhotoUrl = createUrlFromAsset(avatarPhotoAvailability, avatarPhotoUrls, avatarPhotoDataObject)
    const coverPhotoUrl = createUrlFromAsset(coverPhotoAvailability, coverPhotoUrls, coverPhotoDataObject)

    const foundLanguage = languages.find(({ value }) => value === language?.iso)

    reset({
      avatar: { blob: null, url: avatarPhotoUrl, assetDimensions: null, imageCropData: null },
      cover: { blob: null, url: coverPhotoUrl, assetDimensions: null, imageCropData: null },
      title: title || '',
      description: description || '',
      isPublic: isPublic ?? false,
      language: foundLanguage?.value || languages[0].value,
    })
  }, [channel, loading, newChannel, reset])

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
      let uploadCount = 0
      if (data.avatar.blob && avatarContentId && storageProviderUrl) {
        startFileUpload(
          data.avatar.blob,
          {
            contentId: avatarContentId,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.avatar.assetDimensions ?? undefined,
            imageCropData: data.avatar.imageCropData ?? undefined,
            type: 'avatar',
          },
          storageProviderUrl
        )
        uploadCount++
      }
      if (data.cover.blob && coverContentId && storageProviderUrl) {
        startFileUpload(
          data.cover.blob,
          {
            contentId: coverContentId,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.cover.assetDimensions ?? undefined,
            imageCropData: data.cover.imageCropData ?? undefined,
            type: 'cover',
          },
          storageProviderUrl
        )
        uploadCount++
      }

      // TODO: move to uploads manager
      if (uploadCount > 0) {
        displaySnackbar({ title: `(${uploadCount}) Asset being uploaded`, iconType: 'info' })
      }
    }

    const refetchDataAndCacheAssets = async (channelId: ChannelId) => {
      const refetchPromiseList = [refetchActiveMembership(), ...(!newChannel ? [refetchChannel()] : [])]
      await Promise.all(refetchPromiseList)
      if (newChannel) {
        setActiveUser({ channelId })
      }
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

    handleTransaction({
      preProcess: processAssets,
      txFactory: (updateStatus) =>
        newChannel
          ? joystream.createChannel(activeMemberId, metadata, assets, updateStatus)
          : joystream.updateChannel(activeChannelId ?? '', activeMemberId, metadata, assets, updateStatus),
      onTxFinalize: uploadAssets,
      onTxSync: refetchDataAndCacheAssets,
      onTxClose: (completed) => completed && newChannel && navigate(absoluteRoutes.studio.videos()),
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
      onClick: () => titleRef.current?.focus(),
    },
    {
      title: 'Add description',
      completed: !!dirtyFields.description,
      onClick: () => descriptionRef.current?.focus(),
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

  return (
    <>
      <DataLostWarningDialog />
      <form onSubmit={handleSubmit}>
        <Header>
          <Controller
            name="cover"
            control={control}
            render={({ value, onChange }) => (
              <>
                <ChannelCover
                  coverPhotoUrl={loading ? null : value.url}
                  onCoverEditClick={() => coverDialogRef.current?.open()}
                  onCoverRemoveClick={() => onChange({ blob: null, url: null })}
                  editable
                  disabled={loading}
                />
                <ImageCropDialog
                  imageType="cover"
                  onConfirm={(blob, url, assetDimensions, imageCropData) =>
                    onChange({ blob, url, assetDimensions, imageCropData })
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
              render={({ value, onChange }) => (
                <>
                  <StyledAvatar
                    imageUrl={value.url}
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
                    render={({ value, onChange }) => (
                      <Tooltip text="Click to edit channel title">
                        <StyledHeaderTextField
                          ref={titleRef}
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
                    <StyledSubTitle>
                      {channel?.follows ? formatNumberShort(channel.follows) : 0} Followers
                    </StyledSubTitle>
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
                  name="description"
                  placeholder="Description of your channel to share with your audience"
                  rows={8}
                  ref={(ref) => {
                    if (ref) {
                      register(ref, textFieldValidation({ name: 'Description', minLength: 3, maxLength: 1000 }))
                      descriptionRef.current = ref
                    }
                  }}
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
                render={({ value, onChange }) => (
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
                render={({ value, onChange }) => (
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
                fee={fee}
                checkoutSteps={!activeChannelId ? checkoutSteps : undefined}
                isActive={newChannel || (!loading && isDirty)}
                fullWidth={!activeChannelId}
                primaryButtonText={newChannel ? 'Create channel' : 'Publish changes'}
                secondaryButtonText="Cancel"
                onCancelClick={() => reset()}
                onConfirmClick={handleSubmit}
              />
            </CSSTransition>
          </InnerFormContainer>
        </StudioContainer>
      </form>
    </>
  )
}

export default CreateEditChannelView
