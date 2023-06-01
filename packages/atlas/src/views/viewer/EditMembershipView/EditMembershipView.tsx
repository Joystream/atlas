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
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { MemberInputMetadata } from '@/joystream-lib/types'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { uploadAvatarImage, validateImage } from '@/utils/image'
import { ConsoleLogger } from '@/utils/logs'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

export type EditMemberFormInputs = {
  handle: string | null
  avatar: ImageInputFile | null
  about: string | null
}

export const EditMembershipView: FC = () => {
  const navigate = useNavigate()
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)
  const [isHandleValidating, setIsHandleValidating] = useState(false)
  const { accountId, memberId, activeMembership, isLoggedIn, refetchUserMemberships } = useUser()
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
    if (!joystream || !activeMembership) {
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
    <form onSubmit={handleEditMember}>
      {headTags}
      <LimitedWidthContainer>
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange, value: avatarInputFile } }) => (
            <>
              <MembershipInfo
                address={accountId}
                avatarUrls={avatarInputFile?.url ? [avatarInputFile.url] : undefined}
                hasAvatarUploadFailed={!isImageValid}
                onAvatarEditClick={() =>
                  avatarDialogRef.current?.open(
                    avatarInputFile?.originalBlob ? avatarInputFile.originalBlob : avatarInputFile?.blob,
                    avatarInputFile?.imageCropData,
                    !!avatarInputFile?.blob
                  )
                }
                loading={!isLoggedIn}
                editable
                handle={watch('handle')}
              />
              <ImageCropModal
                imageType="avatar"
                onConfirm={(blob, url, _, imageCropData, originalBlob) => {
                  validateImage(url)
                    .then(() => setIsImageValid(true))
                    .catch(() => setIsImageValid(false))
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
            </>
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
            <FormField label="About" error={errors?.about?.message}>
              <TextArea
                placeholder={`Anything you'd like to share about yourself with the ${atlasConfig.general.appName} community`}
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
            disabled: !isDirty || isHandleValidating || isSubmitting,
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            type: 'submit',
          }}
          secondaryButton={{
            text: 'Cancel',
            to: absoluteRoutes.viewer.member(activeMembership?.handle),
          }}
        />
      </LimitedWidthContainer>
    </form>
  )
}
