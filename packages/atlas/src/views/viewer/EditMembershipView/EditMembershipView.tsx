import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import axios from 'axios'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { absoluteRoutes } from '@/config/routes'
import { AVATAR_SERVICE_URL } from '@/config/urls'
import { useHeadTags } from '@/hooks/useHeadTags'
import { MemberInputMetadata } from '@/joystream-lib'
import { useFee, useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

export type EditMemberFormInputs = {
  handle: string | null
  avatar: ImageInputFile
  about: string | null
}

export const EditMembershipView: FC = () => {
  const navigate = useNavigate()
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const { accountId, memberId, activeMembership, isLoggedIn, refetchUserMemberships } = useUser()
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const client = useApolloClient()

  const validateUserHandle = async (value: string, prevValue?: string) => {
    if (prevValue != null && value === prevValue) {
      return true
    }
    const {
      data: { membershipByUniqueInput },
    } = await client.query<GetMembershipQuery, GetMembershipQueryVariables>({
      query: GetMembershipDocument,
      variables: { where: { handle: value } },
    })

    return !membershipByUniqueInput
  }

  const debouncedHandleUniqueValidation = useRef(debouncePromise(validateUserHandle, 500))

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isDirty, isValid, dirtyFields, isValidating },
  } = useForm<EditMemberFormInputs>({
    mode: 'onChange',
    shouldFocusError: true,
  })

  const resetForm = useCallback(async () => {
    let blob
    if (activeMembership?.metadata.avatar?.__typename === 'AvatarUri' && activeMembership.metadata.avatar.avatarUri) {
      blob = await fetch(activeMembership.metadata.avatar.avatarUri).then((r) => r.blob())
    }
    reset(
      {
        handle: activeMembership?.handle,
        avatar:
          activeMembership?.metadata.avatar?.__typename === 'AvatarUri'
            ? {
                url: activeMembership.metadata.avatar.avatarUri,
                blob: blob,
              }
            : {},
        about: activeMembership?.metadata.about,
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
      return {
        ...(dirtyFields.about ? { about: data?.about } : {}),
        ...(dirtyFields.avatar ? { avatarUri: data?.avatar?.url } : null),
      }
    },
    [dirtyFields]
  )

  const { fullFee: fee, loading: feeLoading } = useFee(
    'updateMemberTx',
    memberId ? [memberId, watch('handle'), createMemberInputMetadata(watch())] : undefined
  )

  const handleEditMember = handleSubmit(async (data) => {
    if (!joystream || !activeMembership) {
      return
    }

    const success = await handleTransaction({
      txFactory: async (updateStatus) => {
        let fileUrl
        const croppedBlob = data.avatar?.blob

        if (croppedBlob) {
          const formData = new FormData()
          formData.append('file', croppedBlob, `upload.${croppedBlob.type === 'image/webp' ? 'webp' : 'jpg'}`)
          const response = await axios.post<string>(AVATAR_SERVICE_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          fileUrl = response.data
        }

        const memberInputMetadata: MemberInputMetadata = {
          name: data.handle,
          about: data.about,
          avatarUri: data.avatar === null ? '' : fileUrl,
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

  const { ref, ...handleRest } = register('handle', {
    validate: {
      valid: (value) => (!value ? true : MEMBERSHIP_NAME_PATTERN.test(value) || 'Enter a valid member handle.'),
      unique: async (value) => {
        if (!value) {
          return 'Member handle is required.'
        }
        const valid = await debouncedHandleUniqueValidation.current(value)
        return valid || 'This member handle is already in use.'
      },
    },
    required: { value: true, message: 'Member handle is required.' },
    minLength: { value: 5, message: 'Member handle must be at least 5 characters long.' },
  })
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
                avatarUrl={avatarInputFile?.url}
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
                processing={isValidating && isHandleInputActiveElement}
                placeholder="johnnysmith"
                error={!!errors?.handle && !isValidating}
              />
            </FormField>
            <FormField label="About" error={errors?.about?.message}>
              <TextArea
                placeholder="Anything you'd like to share about yourself with the Atlas community"
                maxLength={1000}
                {...register('about', {
                  maxLength: { value: 1000, message: 'About cannot be longer than 1000 characters' },
                })}
                value={watch('about') || ''}
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
            disabled: !isDirty || !isValid || isValidating,
            text: 'Publish changes',
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
