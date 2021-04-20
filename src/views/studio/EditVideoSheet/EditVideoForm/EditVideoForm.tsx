import React from 'react'
import { Control, Controller, DeepMap, FieldError, UseFormMethods } from 'react-hook-form'
import { isValid } from 'date-fns'
import { useCategories } from '@/api/hooks'
import { Checkbox, Datepicker, FormField, RadioButton, Select, SelectItem, TextArea } from '@/shared/components'
import { requiredValidation } from '@/utils/formValidationOptions'
import { languages } from '@/config/languages'
import { FormContainer, StyledHeaderTextField, StyledRadioContainer } from './EditVideoForm.style'

const visibilityOptions: SelectItem[] = [
  { name: 'Public (Anyone can see this video)', value: 'public' },
  { name: 'Unlisted (Only people with a link can see this video)', value: 'unlisted' },
]

export type FormInputs = {
  title: string
  description: string
  selectedVideoVisibility: string | null
  selectedVideoLanguage: string | null
  selectedVideoCategory: string | null
  hasMarketing: boolean | null
  publishedBeforeJoystream: Date | null
  isExplicit: boolean | null
}

export type FormProps = {
  titleRef: React.Ref<HTMLInputElement> | undefined
  descriptionRef: React.Ref<HTMLTextAreaElement> | undefined
  errors: DeepMap<FormInputs, FieldError>
  control: Control<FormInputs>
  clearErrors: UseFormMethods<FormInputs>['clearErrors']
  setFormValue: UseFormMethods<FormInputs>['setValue']
}

export const EditVideoForm: React.FC<FormProps> = ({ errors, control, descriptionRef, titleRef, clearErrors }) => {
  const { categories, error: categoriesError } = useCategories()

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  if (categoriesError) throw categoriesError

  return (
    <FormContainer>
      <StyledHeaderTextField
        name="title"
        ref={titleRef}
        value=""
        placeholder="Insert Video Title"
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextArea
        name="description"
        ref={descriptionRef}
        maxLength={2160}
        placeholder="Add video description"
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <FormField title="Video Visibility">
        <Controller
          name="selectedVideoVisibility"
          control={control}
          rules={requiredValidation('Video visibility')}
          render={({ value, onChange }) => (
            <Select
              value={value}
              items={visibilityOptions}
              onChange={onChange}
              error={!!errors.selectedVideoVisibility && !value}
              helperText={errors.selectedVideoVisibility?.message}
            />
          )}
        />
      </FormField>
      <FormField title="Video Language">
        <Controller
          name="selectedVideoLanguage"
          control={control}
          rules={requiredValidation('Video language')}
          render={({ value, onChange }) => (
            <Select
              value={value ?? null}
              items={languages}
              onChange={onChange}
              error={!!errors.selectedVideoLanguage && !value}
              helperText={errors.selectedVideoLanguage?.message}
            />
          )}
        />
      </FormField>
      <FormField title="Video Category">
        <Controller
          name="selectedVideoCategory"
          control={control}
          rules={requiredValidation('Video category')}
          render={({ value, onChange }) => (
            <Select
              value={value ?? null}
              items={categoriesSelectItems}
              onChange={onChange}
              error={!!errors.selectedVideoCategory && !value}
              helperText={errors.selectedVideoCategory?.message}
            />
          )}
        />
      </FormField>
      <FormField
        title="Published Before"
        description="If the content you are publishing was originally published outside of Joystream, please provide the original publication date."
      >
        <Controller
          name="publishedBeforeJoystream"
          control={control}
          rules={{ validate: (publishedBeforeJoystream) => isValid(publishedBeforeJoystream) }}
          render={({ value, onChange }) => (
            <Datepicker
              value={value}
              onChange={onChange}
              onBlur={() => clearErrors('publishedBeforeJoystream')}
              error={!!errors.publishedBeforeJoystream}
            />
          )}
        />
      </FormField>
      <FormField title="Marketing" description="Please select whether your video contains paid promotions">
        <Controller
          as={Checkbox}
          name="hasMarketing"
          control={control}
          value={false}
          label="My video features a paid promotion material"
        />
      </FormField>
      <FormField
        title="Content Rating"
        description="Please select whether your video contains explicit material (sex, violence, etc.)"
      >
        <Controller
          name="isExplicit"
          control={control}
          render={({ value, onChange }) => (
            <StyledRadioContainer>
              <RadioButton
                value="false"
                label="All audiences"
                onChange={() => onChange(false)}
                selectedValue={value?.toString()}
              />
              <RadioButton
                value="true"
                label="Mature"
                onChange={() => onChange(true)}
                selectedValue={value?.toString()}
              />
            </StyledRadioContainer>
          )}
        />
      </FormField>
    </FormContainer>
  )
}
