import { FC, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'

import { License } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionChevronB, SvgActionChevronT, SvgActionTrash, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button, TextButton } from '@/components/_buttons/Button'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { SubtitlesCombobox } from '@/components/_inputs/SubtitlesComboBox'
import { TextArea } from '@/components/_inputs/TextArea'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import knownLicenses from '@/data/knownLicenses.json'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'
import { useVideoForm } from '@/hooks/useVideoForm'
import { useSnackbar } from '@/providers/snackbars'
import {
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { pastDateValidation, requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'
import { convertSrtToVtt } from '@/utils/subtitles'
import { useVideoFormDraft } from '@/views/studio/VideoWorkspace/VideoForm/VideoForm.hooks'

import {
  Divider,
  FileValidationBanner,
  FormWrapper,
  InputsContainer,
  MoreSettingsSection,
  StyledMultiFileSelect,
  StyledSvgAlertsInformative24,
  StyledTitleArea,
} from './VideoForm.styles'

const CUSTOM_LICENSE_CODE = 1000
const JOYSTREAM_LICENSE_CODE = 1009
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 84
const knownLicensesOptions: SelectItem<License['code']>[] = knownLicenses.map((license) => ({
  name: license.name,
  value: license.code,
  caption: license.longName,
  nodeStart: (
    <Information
      multiline
      headerText={license.longName}
      text={license.description}
      placement="top-end"
      offsetX={6}
      offsetY={12}
    />
  ),
}))

type VideoFormProps = {
  onSubmit: (data: VideoFormData) => Promise<void>
  setFormStatus: (data: VideoWorkspaceFormStatus | null) => void
}

export const VideoForm: FC<VideoFormProps> = memo(({ onSubmit, setFormStatus }) => {
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const [cachedEditedVideoId, setCachedEditedVideoId] = useState('')
  const [titleTooltipVisible, setTitleTooltipVisible] = useState(true)
  const assetErrorBanner = useRef<HTMLDivElement>(null)
  const { displaySnackbar } = useSnackbar()

  const { editedVideoInfo } = useVideoWorkspace()
  const { tabData, loading: tabDataLoading, error: tabDataError } = useVideoWorkspaceData()

  const deleteVideo = useDeleteVideo()
  const isEdit = !editedVideoInfo?.isDraft
  const mintNft = editedVideoInfo?.mintNft

  const form = useForm<VideoWorkspaceVideoFormFields>({
    shouldFocusError: true,
  })
  const {
    register,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = form

  const {
    formStatus,
    videoFormAssets: { handleVideoFileChange, handleThumbnailFileChange, files },
  } = useVideoForm({ id: editedVideoInfo.id, isEdit: !editedVideoInfo?.isDraft, onSubmit, form })
  const { flushDraftSave } = useVideoFormDraft(watch, dirtyFields)

  const videoFieldsLocked = tabData?.mintNft && isEdit

  // reset form whenever edited video gets updated
  useEffect(() => {
    if (editedVideoInfo.id === cachedEditedVideoId || !tabData || tabDataLoading) {
      return
    }
    setCachedEditedVideoId(editedVideoInfo.id)
    reset(tabData)
  }, [tabData, tabDataLoading, reset, mintNft, editedVideoInfo.id, cachedEditedVideoId, setValue])

  // sent updates on form status to VideoWorkspace
  useEffect(() => {
    setFormStatus({
      ...formStatus,
      triggerFormSubmit: () => {
        flushDraftSave()
        formStatus.triggerFormSubmit()
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flushDraftSave, JSON.stringify(formStatus), setFormStatus])

  useLayoutEffect(() => {
    if (errors.assets && assetErrorBanner.current) {
      assetErrorBanner.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.assets])

  const handleDeleteVideo = () => {
    editedVideoInfo && deleteVideo(editedVideoInfo.id)
  }

  const categoriesSelectItems: SelectItem[] =
    displayCategories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.defaultVideoCategory,
    })) || []

  const getHiddenSectionLabel = () => {
    if (videoFieldsLocked) {
      return `${moreSettingsVisible ? 'Hide' : 'Show'} locked options`
    }
    return `Show ${moreSettingsVisible ? 'less' : 'more'} options`
  }

  if (tabDataError) {
    return <ViewErrorFallback />
  }

  const videoEditFields = (
    <>
      <FormField optional label="Description" error={errors.description?.message}>
        <TextArea
          counter
          {...register('description', {
            maxLength: {
              value: 5000,
              message: 'Enter a valid description.',
            },
          })}
          maxLength={5000}
          placeholder="Description of the video to share with your audience"
          error={!!errors.description}
          disabled={videoFieldsLocked}
        />
      </FormField>
      <FormField label="Category" error={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Select a video category.',
            },
          }}
          render={({ field: { value, onChange, ref } }) => (
            <Select
              containerRef={ref}
              value={value}
              items={categoriesSelectItems}
              onChange={onChange}
              error={!!errors.category && !value}
              disabled={videoFieldsLocked}
            />
          )}
        />
      </FormField>
      <FormField label="Language" error={errors.language?.message}>
        <Controller
          name="language"
          control={control}
          rules={requiredValidation('Video language')}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              items={[
                { name: 'TOP LANGUAGES', value: '', isSeparator: true },
                ...atlasConfig.derived.popularLanguagesSelectValues,
                { name: 'ALL LANGUAGES', value: '', isSeparator: true },
                ...atlasConfig.derived.languagesSelectValues,
              ]}
              onChange={onChange}
              error={!!errors.language && !value}
              disabled={videoFieldsLocked}
            />
          )}
        />
      </FormField>
      <FormField label="Visibility">
        <Controller
          name="isPublic"
          control={control}
          defaultValue={true}
          rules={{
            validate: (value) => value !== null,
          }}
          render={({ field: { value, onChange } }) => (
            <OptionCardGroupRadio
              selectedValue={value}
              disabled={videoFieldsLocked}
              onChange={(value) => onChange(value)}
              options={[
                {
                  label: 'Public',
                  caption: 'Everyone can watch your video.',
                  value: true,
                },
                {
                  label: 'Unlisted',
                  caption: 'Anyone with the link can watch your video.',
                  value: false,
                },
              ]}
            />
          )}
        />
      </FormField>
    </>
  )

  return (
    <FormWrapper as="form">
      <Controller
        name="assets"
        control={control}
        rules={{
          validate: (value) => {
            if (!value) return false

            if (!!value.video.id && !!value.thumbnail.cropId) {
              return true
            }
            if (!value.video.id) {
              return 'Select video file'
            }
            if (!value.thumbnail.cropId) {
              return 'Select image file'
            }
          },
        }}
        render={() => (
          // don't remove this div
          // without this element position sticky won't work
          <div>
            {errors.assets && (
              <div ref={assetErrorBanner}>
                <FileValidationBanner
                  icon={<SvgAlertsWarning24 width={24} height={24} />}
                  description={
                    <Text as="span" variant="t200">
                      {(errors?.assets as FieldError)?.message}
                    </Text>
                  }
                />
              </div>
            )}
            <StyledMultiFileSelect
              files={files}
              onVideoChange={handleVideoFileChange}
              onThumbnailChange={handleThumbnailFileChange}
              editMode={isEdit}
              disabled={videoFieldsLocked}
              maxVideoSize={10 * 1024 * 1024 * 1024}
            />
          </div>
        )}
      />
      <InputsContainer>
        <Controller
          name="title"
          control={control}
          rules={{
            maxLength: {
              value: MAX_TITLE_LENGTH,
              message: 'Enter a valid video title.',
            },
            minLength: {
              value: MIN_TITLE_LENGTH,
              message: 'Enter a valid video title.',
            },
            required: {
              value: true,
              message: 'Enter a video title.',
            },
          }}
          render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
            return (
              <Tooltip text="Click to edit" placement="top-start" hidden={!titleTooltipVisible || videoFieldsLocked}>
                <FormField error={error?.message}>
                  <StyledTitleArea
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    min={MIN_TITLE_LENGTH}
                    max={MAX_TITLE_LENGTH}
                    placeholder="Enter video title"
                    disabled={videoFieldsLocked}
                    error={!!error}
                    onFocus={() => setTitleTooltipVisible(false)}
                    onBlur={() => setTitleTooltipVisible(true)}
                  />
                </FormField>
              </Tooltip>
            )
          }}
        />
        {videoFieldsLocked && (
          <Banner
            icon={<StyledSvgAlertsInformative24 />}
            title="There's an NFT for this video"
            description="You can't edit or delete this video, having minted an NFT for it."
          />
        )}
        {!videoFieldsLocked && videoEditFields}
        <Divider />
        <div>
          <TextButton
            size="large"
            iconPlacement="right"
            icon={moreSettingsVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
            onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
          >
            {getHiddenSectionLabel()}
          </TextButton>
          <Text as="p" variant="t200" color="colorText" margin={{ top: 2 }}>
            {!videoFieldsLocked
              ? `Subtitles, license, comments, mature content, paid promotion, published date${
                  isEdit ? ', delete video' : ''
                }`
              : 'Subtitles, royalties, description, category, language, visibility, subtitles, license, comments, mature content, paid promotion, published date'}
          </Text>
        </div>
        <MoreSettingsSection expanded={moreSettingsVisible}>
          <Controller
            control={control}
            name="subtitlesArray"
            rules={{
              validate: (value) => {
                const languageWithoutFile = value?.find((language) => !language.file && !language.asset)
                return value && languageWithoutFile ? 'Provide a file for every new subtitles language.' : true
              },
            }}
            render={({ field: { onChange, value: subtitlesArray } }) => {
              return (
                <FormField label="Subtitles" optional error={(errors?.subtitlesArray as FieldError)?.message}>
                  <SubtitlesCombobox
                    disabled={videoFieldsLocked}
                    error={!!errors?.subtitlesArray}
                    onLanguageAdd={(subtitlesLanguage) => {
                      onChange([...(subtitlesArray ? subtitlesArray : []), { ...subtitlesLanguage }])
                    }}
                    onLanguageDelete={(subtitlesLanguage) => {
                      onChange(
                        subtitlesArray?.filter(
                          (prevSubtitles) =>
                            !(
                              prevSubtitles.languageIso === subtitlesLanguage.languageIso &&
                              prevSubtitles.type === subtitlesLanguage.type
                            )
                        )
                      )
                    }}
                    onSubtitlesAdd={async ({ languageIso, file, type }) => {
                      const isSrt = file && file?.name.match(/\.srt$/)
                      let newFile = file
                      if (isSrt) {
                        try {
                          newFile = await convertSrtToVtt(file)
                        } catch (error) {
                          displaySnackbar({
                            title: 'Something went wrong',
                            description:
                              'There was a problem with processing subtitles file. Try again or select different file.',
                            iconType: 'error',
                          })
                          return
                        }
                      }
                      onChange(
                        subtitlesArray?.map((subtitles) =>
                          subtitles.languageIso === languageIso && subtitles.type === type
                            ? { ...subtitles, file: newFile, isUploadedAsSrt: isSrt }
                            : subtitles
                        )
                      )
                    }}
                    languagesIso={atlasConfig.content.languages.map(({ isoCode }) => isoCode)}
                    popularLanguagesIso={atlasConfig.content.popularLanguages}
                    subtitlesArray={subtitlesArray}
                  />
                </FormField>
              )
            }}
          />

          {videoFieldsLocked && videoEditFields}
          <Controller
            name="licenseCode"
            defaultValue={JOYSTREAM_LICENSE_CODE}
            control={control}
            rules={requiredValidation('License')}
            render={({ field: { value, onChange, ref } }) => (
              <FormField label="License" error={errors.licenseCode?.message}>
                <Select
                  containerRef={ref}
                  value={value}
                  items={knownLicensesOptions}
                  placeholder="Choose license type"
                  onChange={onChange}
                  error={!!errors.licenseCode && !value}
                  disabled={videoFieldsLocked}
                />
              </FormField>
            )}
          />
          {knownLicenses.find((license) => license.code === watch('licenseCode'))?.attributionRequired && (
            <FormField label="License attribution" error={errors.licenseAttribution?.message} optional>
              <Input
                {...register(
                  'licenseAttribution',
                  textFieldValidation({ name: 'License attribution', maxLength: 5000 })
                )}
                placeholder="Type your attribution here"
                error={!!errors.licenseAttribution}
                disabled={videoFieldsLocked}
              />
            </FormField>
          )}

          {watch('licenseCode') === CUSTOM_LICENSE_CODE && (
            <FormField label="Custom license" error={errors.licenseCustomText?.message}>
              <TextArea
                {...register('licenseCustomText', {
                  maxLength: {
                    value: 5000,
                    message: 'Enter a valid custom license.',
                  },
                  required: {
                    value: true,
                    message: 'Provide a custom license.',
                  },
                })}
                maxLength={5000}
                placeholder="Describe your custom license"
                error={!!errors.licenseCustomText}
              />
            </FormField>
          )}
          <FormField
            label="Comments"
            description="Disabling the comments section does not allow for posting new comments under this video and hides any existing comments made in the past."
          >
            <Controller
              name="enableComments"
              control={control}
              defaultValue={true}
              rules={{
                validate: (value) => value !== null,
              }}
              render={({ field: { value, onChange, ref } }) => (
                <RadioButtonGroup
                  ref={ref}
                  options={[
                    { label: 'Enable comments', value: true },
                    { label: 'Disable comments', value: false },
                  ]}
                  error={!!errors.isExplicit}
                  onChange={(event) => onChange(event.target.value)}
                  value={value}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField label="Mature content">
            <Controller
              name="isExplicit"
              control={control}
              defaultValue={false}
              rules={{
                validate: (value) => value !== null,
              }}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value ?? false}
                  label="My video contains mature content such as sex, violence, etc."
                  onChange={onChange}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField label="Paid promotion">
            <Controller
              name="hasMarketing"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value ?? false}
                  label="My video contains paid promotion content."
                  onChange={onChange}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          <FormField
            label="Published before"
            error={errors.publishedBeforeJoystream ? 'Enter a valid date.' : ''}
            optional
            description="If you are reuploading content that you already published in the past on another platform you can enter the original publish date below."
          >
            <Controller
              name="publishedBeforeJoystream"
              control={control}
              rules={{
                validate: (value) => {
                  return pastDateValidation(value)
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Datepicker
                  value={value}
                  onChange={onChange}
                  error={!!errors.publishedBeforeJoystream}
                  disabled={videoFieldsLocked}
                />
              )}
            />
          </FormField>
          {isEdit && !videoFieldsLocked && (
            <Button
              fullWidth
              size="large"
              variant="destructive-secondary"
              icon={<SvgActionTrash />}
              onClick={handleDeleteVideo}
            >
              Delete video
            </Button>
          )}
        </MoreSettingsSection>
      </InputsContainer>
    </FormWrapper>
  )
})

VideoForm.displayName = 'VideoForm'
