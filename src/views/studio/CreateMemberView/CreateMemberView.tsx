import { ActionDialog } from '@/components/Dialogs'
import { Spinner, StudioHeader, Text, TextField } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Form, StyledButton, Wrapper, StyledText } from './CreateMemberView.style'

const CreateMemberView = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    handle: '',
    userName: '',
    about: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.currentTarget.name as 'avatarUri' | 'handle' | 'about']: e.currentTarget.value,
    })
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // do something here
    setLoading(true)
  }

  return (
    <Wrapper>
      <StudioHeader
        title="Add Member Details"
        subtitle="Customize your membership details to easily spot the member account you would like to use when signing in."
      />
      <Form onSubmit={handleSubmit}>
        <TextField name="avatarUri" label="Avatar url" onChange={handleChange} />
        <TextField name="handle" label="Member Name" onChange={handleChange} />
        <TextArea name="about" placeholder="About" onChange={handleChange} />
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
