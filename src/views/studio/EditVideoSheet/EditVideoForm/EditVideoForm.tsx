import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { debounce } from 'lodash'
import { useCategories } from '@/api/hooks'
import {
  useDrafts,
  useActiveUser,
  EditVideoSheetTab,
  useEditVideoSheetTabData,
  EditVideoFormFields,
  useEditVideoSheet,
} from '@/hooks'
import { Checkbox, Datepicker, FormField, RadioButton, Select, SelectItem, TextArea } from '@/shared/components'
import { requiredValidation, pastDateValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { languages } from '@/config/languages'
import {
  FormContainer,
  StyledHeaderTextField,
  StyledRadioContainer,
  DeleteVideoContainer,
  DeleteVideoButton,
} from './EditVideoForm.style'
import { StyledActionBar } from '@/views/studio/EditVideoSheet/EditVideoSheet.style'
import { SvgGlyphInfo } from '@/shared/icons'

const visibilityOptions: SelectItem<boolean>[] = [
  { name: 'Public (Anyone can see this video)', value: true },
  { name: 'Unlisted (Only people with a link can see this video)', value: false },
]

type EditVideoFormProps = {
  onSubmit: (data: EditVideoFormFields) => void
  selectedVideoTab?: EditVideoSheetTab
}

export const EditVideoForm: React.FC<EditVideoFormProps> = ({ onSubmit, selectedVideoTab }) => {
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const { categories, error: categoriesError } = useCategories()
  const { addDraft, updateDraft } = useDrafts('video', channelId)
  const [cachedSelectedVideoTab, setCachedSelectedVideoTab] = useState<EditVideoSheetTab | null>(null)
  const { updateSelectedVideoTab } = useEditVideoSheet()
  const { data: tabData, loading: tabDataLoading, error: tabDataError } = useEditVideoSheetTabData(selectedVideoTab)

  if (categoriesError) {
    throw categoriesError
  }

  if (tabDataError) {
    throw tabDataError
  }

  const { register, control, handleSubmit, errors, getValues, reset, formState } = useForm<EditVideoFormFields>({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      isPublic: true,
      language: 'en',
      category: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: null,
    },
  })

  // we pass the functions explicitly so the debounced function doesn't need to change when those functions change
  const debouncedDraftSave = useRef(
    debounce(
      (
        tab: EditVideoSheetTab,
        data: EditVideoFormFields,
        addDraftFn: typeof addDraft,
        updateDraftFn: typeof updateDraft,
        updateSelectedTabFn: typeof updateSelectedVideoTab
      ) => {
        if (tab.isFresh) {
          addDraftFn(data, tab.id)
          updateSelectedTabFn({ isFresh: false })
        } else {
          updateDraftFn(tab.id, data)
        }
        console.log('!!!save draft!!!')
      },
      700
    )
  )

  useEffect(() => {
    if (tabDataLoading || !tabData || !selectedVideoTab) {
      return
    }

    if (selectedVideoTab === cachedSelectedVideoTab) {
      return
    }
    setCachedSelectedVideoTab(selectedVideoTab)

    // flush any possible changes to the edited draft
    debouncedDraftSave.current.flush()

    console.log('reset')
    reset(tabData)
  }, [selectedVideoTab, cachedSelectedVideoTab, reset, tabDataLoading, tabData, formState.isDirty])

  const handleFormChange = () => {
    if (!selectedVideoTab) {
      return
    }
    const data = getValues()
    debouncedDraftSave.current(selectedVideoTab, data, addDraft, updateDraft, updateSelectedVideoTab)
  }

  const handleDeleteVideo = () => {
    // TODO add logic for deleting video
  }

  const categoriesSelectItems: SelectItem[] =
    categories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.id,
    })) || []

  return (
    <FormContainer onChange={handleFormChange}>
      <StyledHeaderTextField
        name="title"
        ref={register(textFieldValidation('Video Title', 3, 20))}
        value=""
        placeholder="Insert Video Title"
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextArea
        name="description"
        ref={register(textFieldValidation('Description', 0, 2160))}
        maxLength={2160}
        placeholder="Add video description"
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <FormField title="Video Visibility">
        <Controller
          name="isPublic"
          control={control}
          rules={{
            validate: (value) => value !== null,
          }}
          render={({ value, onChange }) => (
            <Select
              value={value}
              items={visibilityOptions}
              onChange={onChange}
              error={!!errors.isPublic && !value}
              helperText={errors.isPublic ? 'Video visibility must be selected' : ''}
            />
          )}
        />
      </FormField>
      <FormField title="Video Language">
        <Controller
          name="language"
          control={control}
          rules={requiredValidation('Video language')}
          render={({ value, onChange }) => (
            <Select
              value={value ?? null}
              items={languages}
              onChange={onChange}
              error={!!errors.language && !value}
              helperText={errors.language?.message}
            />
          )}
        />
      </FormField>
      <FormField title="Video Category">
        <Controller
          name="category"
          control={control}
          rules={requiredValidation('Video category')}
          render={({ value, onChange }) => (
            <Select
              value={value ?? null}
              items={categoriesSelectItems}
              onChange={onChange}
              error={!!errors.category && !value}
              helperText={errors.category?.message}
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
            validate: (publishedBeforeJoystream) => pastDateValidation(publishedBeforeJoystream),
          }}
          render={({ value, onChange }) => (
            <Datepicker
              value={value}
              onChange={onChange}
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
            <Checkbox value={value} label="My video features a paid promotion material" onChange={onChange} />
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
          defaultValue={false}
          rules={{
            validate: (value) => value !== null,
          }}
          render={({ value, onChange }) => (
            <StyledRadioContainer>
              <RadioButton
                value="false"
                label="All audiences"
                onChange={() => onChange(false)}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
                helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
              />
              <RadioButton
                value="true"
                label="Mature"
                onChange={() => onChange(true)}
                selectedValue={value?.toString()}
                error={!!errors.isExplicit}
                helperText={errors.isExplicit ? 'Content rating must be selected' : ''}
              />
            </StyledRadioContainer>
          )}
        />
      </FormField>
      {!selectedVideoTab?.isDraft && (
        <DeleteVideoContainer>
          <DeleteVideoButton size="large" variant="tertiary" textColorVariant="error" onClick={handleDeleteVideo}>
            Delete video
          </DeleteVideoButton>
        </DeleteVideoContainer>
      )}

      <StyledActionBar
        fee={99}
        primaryButtonText="Publish video"
        onConfirmClick={handleSubmit(onSubmit)}
        detailsText="Drafts are saved automatically"
        tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
        detailsTextIcon={<SvgGlyphInfo />}
      />
    </FormContainer>
  )
}
