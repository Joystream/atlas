import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Button as _Button,
  Text,
  FormField,
  TextField,
  Select,
  Checkbox,
  Textarea,
  HeaderTextField,
} from '@/shared/components'
import { textFieldValidation, requiredValidation } from './formValidationOptions'
import { SelectedItem } from '@/shared/components/Select'
import styled from '@emotion/styled'

const items: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

const PlaygroundValidationForm = () => {
  const { register, handleSubmit, control, setValue, reset, errors } = useForm({
    shouldFocusError: false,
    defaultValues: {
      title: '',
      selectedVideoVisibility: null,
      header: '',
      textarea: '',
      check: false,
    },
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    reset()
  })

  return (
    <>
      <form onSubmit={onSubmit}>
        <HeaderTextField
          name="header"
          ref={register(textFieldValidation('Channel name', 3, 20))}
          value="Lorem ipsum"
          error={!!errors.header}
          helperText={errors.header?.message}
        />

        <FormField title="Title" description="Lorem ipsum dolor sit amet">
          <TextField
            name="title"
            label="Title"
            ref={register(textFieldValidation('Title', 3, 20))}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </FormField>

        <FormField title="Video Visibility">
          <Controller
            name="selectedVideoVisibility"
            control={control}
            rules={requiredValidation('Video visibility')}
            render={({ value }) => (
              <Select
                items={items}
                onChange={(e) => setValue('selectedVideoVisibility', e.selectedItem?.value)}
                error={!!errors.selectedVideoVisibility && !value}
                helperText={errors.selectedVideoVisibility?.message}
              />
            )}
          />
        </FormField>

        <FormField title="Marketing" description="Lorem ipsum dolor sit amet.">
          <StyledCheckboxContainer>
            <Controller
              as={Checkbox}
              name="check"
              rules={{ required: true }}
              error={!!errors.check}
              control={control}
              value={false}
            />
            <Text>My video features a paid promotion material</Text>
          </StyledCheckboxContainer>
        </FormField>

        <FormField title="Description">
          <Textarea
            name="textarea"
            ref={register(textFieldValidation('Description', 3, 20))}
            maxLength={20}
            error={!!errors.textarea}
            helperText={errors.textarea?.message}
          />
        </FormField>

        <Button>Submit</Button>
      </form>
    </>
  )
}

const Button = styled(_Button)`
  display: block;
`

const StyledCheckboxContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
  p {
    margin-left: 20px;
  }
`

export default PlaygroundValidationForm
