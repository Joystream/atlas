import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ChannelCover, FormField, Select, HeaderTextField } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { requiredValidation, textFieldValidation } from './formValidationOptions'
import { formatNumberShort } from '@/utils/number'
import {
  StyledTextarea,
  Form,
  StyledActionBarTransaction,
  StyledAvatar,
  InnerFormContainer,
} from './PlaygroundChannelEdit.style'
import {
  Header,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
} from '../ChannelView/ChannelView.style'
import { ViewWrapper } from '@/components'
import { SelectedItem } from '@/shared/components/Select'

type Inputs = {
  channelName?: string
  description?: string
  selectedPublicness?: string
  selectedLanguage?: string
}

const languages: SelectedItem[] = [
  { name: 'English', value: 'english' },
  { name: 'Polish', value: 'polish' },
]

const publicnessItems: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

const channel = {
  handle: 'Lorem',
  follows: 1000,
}

const PlaygroundChannelEdit = () => {
  const { register, handleSubmit, control, setValue, clearErrors, errors } = useForm<Inputs>({
    defaultValues: {
      channelName: channel.handle,
      description:
        'Making videos about cars, coffee and travelYouTube: SeenThroughGlassPodcast: BehindTheGlassBusiness: Lucy.Bayliss@mcsaatchimerlin.com',
      selectedLanguage: 'english',
      selectedPublicness: 'public',
    },
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <ViewWrapper>
      <Form onSubmit={onSubmit}>
        <Header>
          <ChannelCover
            coverPhotoUrl="https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg"
            editable
          />

          <TitleSection className={transitions.names.slide}>
            <StyledAvatar imageUrl="https://picsum.photos/200/300" size="view" editable />
            <TitleContainer>
              {channel ? (
                <>
                  <HeaderTextField
                    name="channelName"
                    ref={register(textFieldValidation('Channel name', 3, 20))}
                    value={channel.handle}
                    placeholder="Add Channel Title"
                    error={!!errors.channelName}
                    helperText={errors.channelName?.message}
                  />
                  <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
                </>
              ) : (
                <TitlePlaceholder>
                  <TitlePlaceholder />
                  <SubTitlePlaceholder />
                </TitlePlaceholder>
              )}
            </TitleContainer>
          </TitleSection>
        </Header>
        <InnerFormContainer>
          <FormField title="Description">
            <StyledTextarea
              name="description"
              spellcheck={false}
              lineHeight={2}
              ref={register(textFieldValidation('Description', 3, 160))}
              maxLength={160}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </FormField>
          <FormField
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
          </FormField>

          <FormField
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
          </FormField>
          <StyledActionBarTransaction fee={1} primaryButtonText="Publish Changes" />
        </InnerFormContainer>
      </Form>
    </ViewWrapper>
  )
}

export default PlaygroundChannelEdit
