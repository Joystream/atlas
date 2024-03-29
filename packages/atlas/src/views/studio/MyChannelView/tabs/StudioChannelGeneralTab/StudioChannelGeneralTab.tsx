import BN from 'bn.js'
import { ReactNode, RefObject, useCallback, useEffect } from 'react'
import { Controller, FieldError } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgActionShow } from '@/assets/icons'
import { ActionBar } from '@/components/ActionBar'
import { Portal } from '@/components/Portal'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { FormField } from '@/components/_inputs/FormField'
import { TextInput } from '@/components/_inputs/Input/Input.styles'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal } from '@/components/_overlays/ImageCropModal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useChannelForm } from '@/hooks/useChannelForm'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { requiredValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'

import { InputsWrapper, StyledAvatar, StyledButton, StyledForm } from './StudioChannelGeneralTab.styles'

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

type StudioChannelGeneralTabProps = {
  actionBarPortal: RefObject<HTMLDivElement>
  setTrailingContent: (content: ReactNode) => void
}

export const StudioChannelGeneralTab = ({ actionBarPortal, setTrailingContent }: StudioChannelGeneralTabProps) => {
  const { channelId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const xsMatch = useMediaMatch('xs')
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const navigate = useNavigate()
  const {
    channel,
    loading,
    error,
    refetch: refetchChannel,
  } = useFullChannel(
    channelId || '',
    {
      skip: !channelId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch channel', 'CreateEditChannelView', error, {
          channel: { id: channelId },
        }),
    },
    { where: { channel: { isPublic_eq: undefined, isCensored_eq: undefined } } }
  )
  const {
    feeLoading,
    form,
    hasCoverUploadFailed,
    hasAvatarUploadFailed,
    fee,
    actions: { handleDeleteAvatar, handleAvatarChange, handleDeleteCover, handleCoverChange, handleSubmit },
    refs: { coverDialogRef, avatarDialogRef },
  } = useChannelForm({ type: 'edit', refetchChannel, channel })
  const {
    register,
    control,
    reset,
    formState: { errors, isDirty },
  } = form
  const [openDialog, closeDialog] = useConfirmationModal({
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you change the tab. Are you sure you want to continue?',
    type: 'warning',
    primaryButton: {
      text: 'Discard changes',
      onClick: () => {
        closeDialog()
        reset()
        displaySnackbar({
          title: 'All changes were discarded',
          iconType: 'info',
        })
      },
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeDialog(),
    },
  })

  const onViewChannel = useCallback(() => {
    if (isDirty) {
      openDialog()
    } else {
      navigate(absoluteRoutes.viewer.channel(channelId ?? ''))
    }
  }, [channelId, isDirty, navigate, openDialog])

  useEffect(() => {
    if (channelId && xsMatch) {
      setTrailingContent(
        <Button variant="secondary" onClick={onViewChannel} icon={<SvgActionShow />}>
          View channel
        </Button>
      )
    }
  }, [channelId, onViewChannel, setTrailingContent, xsMatch])

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <StyledForm>
        {!xsMatch && channelId && (
          <StyledButton fullWidth variant="secondary" onClick={onViewChannel} icon={<SvgActionShow />}>
            View channel
          </StyledButton>
        )}
        <EntitySettingTemplate
          title="Channel branding"
          description="Show your followers what your channel is about with customized avatar, cover & description."
        >
          <InputsWrapper>
            <FormField label="Channel name">
              <TextInput inputSize="large" {...register('title')} />
            </FormField>

            <Controller
              name="avatar"
              control={control}
              render={({ field: { value } }) => (
                <FormField label="Channel avatar" description="Max file size is 5MB.">
                  <StyledAvatar
                    assetUrls={
                      loading
                        ? null
                        : value.croppedUrl || value.originalUrl
                        ? ([value.croppedUrl || value.originalUrl] as string[])
                        : []
                    }
                    hasAvatarUploadFailed={hasAvatarUploadFailed}
                    size={88}
                    onClick={() => {
                      avatarDialogRef.current?.open(
                        value.originalBlob,
                        value.imageCropData || undefined,
                        !!value.originalBlob
                      )
                    }}
                    editable
                    loading={loading}
                  />
                  <ImageCropModal
                    imageType="avatar"
                    onConfirm={handleAvatarChange}
                    onError={() =>
                      displaySnackbar({
                        title: 'Cannot load the image. Please choose another one.',
                        iconType: 'error',
                      })
                    }
                    ref={avatarDialogRef}
                    onDelete={handleDeleteAvatar}
                  />
                </FormField>
              )}
            />

            <Controller
              name="cover"
              control={control}
              render={({ field: { value } }) => (
                <FormField label="Channel cover" description="Max file size is 5MB. Recommended image ratio is 16:9.">
                  <ChannelCover
                    assetUrls={
                      loading
                        ? null
                        : value.croppedUrl || value.originalUrl
                        ? ([value.croppedUrl || value.originalUrl] as string[])
                        : []
                    }
                    hasCoverUploadFailed={hasCoverUploadFailed}
                    onCoverEditClick={() => {
                      coverDialogRef.current?.open(
                        value.originalBlob,
                        value.imageCropData || undefined,
                        !!value.originalBlob
                      )
                    }}
                    editable
                    disabled={loading}
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
                </FormField>
              )}
            />
            <FormField label="Channel description">
              <TextArea
                {...register('description')}
                placeholder="Description of your channel to share with the audience..."
              />
            </FormField>
          </InputsWrapper>
        </EntitySettingTemplate>
        <EntitySettingTemplate
          title="Channel settings"
          description="Reach the right audience by selecting the channel settings that work best for you."
          isLast
        >
          <InputsWrapper>
            <Controller
              name="language"
              control={control}
              rules={requiredValidation('Language')}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Language"
                  description="Main language of the content you publish on your channel"
                  error={(errors.language as FieldError)?.message}
                >
                  <Select
                    items={[
                      { name: 'TOP LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.popularLanguagesSelectValues,
                      { name: 'ALL LANGUAGES', value: '', isSeparator: true },
                      ...atlasConfig.derived.languagesSelectValues,
                    ]}
                    disabled={loading}
                    value={value}
                    error={!!errors.language && !value}
                    onChange={onChange}
                  />
                </FormField>
              )}
            />

            <Controller
              name="isPublic"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Privacy"
                  description="Privacy of your channel. Please note that because of nature of the blockchain, even unlisted channels can be publicly visible by querying the blockchain data."
                  error={(errors.isPublic as FieldError)?.message}
                >
                  <Select
                    items={PUBLIC_SELECT_ITEMS}
                    disabled={loading}
                    value={value}
                    onChange={onChange}
                    error={!!errors.isPublic && !value}
                  />
                </FormField>
              )}
            />
          </InputsWrapper>
        </EntitySettingTemplate>
      </StyledForm>
      <Portal containerRef={actionBarPortal}>
        <ActionBar
          fee={isDirty ? fee : new BN(0)}
          feeLoading={feeLoading}
          primaryButton={{
            text: 'Publish changes',
            disabled: !isDirty,
            onClick: () =>
              isDirty
                ? handleSubmit(() => {
                    displaySnackbar({
                      title: 'All changes are saved',
                      iconType: 'success',
                    })
                  })
                : undefined,
          }}
          secondaryButton={{
            text: 'Cancel',
            onClick: () => openDialog(),
            disabled: !isDirty || nodeConnectionStatus !== 'connected',
          }}
          skipFeeCheck
        />
      </Portal>
    </>
  )
}
