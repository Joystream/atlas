import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { isValid } from 'date-fns'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { FileRejection } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { colors, sizes, transitions, zIndex } from '@/shared/theme'
import { Location } from 'history'
import {
  ActionBar,
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
import routes from '@/config/routes'
import { TOP_NAVBAR_HEIGHT } from '@/components'
import { useCategories } from '@/api/hooks'
import { languages } from '@/config/languages'

export const UploadEditVideoActionSheetBarHeight = sizes(14, true)

const visibilityOptions: SelectedItem[] = [
  { name: 'Public (Anyone can see this video)', value: 'public' },
  { name: 'Unlisted (Only people with a link can see this video)', value: 'unlisted' },
]

type Inputs = {
  title: string
  selectedVideoVisibility: string | null
  selectedVideoLanguage: string | null
  selectedVideoCategory: string | null
  check: boolean
  date: Date | null
  description: string
  radioGroup: string
}

export type SheetState = 'closed' | 'open' | 'minimized'
type UploadEditVideoActionSheetProps = {
  // setSheetState?: (sheetState: SheetState) => void
  // sheetState: SheetState
}
export const UploadEditVideoActionSheet: React.FC<UploadEditVideoActionSheetProps> = () => {
  // sheet state
  const navigate = useNavigate()
  const uploadVideoMatch = useMatch({ path: `${routes.studio.uploadVideo()}` })
  const [sheetState, setSheetState] = useState<SheetState>()
  const [containerRef, containerBounds] = useMeasure()
  const [actionBarRef, actionBarBounds] = useMeasure()
  const location = useLocation()
  const [cachedLocation, setCachedLocation] = useState<Location>()

  const transform = containerBounds.height ? containerBounds.height - UploadEditVideoActionSheetBarHeight + 1 : 10000
  const { ...props } = useSpring({
    duration: transitions.timings.sharp,
    transform:
      sheetState === 'open'
        ? `translateY(0)`
        : sheetState === 'closed'
        ? `translateY(${containerBounds.height}px)`
        : `translateY(${transform}px)`,
  })
  useEffect(() => {
    // console.log({ uploadVideoMatch, sheetState })
    if (uploadVideoMatch) {
      setSheetState('open')
    } else if (sheetState === 'open') {
      setSheetState('minimized')
    }
  }, [uploadVideoMatch, sheetState])

  useEffect(() => {
    // console.log({ cachedLocation, location, uploadVideoMatch })
    if (!uploadVideoMatch) {
      setCachedLocation(location)
    }
  }, [location, cachedLocation, uploadVideoMatch])

  // forms state
  const { loading: categoriesLoading, categories, error: categoriesError } = useCategories()
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
  const { register, handleSubmit, control, setValue, reset, clearErrors, errors } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      title: '',
      selectedVideoVisibility: null,
      selectedVideoLanguage: null,
      selectedVideoCategory: null,
      description: '',
      check: false,
      date: null,
      radioGroup: '',
    },
  })

  console.log({
    uploadVideoMatch,
    sheetState,
    height: containerBounds.height,
    transform,
    categories,
  })
  return (
    <Container ref={containerRef} role="dialog" style={{ ...props }}>
      <Topbar>
        <TabsContainer>
          <Tab>
            This is a tab
            <Button
              icon="close"
              variant="tertiary"
              onClick={() => {
                console.log('close tab')
              }}
            ></Button>
          </Tab>
          <Button variant="tertiary" onClick={() => {}}>
            <Icon name="plus" />
          </Button>
        </TabsContainer>
        <ButtonsContainer>
          <Button
            variant="tertiary"
            onClick={() => {
              if (sheetState === 'open') {
                setSheetState?.('minimized')
                navigate(cachedLocation?.pathname ?? routes.studio.index(true))
                console.log('minimize')
              } else {
                setSheetState?.('open')
                navigate(routes.studio.uploadVideo())
                console.log('open')
              }
            }}
          >
            <Icon name="minus" />
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              navigate(cachedLocation?.pathname ?? routes.studio.index(true))
              setSheetState?.('closed')
              console.log('close')
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
            ref={register(textFieldValidation('Description', 3, 20))}
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
                  items={visibilityOptions}
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
          <FormField title="Video Language">
            <Controller
              name="selectedVideoLanguage"
              control={control}
              rules={requiredValidation('Video language')}
              render={({ value }) => (
                <Select
                  items={[...languages]}
                  onChange={(e) => {
                    setValue('selectedVideoLanguage', e.selectedItem?.value)
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
                  items={categories?.map((category) => ({ name: category.name, value: category.id })) ?? []}
                  onChange={(e) => {
                    setValue('selectedVideoLanguage', e.selectedItem?.value)
                    clearErrors('selectedVideoLanguage')
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
          <FormField title="Marketing" description="to be added ???">
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
                    onChange={(e) => {
                      clearErrors('radioGroup')
                      setValue('radioGroup', e.currentTarget.value)
                    }}
                    selectedValue={props.value}
                    error={!!errors.radioGroup}
                  />
                  <RadioButton
                    value="mature"
                    label="Mature"
                    onChange={(e) => {
                      clearErrors('radioGroup')
                      setValue('radioGroup', e.currentTarget.value)
                    }}
                    selectedValue={props.value}
                    error={!!errors.radioGroup}
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

const StyledActionBar = styled(ActionBar)`
  position: initial;
  border-top: solid 1px ${colors.gray[700]};
`

const Container = styled(animated.div)`
  --upload-video-action-sheet-bar-height: ${UploadEditVideoActionSheetBarHeight}px;
  transform: translateY(100%);
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.gray[900]};
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--upload-video-action-sheet-bar-height);
  border-bottom: solid 1px ${colors.gray[700]};
`

const TabsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
`

const ButtonsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  border-left: solid 1px ${colors.gray[700]};
`

const Content = styled.div`
  display: grid;
  grid-gap: ${sizes(12)};
  grid-template-columns: 1fr 1fr;
`

const StyledCheckboxContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  p {
    margin-left: 20px;
  }
`

const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const FileDropperContainer = styled.div`
  padding: ${sizes(8)} 0 ${sizes(8)} ${sizes(8)};
`

const FormContainer = styled.div<{ height: number }>`
  display: grid;
  grid-auto-flow: row;
  overflow-y: auto;
  height: ${({ height }) => height}px;
  padding: ${sizes(8)} ${sizes(24)} ${sizes(8)} 0;
  scroll-padding: 0 0 ${sizes(24)} 0;
`

const Tab = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding: 0 ${sizes(4)};
  align-items: center;
`
