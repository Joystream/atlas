import { StudioHeader, TextField } from '@/shared/components'
import React from 'react'
import { Wrapper, Form, StyledButton } from './AddMemberView.style'

const AddMemberView = () => {
  return (
    <Wrapper>
      <StudioHeader
        title="Add Member Details"
        subtitle="Customize your membership details to easily spot the member account you would like to use when signing in."
      />
      <Form>
        <TextField name="memberName" label="Member Name" />
        <TextField name="userName" label="User Name" />
        <StyledButton>Next</StyledButton>
      </Form>
    </Wrapper>
  )
}

export default AddMemberView
