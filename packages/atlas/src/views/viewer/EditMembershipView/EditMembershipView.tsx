import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { CreateEditMemberInputs } from '@/components/_auth/CreateEditMemberInputs'
import { absoluteRoutes } from '@/config/routes'
import { useCreateEditMemberForm } from '@/hooks/useCreateEditMember'
import { useHeadTags } from '@/hooks/useHeadTags'
import { MemberInputMetadata } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

export const EditMembershipView: React.FC = () => {
  const navigate = useNavigate()
  const { activeAccountId, activeMembership, activeMembershipLoading, refetchActiveMembership } = useUser()
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
  } = useCreateEditMemberForm({ prevHandle: activeMembership?.handle })

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

  useEffect(() => {
    if (!activeMembershipLoading && activeMembership) {
      resetForm()
    }
  }, [activeMembership, activeMembershipLoading, resetForm])

  const headTags = useHeadTags('Edit membership')

  const handleEditMember = handleSubmit(async (formData) => {
    if (!joystream || !activeMembership) {
      return
    }

    const success = await handleTransaction({
      txFactory: async (updateStatus) => {
        const memberInputMetadata: MemberInputMetadata = {
          ...(dirtyFields.about ? { about: formData?.about } : {}),
          ...(dirtyFields.avatar ? { avatarUri: formData?.avatar } : {}),
        }
        return (await joystream.extrinsics).updateMember(
          activeMembership?.id,
          dirtyFields.handle ? formData.handle : null,
          memberInputMetadata,
          proxyCallback(updateStatus)
        )
      },
      snackbarSuccessMessage: {
        title: 'Member successfully updated',
        description: 'Lorem ipsum',
      },
    })
    const { data } = await refetchActiveMembership()
    if (success) {
      navigate(absoluteRoutes.viewer.member(data.membershipByUniqueInput?.handle))
    }
  })

  return (
    <form onSubmit={handleEditMember}>
      {headTags}
      <LimitedWidthContainer>
        <MembershipInfo
          address={activeAccountId}
          avatarUrl={errors.avatar ? '' : getValues('avatar')}
          onAvatarEditClick={() => setFocus('avatar')}
          hasAvatarUploadFailed={!!errors.avatar}
          loading={activeMembershipLoading}
          editable
          handle={getValues('handle')}
        />
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <TextFieldsWrapper>
            <CreateEditMemberInputs register={register} errors={errors} watch={watch} />
          </TextFieldsWrapper>
        </Wrapper>
        <StyledActionBar
          ref={actionBarRef}
          primaryText="Fee: 0 Joy"
          secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
          primaryButton={{
            disabled: !isDirty || !isValid || isValidating,
            text: 'Publish changes',
            type: 'submit',
          }}
          secondaryButton={{
            visible: true,
            text: 'Cancel',
            to: absoluteRoutes.viewer.member(activeMembership?.handle),
          }}
        />
      </LimitedWidthContainer>
    </form>
  )
}
