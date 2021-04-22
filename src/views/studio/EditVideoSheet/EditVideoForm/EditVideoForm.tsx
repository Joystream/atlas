import React from 'react'
import { Control, Controller, DeepMap, FieldError, UseFormMethods } from 'react-hook-form'
import { useCategories } from '@/api/hooks'
import { useDrafts } from '@/hooks'
import { Checkbox, Datepicker, FormField, RadioButton, Select, SelectItem, TextArea } from '@/shared/components'
import { requiredValidation, dateValidation } from '@/utils/formValidationOptions'
import { languages } from '@/config/languages'
import {
  FormContainer,
  StyledHeaderTextField,
  StyledRadioContainer,
  DeleteVideoContainer,
  DeleteVideoButton,
} from './EditVideoForm.style'

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
  draftId?: string
}

export const EditVideoForm: React.FC<FormProps> = ({
  errors,
  control,
  descriptionRef,
  titleRef,
  clearErrors,
  draftId,
}) => {
  const { categories, error: categoriesError } = useCategories()
  const { updateDraft } = useDrafts('video')

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  const handleDeleteVideo = () => {
    // TODO add logic for deleting video
  }

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
        onBlur={(e) => {
          draftId && updateDraft(draftId, { title: e.target.value })
        }}
      />
      <TextArea
        name="description"
        ref={descriptionRef}
        maxLength={2160}
        placeholder="Add video description"
        error={!!errors.description}
        helperText={errors.description?.message}
        onBlur={(e) => draftId && updateDraft(draftId, { description: e.target.value })}
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
              onChange={(value) => {
                const isPublic = value === visibilityOptions[0].value
                onChange(value)
                draftId && updateDraft(draftId, { isPublic })
              }}
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
              onChange={(value) => {
                onChange(value)
                draftId && updateDraft(draftId, { language: value })
              }}
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
              onChange={(value) => {
                onChange(value)
                draftId && updateDraft(draftId, { categoryId: value })
              }}
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
          rules={{
            validate: (publishedBeforeJoystream) => dateValidation(publishedBeforeJoystream),
          }}
          render={({ value, onChange }) => (
            <Datepicker
              value={value}
              onChange={onChange}
              onBlur={(e) => {
                draftId && updateDraft(draftId, { publishedBeforeJoystream: e.target.value })
              }}
              error={!!errors.publishedBeforeJoystream}
              helperText={errors.publishedBeforeJoystream ? 'Please provide a valid date.' : ''}
            />
          )}
        />
      </FormField>
      <FormField title="Marketing" description="Please select whether your video contains paid promotions">
        <Controller
          name="hasMarketing"
          control={control}
          render={({ value, onChange }) => (
            <Checkbox
              value={value}
              label="My video features a paid promotion material"
              onChange={onChange}
              onBlur={() => draftId && updateDraft(draftId, { hasMarketing: value })}
            />
          )}
        />
      </FormField>
      <FormField
        title="Content Rating"
        description="Please select whether your video contains explicit material (sex, violence, etc.)"
      >
        <Controller
          name="isExplicit"
          control={control}
          rules={{
            validate: (value) => value !== null,
          }}
          render={({ value, onChange }) => (
            <StyledRadioContainer>
              <RadioButton
                value="false"
                label="All audiences"
                onChange={() => {
                  onChange(false)
                  draftId && updateDraft(draftId, { isExplicit: false })
                }}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
                helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
              />
              <RadioButton
                value="true"
                label="Mature"
                onChange={() => {
                  onChange(true)
                  draftId && updateDraft(draftId, { isExplicit: true })
                }}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
                helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
              />
            </StyledRadioContainer>
          )}
        />
      </FormField>
      <DeleteVideoContainer>
        <DeleteVideoButton size="large" variant="tertiary" textColorVariant="error" onClick={handleDeleteVideo}>
          Delete video
        </DeleteVideoButton>
      </DeleteVideoContainer>
    </FormContainer>
  )
}
