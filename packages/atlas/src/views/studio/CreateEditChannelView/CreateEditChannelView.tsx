import { FC } from 'react'
import { Controller, FieldError } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { ActionBar } from '@/components/ActionBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tooltip } from '@/components/Tooltip'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { FormField } from '@/components/_inputs/FormField'
import { Select } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { ConnectWithYtModal } from '@/components/_overlays/ConnectWithYtModal'
import { ImageCropModal } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { PUBLIC_SELECT_ITEMS, useChannelForm } from '@/hooks/useChannelForm'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { transitions } from '@/styles'
import { requiredValidation, textFieldValidation } from '@/utils/formValidationOptions'

import {
  ActionBarTransactionWrapper,
  InnerFormContainer,
  StyledAvatar,
  StyledProgressDrawer,
  StyledTitleSection,
  TitleContainer,
} from './CreateEditChannelView.styles'

type CreateEditChannelViewProps = {
  newChannel?: boolean
}

export const CreateEditChannelView: FC<CreateEditChannelViewProps> = ({ newChannel }) => {
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })
  const smMatch = useMediaMatch('sm')
  const headTags = useHeadTags(newChannel ? 'New channel' : 'Edit channel')

  const setShouldContinueYppFlow = useYppStore((store) => store.actions.setShouldContinueYppFlow)

  const {
    form,
    hasCoverUploadFailed,
    hasAvatarUploadFailed,
    showConnectToYtDialog,
    isWorkspaceOpen,
    feeLoading,
    fee,
    actions: { handleDeleteAvatar, handleAvatarChange, handleDeleteCover, handleCoverChange, handleSubmit },
    refs: { coverDialogRef, avatarDialogRef },
  } = useChannelForm({ type: 'new' })
  const {
    register,
    control,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
    setFocus,
  } = form
  const avatarContentId = watch('avatar').contentId
  const coverContentId = watch('cover').contentId
  const progressDrawerSteps = [
    {
      title: 'Add channel title',
      completed: !!dirtyFields.title,
      onClick: () => setFocus('title'),
      required: true,
    },
    {
      title: 'Add description',
      completed: !!dirtyFields.description,
      onClick: () => setFocus('description'),
    },
    {
      title: 'Add avatar image',
      completed: !!(dirtyFields.avatar && avatarContentId),
      onClick: () => avatarDialogRef.current?.open(),
    },
    {
      title: 'Add cover image',
      completed: !!(dirtyFields.cover && coverContentId),
      onClick: () => coverDialogRef.current?.open(),
    },
  ]

  const isDisabled = !isDirty || nodeConnectionStatus !== 'connected'

  return (
    <>
      {headTags}
      <ConnectWithYtModal
        show={showConnectToYtDialog}
        onSignUp={() => {
          setShouldContinueYppFlow(true)
          navigate(absoluteRoutes.studio.ypp())
        }}
        onClose={() => navigate(absoluteRoutes.studio.videos())}
      />
      <form onSubmit={(event) => event.preventDefault()}>
        <Controller
          name="cover"
          control={control}
          render={({ field: { value } }) => (
            <>
              <ChannelCover
                assetUrl={value.croppedUrl || value.originalUrl}
                hasCoverUploadFailed={hasCoverUploadFailed}
                onCoverEditClick={() => {
                  coverDialogRef.current?.open(
                    value.originalBlob,
                    value.imageCropData || undefined,
                    !!value.originalBlob
                  )
                }}
                editable
              />
              <ImageCropModal
                imageType="cover"
                onConfirm={handleCoverChange}
                onDelete={handleDeleteCover}
                onError={() =>
                  displaySnackbar({
                    title: 'Cannot load the image. Choose another.',
                    iconType: 'error',
                  })
                }
                ref={coverDialogRef}
              />
            </>
          )}
        />
        <StyledTitleSection className={transitions.names.slide}>
          <Controller
            name="avatar"
            control={control}
            render={({ field: { value } }) => (
              <>
                <StyledAvatar
                  assetUrl={value.croppedUrl || value.originalUrl}
                  hasAvatarUploadFailed={hasAvatarUploadFailed}
                  size={smMatch ? 136 : 88}
                  onClick={() => {
                    avatarDialogRef.current?.open(
                      value.originalBlob,
                      value.imageCropData || undefined,
                      !!value.originalBlob
                    )
                  }}
                  editable
                />
                <ImageCropModal
                  imageType="avatar"
                  onConfirm={handleAvatarChange}
                  onError={() =>
                    displaySnackbar({
                      title: 'Cannot load the image. Choose another.',
                      iconType: 'error',
                    })
                  }
                  ref={avatarDialogRef}
                  onDelete={handleDeleteAvatar}
                />
              </>
            )}
          />

          <TitleContainer>
            <Controller
              name="title"
              control={control}
              rules={textFieldValidation({ name: 'Channel name', minLength: 3, maxLength: 40, required: true })}
              render={({ field: { value, onChange, ref } }) => (
                <FormField error={errors.title?.message}>
                  <Tooltip text="Click to edit channel title" placement="top-start">
                    <TitleInput
                      ref={ref}
                      min={3}
                      max={40}
                      placeholder="Channel title"
                      value={value}
                      onChange={onChange}
                      error={!!errors.title}
                    />
                  </Tooltip>
                </FormField>
              )}
            />
          </TitleContainer>
        </StyledTitleSection>
        <LimitedWidthContainer>
          <InnerFormContainer actionBarHeight={actionBarBoundsHeight}>
            <FormField label="Description" error={errors.description?.message}>
              <Tooltip text="Click to edit channel description">
                <TextArea
                  placeholder="Description of your channel to share with your audience"
                  rows={8}
                  {...register(
                    'description',
                    textFieldValidation({ name: 'Description', minLength: 3, maxLength: 1000 })
                  )}
                  maxLength={1000}
                  error={!!errors.description}
                />
              </Tooltip>
            </FormField>
            <FormField
              label="Language"
              description="Main language of the content you publish on your channel"
              error={(errors.language as FieldError)?.message}
            >
              <Controller
                name="language"
                control={control}
                rules={requiredValidation('Language')}
                render={({ field: { value, onChange } }) => (
                  <Select
                    items={[
                      { name: 'TOP LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.popularLanguagesSelectValues,
                      { name: 'ALL LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.languagesSelectValues,
                    ]}
                    value={value}
                    error={!!errors.language && !value}
                    onChange={onChange}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Privacy"
              description="Privacy of your channel. Please note that because of nature of the blockchain, even unlisted channels can be publicly visible by querying the blockchain data."
              error={(errors.isPublic as FieldError)?.message}
            >
              <Controller
                name="isPublic"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    items={PUBLIC_SELECT_ITEMS}
                    value={value}
                    onChange={onChange}
                    error={!!errors.isPublic && !value}
                  />
                )}
              />
            </FormField>
            <CSSTransition
              in={!isWorkspaceOpen}
              timeout={2 * parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
              unmountOnExit
            >
              <ActionBarTransactionWrapper ref={actionBarRef}>
                {progressDrawerSteps?.length ? <StyledProgressDrawer steps={progressDrawerSteps} /> : null}
                <ActionBar
                  fee={fee}
                  feeLoading={feeLoading}
                  primaryButton={{
                    text: newChannel ? 'Create channel' : 'Publish changes',
                    disabled: isDisabled,
                    onClick: handleSubmit,
                  }}
                  secondaryButton={
                    !newChannel && isDirty && nodeConnectionStatus === 'connected'
                      ? {
                          text: 'Cancel',
                          onClick: () => reset(),
                        }
                      : undefined
                  }
                  skipFeeCheck
                />
              </ActionBarTransactionWrapper>
            </CSSTransition>
          </InnerFormContainer>
        </LimitedWidthContainer>
      </form>
    </>
  )
}
