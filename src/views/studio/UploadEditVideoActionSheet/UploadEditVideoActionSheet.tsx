import React, { useCallback, useEffect, useState } from 'react'
import { isValid } from 'date-fns'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { FileRejection } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { transitions } from '@/shared/theme'
import { Location } from 'history'
import {
  Button,
  Checkbox,
  Datepicker,
  FormField,
  HeaderTextField,
  Icon,
  MultiFileSelect,
  RadioButton,
  Select,
  SelectedItem,
  Textarea,
} from '@/shared/components'
import { textFieldValidation, requiredValidation } from '@/utils/formValidationOptions'
import { useCategories } from '@/api/hooks'
import { languages } from '@/config/languages'
import { useDrafts } from '@/hooks'
import { TabType, useUploadVideoActionSheet } from './useVideoActionSheet'
import {
  ButtonsContainer,
  Container,
  Content,
  FileDropperContainer,
  FormContainer,
  StyledActionBar,
  StyledCheckboxContainer,
  StyledRadioContainer,
  Tab,
  TabsContainer,
  TabTitle,
  Topbar,
  UploadEditVideoActionSheetBarHeight,
} from './UploadEditVideoActionSheet.style'
import { absoluteRoutes } from '@/config/routes'

const channelId = 'f636f2fd-c047-424e-baab-6e6cfb3e2780' // mocking test channel id

const visibilityOptions: SelectedItem[] = [
  { name: 'Public (Anyone can see this video)', value: 'public' },
  { name: 'Unlisted (Only people with a link can see this video)', value: 'unlisted' },
]

type FormInputs = {
  title: string
  description: string
  selectedVideoVisibility: string | null
  selectedVideoLanguage: string | null
  selectedVideoCategory: string | null
  hasMarketing: boolean | null
  publishedBeforeJoystream: Date | null
  isExplicit: boolean | null
}

