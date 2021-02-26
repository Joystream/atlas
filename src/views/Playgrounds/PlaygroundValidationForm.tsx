import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { isValid } from 'date-fns'
import { textFieldValidation, requiredValidation } from './formValidationOptions'
import styled from '@emotion/styled'
import {
  Button as _Button,
  FormField,
  TextField,
  Select,
  Checkbox,
  Textarea,
  HeaderTextField,
  Datepicker,
  RadioButton,
} from '@/shared/components'
import { SelectedItem } from '@/shared/components/Select'

const items: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

type Inputs = {
  title: string
  selectedVideoVisibility: string | null
  header: string
  check: boolean
  date: Date | null
  textarea: string
  radioGroup: string
}

const PlaygroundValidationForm = () => {
  const { register, handleSubmit, control, setValue, reset, clearErrors, errors } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      title: '',
      selectedVideoVisibility: null,
      header: '',
      textarea: '',
      check: false,
      date: null,
      radioGroup: '',
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
                onChange={(e) => {
                  setValue('selectedVideoVisibility', e.selectedItem?.value)
                  clearErrors('selectedVideoVisibility')
                }}
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
              label="My video features a paid promotion material"
            />
          </StyledCheckboxContainer>
        </FormField>

        <FormField title="Date" description="Lorem ipsum dolor sit amet.">
          <Controller
            name="date"
            control={control}
            rules={{ validate: (date) => isValid(date) }}
            render={() => (
              <Datepicker
                onChange={(date) => setValue('date', date)}
                onBlur={() => clearErrors('date')}
                error={!!errors.date}
              />
            )}
          />
        </FormField>

        <FormField title="Content Rating" description="Lorem ipsum dolor sit amet.">
          <Controller
            name="radioGroup"
            control={control}
            rules={{ required: true }}
            render={(props) => (
              <StyledRadioContainer>
                <RadioButton
                  value="all"
                  label="All audiences"
                  onChange={(value) => {
                    clearErrors('radioGroup')
                    setValue('radioGroup', value)
                  }}
                  selected={props.value}
                  error={!!errors.radioGroup}
                />
                <RadioButton
                  value="mature"
                  label="Mature"
                  onChange={(value) => {
                    clearErrors('radioGroup')
                    setValue('radioGroup', value)
                  }}
                  selected={props.value}
                  error={!!errors.radioGroup}
                />
              </StyledRadioContainer>
            )}
          />
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

const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export default PlaygroundValidationForm
