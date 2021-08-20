import styled from '@emotion/styled'
import { isValid } from 'date-fns'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Checkbox,
  Datepicker,
  FormField,
  RadioButton,
  Select,
  TextArea,
  TextField,
  TitleArea,
  Button as _Button,
} from '@/shared/components'
import { SelectItem } from '@/shared/components/Select'
import { textFieldValidation } from '@/utils/formValidationOptions'
import { ConsoleLogger } from '@/utils/logs'

const items: SelectItem<boolean>[] = [
  { name: 'Public (Anyone can see this video', value: true },
  { name: 'Private', value: false },
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

export const PlaygroundValidationForm = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>({
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
    ConsoleLogger.log('Playground validation form data:', data)
    reset()
  })

  return (
    <>
      <form onSubmit={onSubmit}>
        <TitleArea
          {...register('header', textFieldValidation({ name: 'Channel name', minLength: 3, maxLength: 20 }))}
          value="Lorem ipsum"
          error={!!errors.header}
          helperText={errors.header?.message}
        />

        <FormField title="Title" description="Lorem ipsum dolor sit amet">
          <TextField
            label="Title"
            {...register('title', textFieldValidation({ name: 'Title', minLength: 3, maxLength: 20 }))}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </FormField>

        <FormField title="Video Visibility">
          <Controller
            name="selectedVideoVisibility"
            control={control}
            rules={{ validate: (data) => data !== null }}
            render={({ field: { value, onChange } }) => (
              <Select
                items={items}
                onChange={onChange}
                error={!!errors.selectedVideoVisibility && !value}
                helperText={errors.selectedVideoVisibility?.message}
              />
            )}
          />
        </FormField>

        <FormField title="Marketing" description="Lorem ipsum dolor sit amet.">
          <StyledCheckboxContainer>
            <Controller
              name="check"
              rules={{ required: true }}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value}
                  error={!!errors.check}
                  label="My video features a paid promotion material"
                  onChange={onChange}
                />
              )}
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
            render={({ field: { value } }) => (
              <StyledRadioContainer>
                <RadioButton
                  value="all"
                  label="All audiences"
                  onChange={(e) => {
                    clearErrors('radioGroup')
                    setValue('radioGroup', e.currentTarget.value)
                  }}
                  selectedValue={value}
                  error={!!errors.radioGroup}
                />
                <RadioButton
                  value="mature"
                  label="Mature"
                  onChange={(e) => {
                    clearErrors('radioGroup')
                    setValue('radioGroup', e.currentTarget.value)
                  }}
                  selectedValue={value}
                  error={!!errors.radioGroup}
                />
              </StyledRadioContainer>
            )}
          />
        </FormField>

        <FormField title="Description">
          <TextArea
            {...register('textarea', textFieldValidation({ name: 'Description', minLength: 3, maxLength: 20 }))}
            maxLength={20}
            error={!!errors.textarea}
            helperText={errors.textarea?.message}
          />
        </FormField>

        <Button type="submit">Submit</Button>
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
  align-items: flex-start;
`