export type SheetState = 'closed' | 'open' | 'minimized'
export const UploadEditVideoActionSheet: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // sheet state
  const uploadVideoMatch = useMatch({ path: `${absoluteRoutes.studio.uploadVideo()}` })
  const [sheetState, setSheetState] = useState<SheetState>('closed')
  const [containerRef, containerBounds] = useMeasure()
  const [actionBarRef, actionBarBounds] = useMeasure()
  const [cachedLocation, setCachedLocation] = useState<Location>()
  // 1 extra px to account for the border
  const transform = containerBounds.height ? containerBounds.height - UploadEditVideoActionSheetBarHeight + 1 : 10000

  const { ...props } = useSpring({
    duration: transitions.timings.sharp,
    transform:
      sheetState === 'open'
        ? `translateY(0)`
        : sheetState === 'closed'
        ? `translateY(${containerBounds.height || 10000}px)`
        : `translateY(${transform}px)`,
  })

  // const { ...props } = useSpring({
  //   duration: transitions.timings.sharp,
  //   transform:
  //     sheetState === 'open'
  //       ? `translateY(0)`
  //       : sheetState === 'closed'
  //       ? `translateY(${containerBounds.height}px)`
  //       : `translateY(${transform}px)`,
  // })

  // forms state
  const { categories, error: categoriesError } = useCategories()
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)
  const handleFileRejections = (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setFileSelectError(invalidSize.message)
      invalidType && setFileSelectError(invalidType.message)
    }
  }
  const { register, watch, handleSubmit, control, setValue: setFormValue, reset, clearErrors, errors } = useForm<
    FormInputs
  >({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      selectedVideoVisibility: 'public',
      selectedVideoLanguage: 'en',
      selectedVideoCategory: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: null,
    },
  })
  const watchAllFormFields = watch()

  // Tabs
  const { drafts, removeDraft, removeAllDrafts, addDraft, updateDraft } = useDrafts('video', channelId)
  const {
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } = useUploadVideoActionSheet()
  const handleTabSelect = useCallback(
    (tab?: TabType) => {
      // reset({
      //   title: '',
      //   selectedVideoVisibility: null,
      //   selectedVideoLanguage: null,
      //   selectedVideoCategory: null,
      //   description: '',
      //   hasMarketing: false,
      //   publishedBeforeJoystream: null,
      //   isExplicit: '',
      // })
      if (tab) {
        setSelectedVideoTab(tab)
        setFormValue('title', tab?.title)
        setFormValue('description', tab.description)
        setFormValue('selectedVideoVisibility', tab.isPublic ? 'public' : 'unlisted' ?? null)
        setFormValue('selectedVideoLanguage', tab.language ?? null)
        setFormValue('selectedVideoCategory', tab.categoryId ?? null)
        setFormValue('publishedBeforeJoystream', tab.publishedBeforeJoystream ?? null)
        setFormValue('hasMarketing', tab.hasMarketing ?? null)
        setFormValue('isExplicit', tab.isExplicit === undefined ? null : tab.isExplicit)
      }
    },
    [setFormValue, setSelectedVideoTab]
  )
  const handleClose = useCallback(() => {
    navigate(cachedLocation?.pathname ?? absoluteRoutes.studio.index())
    setSheetState('closed')
  }, [cachedLocation?.pathname, navigate])
  const handleAddNewTab = useCallback(async () => {
    const newDraft = await addDraft({
      channelId: channelId,
      title: 'New Draft',
      // description: 'asdgasdgjkahskldhjklahjskldhjlhjskljlkhjsdljal;sjdlja;sdj;ajl;dj;ajsd;ljal;d',
      // isPublic: false,
      // language: 'es',
      // categoryId: '02c287dc-0b35-41f8-a494-9d98e312fbff',
      // hasMarketing: true,
      // isExplicit: true,
      // publishedBeforeJoystream: '28/12/1994',
    })
    addVideoTab(newDraft)
    handleTabSelect(newDraft)
  }, [addDraft, addVideoTab, handleTabSelect])

  useEffect(() => {
    if (uploadVideoMatch) {
      setSheetState('open')
      if (videoTabs.length === 0) {
        // handleAddNewTab()
        console.log('new tab on open')
      }
    } else if (sheetState === 'open') {
      setSheetState('minimized')
    }
  }, [uploadVideoMatch, sheetState, handleAddNewTab, videoTabs.length])
  useEffect(() => {
    handleTabSelect(selectedVideoTab)
  }, [handleTabSelect, selectedVideoTab])
  useEffect(() => {
    if (!uploadVideoMatch) {
      setCachedLocation(location)
    }
  }, [location, cachedLocation, uploadVideoMatch])

  const handleRemoveTab = (tab: TabType) => {
    removeVideoTab(tab)
    console.log('remove tab')
    // we are closing the last tab
    if (videoTabs.length === 1) {
      handleClose()
      console.log('close if no tabs')
    }
  }
  console.log({
    uploadVideoMatch,
    sheetState,
    height: containerBounds.height,
    transform,
    categories,
    watchAllFormFields,
  })
  const handleMinimize = () => {
    setSheetState?.('minimized')
    navigate(cachedLocation?.pathname ?? absoluteRoutes.studio.index())
  }
  const handleOpen = () => {
    if (videoTabs.length === 0) handleAddNewTab()
    setSheetState?.('open')
    navigate(absoluteRoutes.studio.uploadVideo())
  }

  // if (categoriesError) throw categoriesError
  return (
    <Container ref={containerRef} role="dialog" style={{ ...props }}>
      <Topbar>
        <TabsContainer>
          <Button variant="tertiary" onClick={handleAddNewTab}>
            <Icon name="plus" />
          </Button>
          {videoTabs.map((tab) => (
            <Tab key={tab.id} selected={tab.id === selectedVideoTab?.id} onClick={() => handleTabSelect(tab)}>
              <TabTitle variant="subtitle2">{tab.title}</TabTitle>
              <Button icon="close" variant="tertiary" onClick={() => handleRemoveTab(tab)}></Button>
            </Tab>
          ))}
        </TabsContainer>
        <ButtonsContainer>
          <Button
            variant="tertiary"
            onClick={() => {
              if (sheetState === 'open') {
                handleMinimize()
              } else {
                handleOpen()
              }
            }}
          >
            <Icon name="minus" />
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              handleClose()
              resetVideoTabs()
            }}
          >
            <Icon name="close" />
          </Button>
        </ButtonsContainer>
      </Topbar>
      <Content>
        <FileDropperContainer>
          <MultiFileSelect
            files={files}
            error={fileSelectError}
            onError={setFileSelectError}
            onDropRejected={handleFileRejections}
            onChangeFiles={setFiles}
            croppedImageUrl={croppedImageUrl}
            onCropImage={setCroppedImageUrl}
          />
        </FileDropperContainer>
        <FormContainer height={transform - actionBarBounds.height - 0 * 2}>
          <HeaderTextField
            name="title"
            ref={register(textFieldValidation('Video Title', 3, 20))}
            value=""
            placeholder="Insert Video Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <Textarea
            name="description"
            ref={register(textFieldValidation('Description', 0, 2160))}
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
              render={({ value }) => (
                <Select
                  value={visibilityOptions.find((o) => o.value === value) ?? null}
                  items={visibilityOptions}
                  onChange={(e) => {
                    setFormValue('selectedVideoVisibility', e.selectedItem?.value)
                    clearErrors('selectedVideoVisibility')
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
              render={({ value }) => (
                <Select
                  value={languages.find((l) => l.value === value) ?? null}
                  items={[...languages]}
                  onChange={(e) => {
                    setFormValue('selectedVideoLanguage', e.selectedItem?.value)
                    clearErrors('selectedVideoLanguage')
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
              render={({ value }) => (
                <Select
                  value={
                    (categories
                      ?.map((category) => ({ name: category.name, value: category.id }))
                      ?.find((c) => c.value === value) as SelectedItem) ?? null
                  }
                  items={
                    (categories?.map((category) => ({ name: category.name, value: category.id })) as SelectedItem[]) ??
                    []
                  }
                  onChange={(e) => {
                    setFormValue('selectedVideoCategory', e.selectedItem?.value)
                    clearErrors('selectedVideoCategory')
                  }}
                  error={!!errors.selectedVideoCategory && !value}
                  helperText={errors.selectedVideoCategory?.message}
                />
              )}
            />
          </FormField>
          <FormField
            title="Published Before"
            description="If the content you are publishng originaly was published in the past for the first time insert the original publication date here."
          >
            <Controller
              name="publishedBeforeJoystream"
              control={control}
              rules={{ validate: (publishedBeforeJoystream) => isValid(publishedBeforeJoystream) }}
              render={({ value }) => (
                <Datepicker
                  value={value}
                  onChange={(publishedBeforeJoystream) =>
                    setFormValue('publishedBeforeJoystream', publishedBeforeJoystream)
                  }
                  onBlur={() => clearErrors('publishedBeforeJoystream')}
                  error={!!errors.publishedBeforeJoystream}
                />
              )}
            />
          </FormField>
          <FormField title="Marketing" description="to be added ???">
            <StyledCheckboxContainer>
              <Controller
                as={Checkbox}
                name="hasMarketing"
                rules={{ required: true }}
                error={!!errors.hasMarketing}
                control={control}
                value={false}
                label="My video features a paid promotion material"
              />
            </StyledCheckboxContainer>
          </FormField>
          <FormField title="Content Rating" description="Lorem ipsum dolor sit amet.">
            <Controller
              name="isExplicit"
              control={control}
              rules={{ required: true }}
              render={({ value }) => (
                <StyledRadioContainer>
                  <RadioButton
                    value={'false'}
                    label="All audiences"
                    onChange={(e) => {
                      clearErrors('isExplicit')
                      setFormValue('isExplicit', false)
                    }}
                    selectedValue={value?.toString()}
                    error={!!errors.isExplicit}
                  />
                  <RadioButton
                    value={'true'}
                    label="Mature"
                    onChange={(e) => {
                      clearErrors('isExplicit')
                      setFormValue('isExplicit', true)
                    }}
                    selectedValue={value?.toString()}
                    error={!!errors.isExplicit}
                  />
                </StyledRadioContainer>
              )}
            />
          </FormField>
        </FormContainer>
      </Content>
      <StyledActionBar
        ref={actionBarRef}
        primaryText={`Fee: ${99} Joy`}
        secondaryText="Every change to the blockchain requires making a nominal transaction."
        primaryButtonText={`Start Publishing`}
        detailsText="Video details saved as draft (2 min ago)"
        tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
        detailsTextIcon="info"
      />
    </Container>
  )
}
