import React, { useState } from 'react'
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

type Inputs = {
  title: string
  videoSelect: string
  header: string
  check: string
  textarea: string
}

const items: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

export const PlaygroundFormView = () => {
  const { register, handleSubmit, control, setValue, errors } = useForm<Inputs>({
    shouldFocusError: false,
  })
  const onSubmit = handleSubmit((data) => console.log(data))
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [checkboxValue, setCheckboxValue] = useState(false)
  return (
    <>
      <form onSubmit={onSubmit}>
        <HeaderTextField
          name="header"
          ref={register(textFieldValidation('Channel', 3, 20))}
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
            name="videoSelect"
            control={control}
            defaultValue={selectedItem}
            rules={requiredValidation('Video Visibility')}
            render={() => (
              <Select
                items={items}
                onChange={({ selectedItem }) => {
                  setValue('videoSelect', selectedItem)
                  selectedItem && setSelectedItem(selectedItem)
                }}
                value={selectedItem}
                error={!!errors.videoSelect && !selectedItem}
                helperText={errors.videoSelect?.message}
              />
            )}
          />
        </FormField>

        <FormField
          title="Marketing"
          description="Short explanation message lives here. Ideally it will be as short as possible but sometimes it might reach the 2 line height."
        >
          <StyledCheckboxContainer>
            <Checkbox
              name="check"
              ref={register(requiredValidation('Checkbox'))}
              value={checkboxValue}
              onChange={setCheckboxValue}
              error={!!errors.check}
            />
            <Text>My video features a paid promotion material</Text>
          </StyledCheckboxContainer>
        </FormField>
        <FormField title="Description">
          <Textarea
            name="textarea"
            ref={register(textFieldValidation('Description', 3, 20))}
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

export default PlaygroundFormView
