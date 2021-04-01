import React, { useRef, useState, useEffect } from 'react'
import { useForm, Controller, FieldError } from 'react-hook-form'
import { useChannel } from '@/api/hooks'

import { languages } from '@/config/languages'

import { ImageCropDialog, ImageCropDialogImperativeHandle, StudioContainer } from '@/components'
import { ChannelCover, FormField, Select, SelectedItem, HeaderTextField, Tooltip } from '@/shared/components'

import { transitions } from '@/shared/theme'
import {
  StyledTitleSection,
  TitleContainer,
  StyledTextarea,
  StyledActionBarTransaction,
  StyledAvatar,
  InnerFormContainer,
} from './CreateEditChannelView.style'
import { Header, SubTitle, SubTitlePlaceholder, TitlePlaceholder } from '@/views/viewer/ChannelView/ChannelView.style'

import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { formatNumberShort } from '@/utils/number'

const isPublicSelect: SelectedItem[] = [
  { name: 'Public (Channel will appear in feeds)', value: true },
  { name: 'Unlisted', value: false },
]

const FEE = 0

type ImageAsset = {
  url: string | null
  blob: Blob | null
}
type Inputs = {
  channelName?: string
  description?: string
  isPublic?: boolean | null
  selectedLanguage: SelectedItem
  avatar: ImageAsset
  cover: ImageAsset
}

type CreateEditChannelViewProps = {
  newChannel?: boolean
}

const CreateEditChannelView: React.FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  // TODO Add hook for fetching currently active channel
  const id = '1494'
  const { channel, loading, error } = useChannel(id, { skip: newChannel })

  const {
    register,
    handleSubmit: useHandleSubmit,
    control,
    setValue,
    getValues,
    formState: { isDirty },
    reset,
    errors,
  } = useForm<Inputs>({
    defaultValues: {
      avatar: { url: null, blob: null },
      cover: { url: null, blob: null },
      channelName: '',
      description: '',
      selectedLanguage: languages[0],
      isPublic: true,
    },
  })

  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [isActionBarActive, setActionBarActive] = useState(false)

  useEffect(() => {
    if (loading || newChannel || !channel) {
      return
    }
    const { avatarPhotoUrl, coverPhotoUrl, title, description, isPublic, language } = channel
    const foundLanguage = languages.find(({ name }) => name === language?.name)
    reset({
      ...getValues(),
      avatar: { blob: null, url: avatarPhotoUrl },
      cover: { blob: null, url: coverPhotoUrl },
      channelName: title || '',
      description: description || '',
      isPublic,
      selectedLanguage: foundLanguage || languages[0],
    })
    if (avatarPhotoUrl) {
      setAvatarImageUrl(avatarPhotoUrl)
    }
    if (coverPhotoUrl) {
      setCoverImageUrl(coverPhotoUrl)
    }
  }, [channel, getValues, loading, newChannel, reset])

  const handleSubmit = useHandleSubmit((data) => {
    console.log(data)
  })
  const handleAvatarConfirm = (blob: Blob, url: string) => {
    setValue('avatar', { url, blob })
    setAvatarImageUrl(url)
    setActionBarActive(true)
  }
  const handleCoverConfirm = (blob: Blob, url: string) => {
    setValue('cover', { url, blob })
    setCoverImageUrl(url)
    setActionBarActive(true)
  }
  const handleCoverRemove = () => {
    setValue('cover', null)
    setCoverImageUrl(null)
    setActionBarActive(true)
  }

  if (error) {
    throw error
  }

  return (
    <form onSubmit={handleSubmit}>
      <Header>
        <ChannelCover
          coverPhotoUrl={coverImageUrl}
          onCoverEditClick={(e) => {
            e.preventDefault()
            coverDialogRef.current?.open()
          }}
          onCoverRemoveClick={handleCoverRemove}
          editable
        />

        <StyledTitleSection className={transitions.names.slide}>
          <StyledAvatar
            imageUrl={avatarImageUrl}
            size="fill"
            onEditClick={(e) => {
              e.preventDefault()
              avatarDialogRef.current?.open()
            }}
            editable
          />

          <TitleContainer>
            <Controller
              name="channelName"
              control={control}
              rules={textFieldValidation('Channel name', 3, 40, true)}
              render={(props) =>
                channel || newChannel ? (
                  <>
                    <Tooltip text="Click to edit channel title">
                      <HeaderTextField
                        placeholder="Add Channel Title"
                        value={props.value}
                        onChange={(e) => {
                          props.onChange(e.currentTarget.value)
                        }}
                        error={!!errors.channelName}
                        helperText={errors.channelName?.message}
                      />
                    </Tooltip>
                    {!newChannel && (
                      <SubTitle>{channel?.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
                    )}
                  </>
                ) : (
                  <TitlePlaceholder>
                    <TitlePlaceholder />
                    <SubTitlePlaceholder />
                  </TitlePlaceholder>
                )
              }
            />
          </TitleContainer>
        </StyledTitleSection>
      </Header>
      <StudioContainer>
        <InnerFormContainer>
          <FormField title="Description">
            <Tooltip text="Click to edit channel description" offsetY={-50}>
              <StyledTextarea
                name="description"
                placeholder="Add description"
                spellcheck={false}
                rows={200}
                ref={register(textFieldValidation('Description', 3, 160))}
                maxLength={160}
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
              name="selectedLanguage"
              control={control}
              rules={requiredValidation('Language')}
              render={({ value, onChange }) => (
                <Select
                  items={[...languages]}
                  label="Channel Language"
                  value={value}
                  onChange={(e) => onChange(e.selectedItem)}
                  error={!!errors.selectedLanguage && !value}
                  helperText={(errors.selectedLanguage as FieldError)?.message}
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
                  items={isPublicSelect}
                  label="Publicness"
                  value={value ? isPublicSelect[0] : isPublicSelect[1]}
                  onChange={(e) => onChange(e.selectedItem?.value)}
                  error={!!errors.isPublic && !value}
                  helperText={(errors.isPublic as FieldError)?.message}
                />
              )}
            />
          </FormField>
          <StyledActionBarTransaction
            fee={FEE}
            isActive={isDirty || isActionBarActive || newChannel}
            primaryButtonText={newChannel ? 'Create a Channel' : 'Publish Changes'}
            secondaryButtonText="Cancel"
            onCancelClick={(e) => {
              e.preventDefault()
            }}
            onConfirmClick={handleSubmit}
          />
        </InnerFormContainer>
      </StudioContainer>
      <Controller
        name="avatar"
        control={control}
        render={() => <ImageCropDialog imageType="avatar" onConfirm={handleAvatarConfirm} ref={avatarDialogRef} />}
      />
      <Controller
        name="cover"
        control={control}
        render={() => <ImageCropDialog imageType="cover" onConfirm={handleCoverConfirm} ref={coverDialogRef} />}
      />
    </form>
  )
}

export default CreateEditChannelView
