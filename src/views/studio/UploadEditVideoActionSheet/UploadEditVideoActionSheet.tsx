import React, { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import { colors, sizes, transitions, zIndex } from '@/shared/theme'
import {
  ActionBar,
  ActionBarTransaction,
  Button,
  Checkbox,
  Datepicker,
  FormField,
  HeaderTextField,
  MultiFileSelect,
  RadioButton,
  Select,
  SelectedItem,
  Textarea,
} from '@/shared/components'
import { useMatch, useNavigate } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { FileRejection } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { textFieldValidation, requiredValidation } from '@/utils/formValidationOptions'
import routes from '@/config/routes'
import { TOP_NAVBAR_HEIGHT } from '@/components'
import { isValid } from 'date-fns'

export const UploadEditVideoActionSheetBarHeight = sizes(14, true)

const items: SelectedItem[] = [
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
  const [ref, bounds] = useMeasure()
  const transform = bounds.height ? bounds.height - UploadEditVideoActionSheetBarHeight + 1 : 10000
  const { ...props } = useSpring({
    duration: transitions.timings.sharp,
    transform:
      sheetState === 'open'
        ? `translateY(0)`
        : sheetState === 'closed'
        ? `translateY(${bounds.height}px)`
        : `translateY(${transform}px)`,
  })
  useEffect(() => {
    if (!!uploadVideoMatch && sheetState !== 'open') {
      setSheetState('open')
    }
  }, [uploadVideoMatch, sheetState])

  // forms state
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
    height: bounds.height,
    transform,
  })
  return (
    <Container ref={ref} role="dialog" style={{ ...props }}>
      <Topbar>
        <TabsContainer>
          tab 1
          <Button
            variant="tertiary"
            onClick={() => {
              navigate(routes.studio.index())
              setSheetState?.('open')
              console.log('open')
            }}
          >
            +
          </Button>
        </TabsContainer>
        <ButtonsContainer>
          <Button
            variant="tertiary"
            onClick={() => {
              if (sheetState === 'open') {
                setSheetState?.('minimized')
                navigate(routes.studio.index())
                console.log('minimize')
              } else {
                setSheetState?.('open')
                navigate(routes.studio.uploadVideo())
                console.log('minimize')
              }
            }}
          >
            -
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              navigate(routes.studio.index())
              setSheetState?.('closed')
              console.log('close')
            }}
          >
            x
          </Button>
        </ButtonsContainer>
      </Topbar>
      <Content>
        <div>
          <MultiFileSelect
            files={files}
            error={fileSelectError}
            onError={setFileSelectError}
            onDropRejected={handleFileRejections}
            onChangeFiles={setFiles}
            croppedImageUrl={croppedImageUrl}
            onCropImage={setCroppedImageUrl}
          />
        </div>
        <FormContainer>
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
            maxLength={20}
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
          <FormField title="Video Language">
            <Controller
              name="selectedVideoLanguage"
              control={control}
              rules={requiredValidation('Video language')}
              render={({ value }) => (
                <Select
                  items={items}
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
                  items={items}
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
  overflow: auto;
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--upload-video-action-sheet-bar-height);
  border-bottom: solid 1px ${colors.gray[700]};
`

const TabsContainer = styled.div``

const ButtonsContainer = styled.div`
  border-left: solid 1px ${colors.gray[700]};
`

const Content = styled.div`
  display: grid;
  grid-gap: ${sizes(12)};
  grid-template-columns: 1fr 1fr;
  padding: ${sizes(8)};
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

const FormContainer = styled.div`
  overflow-y: auto;
`
