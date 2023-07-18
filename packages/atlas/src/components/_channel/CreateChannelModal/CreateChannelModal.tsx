import styled from '@emotion/styled'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { ImageCropModal } from '@/components/_overlays/ImageCropModal'
import { absoluteRoutes } from '@/config/routes'
import { useChannelForm } from '@/hooks/useChannelForm'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { media, sizes } from '@/styles'

export const CreateChannelModal = () => {
  const { displaySnackbar } = useSnackbar()
  const {
    authModalOpenName,
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const navigate = useNavigate()
  const { setActiveChannel } = useUser()
  const { refs, actions, form, hasAvatarUploadFailed } = useChannelForm({ type: 'new' })
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const { avatarDialogRef } = refs
  const { handleSubmit, handleAvatarChange, handleDeleteAvatar } = actions

  return (
    <DialogModal
      primaryButton={{
        text: 'Create channel',
        onClick: () =>
          handleSubmit((channelId) => {
            setActiveChannel(channelId)
            navigate(absoluteRoutes.viewer.channel(channelId))
            setAuthModalOpenName(undefined)
          }),
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => setAuthModalOpenName(undefined),
      }}
      show={authModalOpenName === 'createChannel'}
      noContentPadding
      additionalActionsNodeMobilePosition="bottom"
    >
      <PaddingBox>
        <AuthenticationModalStepTemplate
          darkBackground
          hasNavigatedBack={false}
          title="Create channel"
          backgroundImage={watch('avatar')?.croppedUrl || undefined}
          subtitle={
            <Description as="p" variant="t200" color="colorText">
              Publish your videos and sell them as NFTs with your own channel.
            </Description>
          }
          formNode={
            <FormContainer>
              <Controller
                name="avatar"
                control={control}
                render={({ field: { value } }) => (
                  <>
                    <StyledAvatar
                      assetUrls={
                        value.croppedUrl || value.originalUrl
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
              <FormField
                label="Channel name"
                description="This is the name of your channel which will be displayed for your viewers."
                error={errors.title?.message}
              >
                <Input {...register('title')} placeholder="Channel name" error={!!errors.title} autoComplete="off" />
              </FormField>
            </FormContainer>
          }
        />
      </PaddingBox>
    </DialogModal>
  )
}

const Description = styled(Text)`
  margin-bottom: 44px;
`

const FormContainer = styled.div`
  position: relative;
  padding-top: ${sizes(17)};
  display: grid;
  gap: ${sizes(6)};
`
const StyledAvatar = styled(Avatar)`
  position: absolute;
  transform: translateY(-50%);
  top: 0;
`
const PaddingBox = styled.div`
  padding: ${sizes(4)};

  ${media.sm} {
    padding: ${sizes(6)};
  }
`
