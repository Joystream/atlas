import React, { useRef, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

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
} from './PlaygroundChannelEdit.style'
import { Header } from '../ChannelView/ChannelView.style'

import { requiredValidation, textFieldValidation } from './formValidationOptions'

const languages: SelectedItem[] = [
  { name: 'English', value: 'english' },
  { name: 'Polish', value: 'polish' },
  { name: 'Spanish', value: 'spanish' },
]

const publicnessItems: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

type Inputs = {
  channelName?: string
  description?: string
  selectedPublicness?: string
  selectedLanguage?: string
  avatar: string | null
  cover: string | null
}

const PlaygroundChannelEdit = () => {
  const { register, handleSubmit: useHandleSubmit, control, setValue, getValues, reset, clearErrors, errors } = useForm<
    Inputs
  >({
    defaultValues: {
      avatar: null,
      cover: null,
      channelName: '',
      description: '',
      selectedLanguage: '',
      selectedPublicness: '',
    },
  })
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const handleSubmit = useHandleSubmit((data) => {
    console.log(data)
  })
  const handleAvatarConfirm = (blob: Blob | null, url: string | null) => {
    setValue('avatar', url)
    setAvatarImageUrl(url)
  }
  const handleCoverConfirm = (blob: Blob, url: string) => {
    setValue('cover', url)
    setCoverImageUrl(url)
  }
  const handleCoverRemove = () => {
    setValue('cover', null)
    setCoverImageUrl(null)
  }

  useEffect(() => {
    setAvatarImageUrl(getValues('avatar'))
    setCoverImageUrl(getValues('cover'))
  }, [getValues])

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
              <Tooltip text="Click to edit channel title" darkenContent={false}>
                <HeaderTextField
                  name="channelName"
                  ref={register(textFieldValidation('Channel name', 3, 20))}
                  value=""
                  placeholder="Add Channel Title"
                  error={!!errors.channelName}
                  helperText={errors.channelName?.message}
                />
              </Tooltip>
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
                lineHeight={2}
                ref={register(textFieldValidation('Description', 3, 160))}
                maxLength={160}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Tooltip>
          </FormField>
          <StyledFormField
            title="Change Language"
            description="Channel language is the main language the content you publish on your channel."
          >
            <Controller
              name="selectedLanguage"
              control={control}
              rules={requiredValidation('Language')}
              render={({ value }) => (
                <Select
                  items={languages}
                  label="Channel Language"
                  onChange={(e) => {
                    setValue('selectedLanguage', e.selectedItem?.value)
                    clearErrors('selectedLanguage')
                  }}
                  error={!!errors.selectedLanguage && !value}
                  helperText={errors.selectedLanguage?.message}
                />
              )}
            />
          </StyledFormField>

          <StyledFormField
            title="Publicness"
            description="Channel language is the main language the content you publish on your channel. We use it to provide users feed they look for. This text is FPO."
          >
            <Controller
              name="selectedPublicness"
              control={control}
              rules={requiredValidation('Publicness')}
              render={({ value }) => (
                <Select
                  items={publicnessItems}
                  label="Publicness"
                  onChange={(e) => {
                    setValue('selectedPublicness', e.selectedItem?.value)
                    clearErrors('selectedPublicness')
                  }}
                  error={!!errors.selectedPublicness && !value}
                  helperText={errors.selectedPublicness?.message}
                />
              )}
            />
          </StyledFormField>
          <StyledActionBarTransaction
            fee={1}
            primaryButtonText="Create a Channel"
            secondaryButtonText="Cancel"
            onCancelClick={(e) => {
              e.preventDefault()
              handleCoverRemove()
              handleAvatarConfirm(null, null)
              reset()
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

export default PlaygroundChannelEdit
