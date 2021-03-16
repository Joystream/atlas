import { StudioHeader, TextField } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import React, { useState } from 'react'
import { Membership } from '../StudioView'
import { Wrapper, Form, StyledButton } from './AddMemberView.style'

type AddMemberViewProps = {
  onSubmit?: (member: Omit<Membership, 'id'>) => void
}

const AddMemberView: React.FC<AddMemberViewProps> = ({ onSubmit }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
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
    </Wrapper>
  )
}

export default AddMemberView
