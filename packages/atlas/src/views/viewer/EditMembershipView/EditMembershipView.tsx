import { FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'
import { absoluteRoutes } from '@/config/routes'
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

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    errors,
    isDirty,
    isValid,
    dirtyFields,
    isValidating,
    setFocus,
  } = useCreateEditMemberForm(activeMembership?.handle)

  const resetForm = useCallback(() => {
    reset(
      {
        handle: activeMembership?.handle,
        avatar:
          activeMembership?.metadata.avatar?.__typename === 'AvatarUri'
            ? activeMembership.metadata.avatar.avatarUri
            : null,
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
        ...(dirtyFields.avatar ? { avatarUri: data?.avatar } : {}),
      }
    },
    [dirtyFields]
  )

  const { fullFee: fee } = useFee(
    'updateMemberTx',
    memberId && isDirty
      ? [memberId, dirtyFields.handle ? watch('handle') : null, createMemberInputMetadata(watch())]
      : undefined
  )

  const handleEditMember = handleSubmit(async (formData) => {
    if (!joystream || !activeMembership) {
      return
    }

    const success = await handleTransaction({
      txFactory: async (updateStatus) => {
        const memberInputMetadata: MemberInputMetadata = createMemberInputMetadata(formData)
        return (await joystream.extrinsics).updateMember(
          activeMembership.id,
          dirtyFields.handle ? formData.handle : null,
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
        <MembershipInfo
          address={accountId}
          avatarUrl={errors.avatar ? '' : getValues('avatar')}
          onAvatarEditClick={() => setFocus('avatar')}
          hasAvatarUploadFailed={!!errors.avatar}
          loading={!isLoggedIn}
          editable
          handle={getValues('handle')}
        />
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <TextFieldsWrapper>
            <FormField label="Avatar URL" error={errors?.avatar?.message}>
              <Input
                autoComplete="off"
                error={!!errors?.avatar}
                placeholder="https://example.com/avatar.jpeg"
                {...register('avatar')}
                value={watch('avatar') || ''}
              />
            </FormField>
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
