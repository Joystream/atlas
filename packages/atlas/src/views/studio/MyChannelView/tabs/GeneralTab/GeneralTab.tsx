import { RefObject } from 'react'
import { Controller, FieldError } from 'react-hook-form'

import { useFullChannel } from '@/api/hooks/channel'
import { ActionBar } from '@/components/ActionBar'
import { Portal } from '@/components/Portal'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { FormField } from '@/components/_inputs/FormField'
import { TextInput } from '@/components/_inputs/Input/Input.styles'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal } from '@/components/_overlays/ImageCropModal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'
import { atlasConfig } from '@/config'
import { useChannelForm } from '@/hooks/useChannelForm'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { requiredValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'
import { StyledAvatar } from '@/views/studio/CreateEditChannelView/CreateEditChannelView.styles'

import { InputsWrapper } from './GeneralTab.styles'

const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

export const GeneralTab = ({ actionBarPortal }: { actionBarPortal: RefObject<HTMLDivElement> }) => {
  const { channelId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const smMatch = useMediaMatch('sm')
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

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
    hideActionBar,
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

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <form>
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
                    assetUrl={loading ? null : value.croppedUrl || value.originalUrl}
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
                    assetUrl={loading ? null : value.croppedUrl || value.originalUrl}
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
              <TextArea {...register('description')} />
            </FormField>
          </InputsWrapper>
        </EntitySettingTemplate>
        <EntitySettingTemplate
          title="Channel settings"
          description="Reach the right audience by selecting the channel settings that work best for you."
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
      </form>
      {!hideActionBar && (
        <Portal containerRef={actionBarPortal}>
          <ActionBar
            fee={fee}
            feeLoading={feeLoading}
            primaryButton={{
              text: 'Publish changes',
              onClick: handleSubmit,
            }}
            secondaryButton={
              isDirty && nodeConnectionStatus === 'connected'
                ? {
                    text: 'Cancel',
                    onClick: () => reset(),
                  }
                : undefined
            }
            skipFeeCheck
          />
        </Portal>
      )}
    </>
  )
}
