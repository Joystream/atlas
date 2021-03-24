import { ActionDialog } from '@/components/Dialogs'
import { useActiveUser } from '@/hooks'
import { Spinner, StudioHeader, Text, TextField } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import { textFieldValidation } from '@/utils/formValidationOptions'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { createFakeMembership } from '../SignInView/fakeUtils'
import { Form, StyledButton, Wrapper, StyledText } from './CreateMemberView.style'

type Inputs = {
  handle: string
  avatarUri: string
  about: string
}

const CreateMemberView = () => {
  const { activeUser } = useActiveUser()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, errors } = useForm<Inputs>({
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
      navigate('/studio/membership')
    }, 3000)
    return () => {
      clearTimeout(timeout)
    }
  }, [loading, navigate])

  const onSubmit = handleSubmit((data) => {
    setLoading(true)
    if (activeUser?.accountId) {
      // temporary
      createFakeMembership(activeUser?.accountId, {
        handle: data.handle,
        avatarUri: data?.avatarUri,
        about: data?.about,
      })
    }
  })

  return (
    <Wrapper>
      <StudioHeader
        title="Add Member Details"
        subtitle="Customize your membership details to easily spot the member account you would like to use when signing in."
      />
      <Form onSubmit={onSubmit}>
        <TextField name="avatarUri" label="Avatar url" ref={register} />
        <TextField
          name="handle"
          label="Member Name"
          ref={register(textFieldValidation('Member name', 3, 20, true))}
          error={!!errors.handle}
          helperText={errors.handle?.message}
        />
        <TextArea
          name="about"
          placeholder="About"
          maxLength={100}
          ref={register(textFieldValidation('About', 0, 100))}
          error={!!errors.about}
          helperText={errors.about?.message}
        />
        <StyledButton>Next</StyledButton>
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
