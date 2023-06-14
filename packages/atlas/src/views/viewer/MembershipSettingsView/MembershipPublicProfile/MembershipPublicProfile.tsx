import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import {
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries/__generated__/memberships.generated'
import { SvgActionCheck } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { MemberInputMetadata } from '@/joystream-lib/types'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger } from '@/utils/logs'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './MembershipPublicProfile.styles'

export type EditMemberFormInputs = {
  handle: string | null
  avatar: ImageInputFile | null
  about: string | null
}

export const MembershipPublicProfile: FC = () => {
  const navigate = useNavigate()
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)
  const [isHandleValidating, setIsHandleValidating] = useState(false)
  const { memberId, activeMembership, isLoggedIn, refetchUserMemberships } = useUser()

  const [openDialog, closeDialog] = useConfirmationModal({
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you change the tab. Are you sure you want to continue?',
    type: 'warning',
    primaryButton: {
      text: 'Discard changes',
      to: absoluteRoutes.viewer.member(activeMembership?.handle),
      onClick: () => closeDialog(),
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeDialog(),
    },
  })
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const { displaySnackbar } = useSnackbar()
  const { mutateAsync: avatarMutation } = useMutation('edit-avatar-post', (croppedBlob: Blob) =>
    uploadAvatarImage(croppedBlob)
  )

  const client = useApolloClient()

  const validateUserHandle = useCallback(
    async (value: string | null, prevValue?: string) => {
      if ((prevValue != null && value === prevValue) || !value) {
        return true
      }
      const {
        data: { memberships },
      } = await client.query<GetMembershipsQuery, GetMembershipsQueryVariables>({
        query: GetMembershipsDocument,
        variables: { where: { handle_eq: value } },
      })

      return !memberships[0]
    },
    [client]
  )

  const {
    register,
    trigger,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<EditMemberFormInputs>({
    shouldFocusError: true,
    reValidateMode: 'onSubmit',
  })

  const resetForm = useCallback(async () => {
    let blob
    if (activeMembership?.metadata?.avatar?.__typename === 'AvatarUri' && activeMembership.metadata.avatar.avatarUri) {
      await fetch(activeMembership.metadata.avatar.avatarUri)
        .then((r) => r.blob())
        .then((createdBlob) => (blob = createdBlob))
        .catch((err) => ConsoleLogger.warn(`Cannot fetch avatar`, err))
    }
    reset(
      {
        handle: activeMembership?.handle,
        avatar:
          activeMembership?.metadata?.avatar?.__typename === 'AvatarUri'
            ? {
                url: activeMembership.metadata.avatar.avatarUri,
                blob: blob,
                originalBlob: blob,
              }
            : null,
        about: activeMembership?.metadata?.about || '',
      },
      {
        keepDirty: false,
      }
    )
  }, [activeMembership, reset])

  // reset the form whenever the active membership changes
  useEffect(() => {
    if (activeMembership) {
      resetForm()
    }
  }, [activeMembership, resetForm])

  const headTags = useHeadTags('Edit membership')

  const createMemberInputMetadata = useCallback(
    (data: EditMemberFormInputs) => {
      const metaData = {
        ...(dirtyFields.handle ? { name: data?.handle } : {}),
        ...(dirtyFields.about ? { about: data?.about } : {}),
        ...(dirtyFields.avatar ? { avatarUri: data?.avatar?.url } : {}),
      }
      return metaData
    },
    [dirtyFields.about, dirtyFields.avatar, dirtyFields.handle]
  )

  const metadata = createMemberInputMetadata(watch())
  const { fullFee: fee, loading: feeLoading } = useFee(
    'updateMemberTx',
    memberId ? [memberId, watch('handle'), metadata] : undefined
  )
  const handleEditMember = handleSubmit(async (data) => {
    if (!joystream || !activeMembership || !isDirty) {
      return
    }
    let fileUrl = ''
    if (data.avatar?.blob && dirtyFields.avatar) {
      try {
        fileUrl = await avatarMutation(data.avatar.blob)
      } catch (error) {
        displaySnackbar({
          title: 'Something went wrong',
          description: 'Avatar could not be uploaded. Try again later',
          iconType: 'error',
        })
        return
      }
    }

    const success = await handleTransaction({
      txFactory: async (updateStatus) => {
        const memberInputMetadata: MemberInputMetadata = {
          ...(dirtyFields.handle ? { name: data.handle } : {}),
          ...(dirtyFields.about ? { about: data.about } : {}),
          ...(dirtyFields.avatar ? { avatarUri: data.avatar === null ? '' : fileUrl } : {}),
        }
        return (await joystream.extrinsics).updateMember(
          activeMembership.id,
          dirtyFields.handle ? data.handle : null,
          memberInputMetadata,
          proxyCallback(updateStatus)
        )
      },
      snackbarSuccessMessage: {
        title: 'Profile updated successfully',
      },
    })
    const {
      data: { memberships },
    } = await refetchUserMemberships()
    const updatedMembership = memberships.find((m) => m.id === activeMembership.id)
    if (success) {
      navigate(absoluteRoutes.viewer.member(updatedMembership?.handle))
    }
  })

  const { ref, ...handleRest } = useMemo(
    () =>
      register('handle', {
        onChange: debouncePromise(
          async () => {
            await trigger('handle')
            setIsHandleValidating(false)
          },
          500,
          {
            key() {
              setIsHandleValidating(true)
              return null
            },
          }
        ),
        validate: {
          valid: (value) => (!value ? true : MEMBERSHIP_NAME_PATTERN.test(value) || 'Enter a valid member handle.'),
          unique: async (value) => {
            const isUnique = await validateUserHandle(value, activeMembership?.handle)
            return isUnique || 'This member handle is already in use.'
          },
        },
        required: { value: true, message: 'Member handle is required.' },
        minLength: { value: 5, message: 'Member handle must be at least 5 characters long.' },
      }),
    [activeMembership?.handle, register, trigger, validateUserHandle]
  )
  const isHandleInputActiveElement = document.activeElement === handleInputRef.current

  return (
    <EntitySettingTemplate
      title="Profile info"
      description="This membership information is stored on Joystream blockchain and can be displayed in all apps connected to the chain."
    >
      <form onSubmit={handleEditMember}>
        {headTags}
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange, value: avatarInputFile } }) => (
            <FormField label="Member avatar" description="Max file size is 5MB">
              <Avatar
                size={88}
                editable
                onClick={() => {
                  avatarDialogRef.current?.open(
                    avatarInputFile?.originalBlob ? avatarInputFile.originalBlob : avatarInputFile?.blob,
                    avatarInputFile?.imageCropData,
                    !!avatarInputFile?.blob
                  )
                }}
                onImageValidation={setIsImageValid}
                assetUrl={avatarInputFile?.url}
                loading={!isLoggedIn}
                hasAvatarUploadFailed={!isImageValid}
              />
              <ImageCropModal
                imageType="avatar"
                onConfirm={(blob, url, _, imageCropData, originalBlob) => {
                  onChange({
                    blob,
                    url,
                    imageCropData,
                    originalBlob,
                  })
                }}
                onDelete={() => {
                  onChange(null)
                }}
                ref={avatarDialogRef}
              />
            </FormField>
          )}
        />
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <TextFieldsWrapper>
            <FormField
              label="Member handle"
              disableErrorAnimation={isHandleInputActiveElement}
              description="Member handle may contain only lowercase letters, numbers and underscores"
              error={errors?.handle?.message}
            >
              <Input
                autoComplete="off"
                {...handleRest}
                ref={(e) => {
                  ref(e)
                  handleInputRef.current = e
                }}
                processing={isHandleValidating}
                placeholder="johnnysmith"
                error={!!errors?.handle}
              />
            </FormField>
            <FormField label="About me" optional error={errors?.about?.message}>
              <TextArea
                placeholder="Write something about yourself..."
                maxLength={1000}
                {...register('about', {
                  maxLength: { value: 1000, message: 'About cannot be longer than 1000 characters' },
                })}
                error={!!errors?.about}
              />
            </FormField>
          </TextFieldsWrapper>
        </Wrapper>
        <StyledActionBar
          ref={actionBarRef}
          fee={fee}
          feeLoading={feeLoading}
          primaryButton={{
            disabled: isSubmitting,
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            type: 'submit',
          }}
          primaryButtonTooltip={
            isDirty
              ? undefined
              : {
                  text: 'All changes saved. Nothing to publish.',
                  icon: <SvgActionCheck />,
                }
          }
          secondaryButton={{
            text: 'Cancel',
            to: isDirty ? undefined : absoluteRoutes.viewer.member(activeMembership?.handle),
            onClick: () => (isDirty ? openDialog() : undefined),
          }}
        />
      </form>
    </EntitySettingTemplate>
  )
}
