import React, { useEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { languages } from '@/config/languages'
import { ImageCropDialog, ImageCropDialogImperativeHandle, StudioContainer, TransactionDialog } from '@/components'
import {
  ActionBarTransaction,
  ChannelCover,
  FormField,
  HeaderTextField,
  Select,
  SelectItem,
  TextArea,
  Tooltip,
} from '@/shared/components'
import { transitions } from '@/shared/theme'
import { InnerFormContainer, StyledAvatar, StyledTitleSection, TitleContainer } from './CreateEditChannelView.style'
import { Header, SubTitle, SubTitlePlaceholder, TitlePlaceholder } from '@/views/viewer/ChannelView/ChannelView.style'
import { useChannel, useMembership, useQueryNodeStateSubscription } from '@/api/hooks'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { formatNumberShort } from '@/utils/number'
import { useActiveUser, useJoystream, useSnackbar } from '@/hooks'
import { ChannelAssets, CreateChannelMetadata, ExtensionSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { createUrlFromAsset } from '@/utils/asset'
import { absoluteRoutes } from '@/config/routes'
import { computeFileHash } from '@/utils/hashing'

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public (Channel will appear in feeds)', value: true },
  { name: 'Unlisted', value: false },
]

const FEE = 0

type ImageAsset = {
  url: string | null
  blob: Blob | null
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

  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const [transactionBlock, setTransactionBlock] = useState<number | null>(null)
  const [transactionCallback, setTransactionCallback] = useState<(() => void) | null>(null)
  const [avatarHashPromise, setAvatarHashPromise] = useState<Promise<string> | null>(null)
  const [coverHashPromise, setCoverHashPromise] = useState<Promise<string> | null>(null)

  const {
    activeUser: { channelId, memberId },
    setActiveChannel,
  } = useActiveUser()
  const { joystream } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

  const { channel, loading, error, refetch: refetchChannel } = useChannel(channelId || '', {
    skip: newChannel || !channelId,
  })
  // use membership query so we can trigger refetch once the channels are updated
  const { refetch: refetchMember } = useMembership(
    {
      where: { id: memberId },
    },
    { skip: !memberId }
  )
  const { queryNodeState } = useQueryNodeStateSubscription({ skip: transactionStatus !== ExtrinsicStatus.Syncing })

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
      avatar: { url: null, blob: null },
      cover: { url: null, blob: null },
      title: '',
      description: '',
      language: languages[0].value,
      isPublic: true,
    },
  })

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
      avatar: { blob: null, url: avatarPhotoUrl },
      cover: { blob: null, url: coverPhotoUrl },
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

  useEffect(() => {
    if (!queryNodeState || transactionStatus !== ExtrinsicStatus.Syncing || !transactionBlock) {
      return
    }

    if (queryNodeState.indexerHead >= transactionBlock) {
      setTransactionStatus(ExtrinsicStatus.Completed)
      transactionCallback?.()
    }
  }, [queryNodeState, transactionBlock, transactionCallback, transactionStatus])

  const handleSubmit = createSubmitHandler(async (data) => {
    if (!joystream || !memberId) {
      return
    }

    const metadata: CreateChannelMetadata = {
      ...(dirtyFields.title ? { title: data.title ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description ?? '' } : {}),
      ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
      ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
    }

    setTransactionStatus(ExtrinsicStatus.ProcessingAssets)

    const assets: ChannelAssets = {}
    if (dirtyFields.avatar) {
      if (data.avatar.blob && avatarHashPromise) {
        assets.avatar = {
          size: data.avatar.blob.size,
          ipfsContentId: await avatarHashPromise,
        }
      } else {
        console.warn('Missing avatar data')
      }
    }

    if (dirtyFields.cover) {
      if (data.cover.blob && coverHashPromise) {
        assets.cover = {
          size: data.cover.blob.size,
          ipfsContentId: await coverHashPromise,
        }
      } else {
        console.warn('Missing cover data')
      }
    }

    try {
      if (newChannel) {
        const { data: newChannelId, block } = await joystream.createChannel(memberId, metadata, assets, (status) => {
          setTransactionStatus(status)
        })
        // transaction will be marked as completed once query node processes the block, that's done in useEffect above
        setTransactionStatus(ExtrinsicStatus.Syncing)
        setTransactionBlock(block)
        setTransactionCallback(() => async () => {
          await refetchMember()
          await setActiveChannel(newChannelId)
        })
      } else if (channelId) {
        const { block } = await joystream.updateChannel(channelId, memberId, metadata, assets, (status) => {
          setTransactionStatus(status)
        })
        // transaction will be marked as completed once query node processes the block, that's done in useEffect above
        setTransactionStatus(ExtrinsicStatus.Syncing)
        setTransactionBlock(block)
        setTransactionCallback(() => async () => {
          await Promise.all([refetchChannel(), refetchMember()])
        })
      }
    } catch (e) {
      if (e instanceof ExtensionSignCancelledError) {
        console.warn('Sign cancelled')
        setTransactionStatus(null)
        displaySnackbar({ title: 'Transaction signing cancelled', iconType: 'info' })
      } else {
        console.error(e)
        setTransactionStatus(ExtrinsicStatus.Error)
      }
    }
  })

  const handleTransactionClose = async () => {
    if (transactionStatus === ExtrinsicStatus.Completed && newChannel) {
      navigate(absoluteRoutes.studio.videos())
      return
    }

    setTransactionStatus(null)
  }

  if (error) {
    throw error
  }

  return (
    <>
      <TransactionDialog
        status={transactionStatus}
        successTitle={newChannel ? 'Channel successfully created!' : 'Channel successfully updated!'}
        successDescription={
          newChannel
            ? 'Your channel was created and saved on the blockchain. Feel free to start using it!'
            : 'Changes to your channel were saved on the blockchain.'
        }
        onClose={handleTransactionClose}
      />
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
                  onConfirm={(blob, url) => onChange({ blob, url })}
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
                    onConfirm={(blob, url) => onChange({ blob, url })}
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
                    rules={textFieldValidation('Channel name', 3, 40, true)}
                    render={({ value, onChange }) => (
                      <Tooltip text="Click to edit channel title">
                        <HeaderTextField
                          placeholder="Add Channel Title"
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
                    <SubTitle>{channel?.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
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
                  placeholder="Add description"
                  spellcheck={false}
                  rows={8}
                  ref={register(textFieldValidation('Description', 3, 1000))}
                  maxLength={1000}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Tooltip>
            </FormField>
            <FormField
              title="Change Language"
              description="Channel language is the main language of the content you publish on your channel"
            >
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
              title="Publicness"
              description="Publicness dictates whether your channel will be displayed in users' feeds"
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
            <ActionBarTransaction
              fee={FEE}
              isActive={newChannel || (!loading && isDirty)}
              primaryButtonText={newChannel ? 'Create channel' : 'Publish changes'}
              secondaryButtonText="Cancel"
              onCancelClick={() => reset()}
              onConfirmClick={handleSubmit}
            />
          </InnerFormContainer>
        </StudioContainer>
      </form>
    </>
  )
}

export default CreateEditChannelView
