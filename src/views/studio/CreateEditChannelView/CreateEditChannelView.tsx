import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm, Controller, FieldError } from 'react-hook-form'
import { useChannel } from '@/api/hooks'

import { ImageCropDialog, ImageCropDialogImperativeHandle, ViewWrapper } from '@/components'
import { ChannelCover, FormField, Select, SelectedItem, HeaderTextField, Tooltip } from '@/shared/components'

import { transitions } from '@/shared/theme'
import {
  StyledTitleSection,
  TitleContainer,
  StyledFormField,
  StyledTextarea,
  StyledActionBarTransaction,
  StyledAvatar,
  InnerFormContainer,
} from './CreateEditChannelView.style'
import { Header, SubTitle, SubTitlePlaceholder, TitlePlaceholder } from '@/views/consumer/ChannelView/ChannelView.style'
import { requiredValidation, textFieldValidation } from '@/views/playground/Playgrounds/formValidationOptions'
import { formatNumberShort } from '@/utils/number'

const languages: SelectedItem[] = [
  { name: 'English', value: 'en' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Spanish', value: 'es' },
  { name: 'Hindi', value: 'hi' },
  { name: 'Arabic', value: 'ar' },
  { name: 'Portuguese', value: 'pt' },
  { name: 'Russian', value: 'ru' },
  { name: 'Japanese', value: 'ja' },
  { name: 'German', value: 'de' },
  { name: 'Korean', value: 'ko' },
  { name: 'French', value: 'fr' },
  { name: 'Turkish', value: 'tr' },
  { name: 'Italian', value: 'it' },
  { name: 'Danish', value: 'dk' },
  { name: 'Finnish', value: 'fi' },
  { name: 'Norwegian', value: 'no' },
  { name: 'Vietnamese', value: 'vi' },
  { name: 'Greek', value: 'el' },
  { name: 'Dutch', value: 'nl' },
  { name: 'Estonian', value: 'et' },
  { name: 'Swedish', value: 'sv' },
]

const isPublic: SelectedItem[] = [
  { name: 'Public (Channel will appear in feeds)', value: true },
  { name: 'Unlisted', value: false },
]

const FEE = 1

type ImageAsset = {
  url: string | null
  blob: Blob | null
}
type Inputs = {
  channelName?: string
  description?: string
  isPublic: SelectedItem
  selectedLanguage: SelectedItem
  avatar: ImageAsset
  cover: ImageAsset
}

type CreateEditChannelViewProps = {
  newChannel?: boolean
}

const CreateEditChannelView: React.FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  // TODO Add hook for fetching currently active channel
  const id = newChannel ? null : '1494'

  const { channel, loading, error } = useChannel(id || '')
  const {
    register,
    handleSubmit: useHandleSubmit,
    control,
    setValue,
    getValues,
    formState: { isDirty },
    errors,
  } = useForm<Inputs>({
    defaultValues: {
      avatar: { url: null, blob: null },
      cover: { url: null, blob: null },
      channelName: '',
      description: '',
      selectedLanguage: languages[0],
      isPublic: isPublic[0],
    },
  })

  useEffect(() => {
    if (loading || newChannel) {
      return
    }
    setValue('avatar', { blob: null, url: channel?.avatarPhotoUrl })
    setValue('cover', { blob: null, url: channel?.coverPhotoUrl })
    setValue('channelName', channel?.handle)
    // TODO Add setValue for description, language and publicness after Channel fields update
  }, [loading, newChannel, setValue, channel?.avatarPhotoUrl, channel?.coverPhotoUrl, channel?.handle])

  useEffect(() => {
    setAvatarImageUrl(getValues('avatar')?.url)
    setCoverImageUrl(getValues('cover')?.url)
  }, [getValues, loading])

  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [isActionBarActive, setActionBarActive] = useState(false)

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
    <ViewWrapper>
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
                rules={textFieldValidation('Channel name', 3, 20)}
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
          <StyledFormField
            title="Change Language"
            description="Channel language is the main language of the content you publish on your channel"
          >
            <Controller
              name="selectedLanguage"
              control={control}
              rules={requiredValidation('Language')}
              render={({ value, onChange }) => (
                <Select
                  items={languages}
                  label="Channel Language"
                  value={value}
                  onChange={(e) => onChange(e.selectedItem)}
                  error={!!errors.selectedLanguage && !value}
                  helperText={(errors.selectedLanguage as FieldError)?.message}
                />
              )}
            />
          </StyledFormField>

          <StyledFormField
            title="Publicness"
            description="Publicness dictates whether your channel will be displayed in users' feeds"
          >
            <Controller
              name="isPublic"
              control={control}
              rules={requiredValidation('Publicness')}
              render={({ value, onChange }) => (
                <Select
                  items={isPublic}
                  label="Publicness"
                  value={value}
                  onChange={(e) => onChange(e.selectedItem)}
                  error={!!errors.isPublic && !value}
                  helperText={(errors.isPublic as FieldError)?.message}
                />
              )}
            />
          </StyledFormField>
          <StyledActionBarTransaction
            fee={FEE}
            isActive={isDirty || isActionBarActive || newChannel}
            primaryButtonText={newChannel ? 'Create a Channel' : 'Publish Changes'}
            secondaryButtonText="Cancel"
            onCancelClick={(e) => {
              e.preventDefault()
              // For reseting selects field, avatar and cover
              window.location.reload()
            }}
          />
        </InnerFormContainer>
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
    </ViewWrapper>
  )
}

export default CreateEditChannelView
