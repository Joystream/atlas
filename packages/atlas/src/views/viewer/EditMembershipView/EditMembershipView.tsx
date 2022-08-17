import axios from 'axios'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { absoluteRoutes } from '@/config/routes'
import { AVATAR_SERVICE_URL } from '@/config/urls'
import { EditMemberFormInputs, useCreateEditMemberForm } from '@/hooks/useCreateEditMember'
import { useHeadTags } from '@/hooks/useHeadTags'
import { MemberInputMetadata } from '@/joystream-lib'
import { useFee, useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

export const EditMembershipView: FC = () => {
  const navigate = useNavigate()
  const { accountId, memberId, activeMembership, isLoggedIn, refetchUserMemberships } = useUser()
  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const { register, handleSubmit, reset, watch, errors, isDirty, isValid, control, dirtyFields, isValidating } =
    useCreateEditMemberForm(activeMembership?.handle)

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
              description="Member handle may contain only lowercase letters, numbers and underscores"
              error={errors?.handle?.message}
            >
              <Input
                autoComplete="off"
                placeholder="johnnysmith"
                {...register('handle')}
                value={watch('handle') || ''}
                error={!!errors?.handle}
              />
            </FormField>
            <FormField label="About" error={errors?.about?.message}>
              <TextArea
                placeholder="Anything you'd like to share about yourself with the Atlas community"
                maxLength={1000}
                {...register('about')}
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
