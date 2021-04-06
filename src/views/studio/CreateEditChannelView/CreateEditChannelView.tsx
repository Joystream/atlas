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
  Tooltip,
} from '@/shared/components'
import { transitions } from '@/shared/theme'
import { InnerFormContainer, StyledAvatar, StyledTitleSection, TitleContainer } from './CreateEditChannelView.style'
import { Header, SubTitle, SubTitlePlaceholder, TitlePlaceholder } from '@/views/viewer/ChannelView/ChannelView.style'
import { useChannel, useMembership } from '@/api/hooks'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { formatNumberShort } from '@/utils/number'
import { useActiveUser, useJoystream, useSnackbar } from '@/hooks'
import { CreateChannelMetadata, ExtensionSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { createUrlFromAsset } from '@/utils/asset'
import { absoluteRoutes } from '@/config/routes'
import TextArea from '@/shared/components/TextArea'

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
  const {
    activeUser: { channelId, memberId },
    setActiveChannel,
  } = useActiveUser()
  const { joystream } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

  const { channel, loading, error } = useChannel(channelId || '', { skip: newChannel || !channelId })
  // use membership query so we can trigger refetch once the channels are updated
  const { refetch: refetchMember } = useMembership(
    {
      where: { id: memberId },
    },
    { skip: !memberId }
  )

  const {
    register,
    handleSubmit: createSubmitHandler,
    control,
    formState: { isDirty },
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

  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)

  useEffect(() => {
    if (loading || newChannel || !channel) {
      return
    }

    const {
      avatarPhotoUrl,
      avatarPhotoAvailability,
      avatarPhotoDataObject,
      coverPhotoUrl,
      coverPhotoAvailability,
      coverPhotoDataObject,
      title,
      description,
      isPublic,
      language,
    } = channel

    const avatarAssetUrl = createUrlFromAsset(avatarPhotoAvailability, avatarPhotoUrl, avatarPhotoDataObject)
    const coverAssetUrl = createUrlFromAsset(coverPhotoAvailability, coverPhotoUrl, coverPhotoDataObject)

    const foundLanguage = languages.find(({ value }) => value === language?.iso)

    reset({
      avatar: { blob: null, url: avatarAssetUrl },
      cover: { blob: null, url: coverAssetUrl },
      title: title || '',
      description: description || '',
      isPublic: isPublic ?? false,
      language: foundLanguage?.value || languages[0].value,
    })
  }, [channel, loading, newChannel, reset])

  const handleSubmit = createSubmitHandler(async (data) => {
    if (!joystream || !memberId) {
      return
    }

    const metadata: CreateChannelMetadata = {
      title: data.title ?? '',
      description: data.description ?? '',
      language: data.language,
      isPublic: data.isPublic,
    }
    try {
      const newChannelId = await joystream.createChannel(memberId, metadata, {}, (status) => {
        setTransactionStatus(status)
      })

      setTransactionStatus(ExtrinsicStatus.Completed)
      await refetchMember()
      await setActiveChannel(newChannelId)
    } catch (e) {
      if (e instanceof ExtensionSignCancelledError) {
        console.warn('Sign cancelled')
        setTransactionStatus(null)
        displaySnackbar({ variant: 'error', message: 'Transaction signing cancelled' })
      } else {
        setTransactionStatus(ExtrinsicStatus.Error)
      }
    }
  })

  const handleTransactionClose = async () => {
    if (transactionStatus !== ExtrinsicStatus.Completed) {
      // closed on waiting for signature or error state
      setTransactionStatus(null)
      return
    }

    // TODO: handle channel update
    navigate(absoluteRoutes.studio.videos())
  }

  if (error) {
    throw error
  }

  return (
    <>
      <TransactionDialog
        status={transactionStatus}
        successTitle="Channel successfully created!"
        successDescription="Your channel was created and saved on the blockchain. Feel free to start using it!"
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
              <Tooltip text="Click to edit channel description" offsetY={-50}>
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
                    label="Channel Language"
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
                    label="Publicness"
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
