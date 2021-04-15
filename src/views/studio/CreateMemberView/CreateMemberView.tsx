import { ActionDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { Spinner, Text, TextField } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import { textFieldValidation, urlValidation } from '@/utils/formValidationOptions'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Form, StyledButton, Wrapper, StyledText, Header, Hero, SubTitle, StyledAvatar } from './CreateMemberView.style'

type Inputs = {
  handle: string
  avatarUri: string
  about: string
}

const CreateMemberView = () => {
  const [loading, setLoading] = useState(false)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const navigate = useNavigate()
  const { register, handleSubmit, errors, getValues, trigger } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      handle: '',
      avatarUri: '',
      about: '',
    },
  })

  useEffect(() => {
    if (!loading) {
      return
    }
    const timeout = setTimeout(() => {
      setLoading(false)
      navigate(absoluteRoutes.studio.signIn())
    }, 3000)
    return () => {
      clearTimeout(timeout)
    }
  }, [loading, navigate])

  const debounceAvatarChange = debounce(async (value) => {
    await trigger('avatarUri')
    if (!errors.avatarUri) {
      setAvatarImageUrl(value)
    }
  }, 1000)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    debounceAvatarChange(value)
  }

  const handleCreateMember = handleSubmit((data) => {
    setLoading(true)
    // create member here
  })
  return (
    <Wrapper>
      <Header>
        <Hero variant="h2">Create Joystream membership</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <Form onSubmit={handleCreateMember}>
        <StyledAvatar size="view" imageUrl={avatarImageUrl} />
        <TextField
          name="avatarUri"
          onChange={handleAvatarChange}
          label="Avatar url"
          placeholder="http://link_to_avatar_file"
          ref={register(urlValidation('Avatar url'))}
          error={!!errors.avatarUri}
          helperText={errors.avatarUri?.message}
        />
        <TextField
          name="handle"
          label="Username"
          placeholder="Johnny Smith"
          ref={register(textFieldValidation('Member name', 3, 20, true))}
          error={!!errors.handle}
          helperText={errors.handle?.message}
        />
        <TextArea
          name="about"
          label="About me"
          placeholder="Describe yourself here..."
          maxLength={100}
          ref={register(textFieldValidation('About', 0, 100))}
          error={!!errors.about}
          helperText={errors.about?.message}
        />
        <StyledButton type="submit">Create membership</StyledButton>
      </Form>
      <ActionDialog showDialog={loading} exitButton={false}>
        <Spinner />
        <Text variant="h4">Creating Membership...</Text>
        <StyledText variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero rem facilis assumenda consequuntur nostrum
          inventore earum molestias ab quidem odio!
        </StyledText>
      </ActionDialog>
    </Wrapper>
  )
}

export default CreateMemberView
