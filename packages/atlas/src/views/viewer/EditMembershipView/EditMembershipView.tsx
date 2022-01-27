import React, { useCallback, useEffect } from 'react'
import useMeasure from 'react-use-measure'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { CreateEditMemberInputs } from '@/components/_auth/CreateEditMemberInputs'
import { useCreateEditMemberForm } from '@/hooks/useCreateEditMember'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'

import { StyledActionBar, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

export const EditMembershipView: React.FC = () => {
  const { activeAccountId, activeMembership, activeMembershipLoading, refetchActiveMembership } = useUser()
  const [actionBarRef, actionBarBounds] = useMeasure()
  const { joystream } = useJoystream()
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
        avatar: activeMembership?.avatarUri,
        about: activeMembership?.about,
      },
      {
        keepDirty: false,
      }
    )
  }, [activeMembership?.about, activeMembership?.avatarUri, activeMembership?.handle, reset])

  useEffect(() => {
    if (!activeMembershipLoading && activeMembership) {
      resetForm()
    }
  }, [activeMembership, activeMembershipLoading, resetForm])

  const handleEditMember = handleSubmit(async (data) => {
    if (!joystream || !activeMembership) {
      return
    }

    await handleTransaction({
      txFactory: (updateStatus) =>
        joystream.extrinsics.updateMember(
          activeMembership?.id,
          dirtyFields.handle ? data.handle : null,
          dirtyFields.avatar ? data?.avatar : null,
          dirtyFields.about ? data.about : null,
          updateStatus
        ),
      successMessage: {
        title: 'Member successfully updated',
        description: 'Lorem ipsum',
      },
    })
    refetchActiveMembership()
  })

  return (
    <form onSubmit={handleEditMember}>
      <LimitedWidthContainer>
        <MembershipInfo
          address={activeAccountId}
          avatarUrl={errors.avatar ? '' : getValues('avatar')}
          onAvatarEditClick={() => setFocus('avatar')}
          hasAvatarUploadFailed={!!errors.avatar}
          loading={activeMembershipLoading}
          handle={getValues('handle')}
        />
        <Wrapper actionBarHeight={actionBarBounds.height}>
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
            onClick: resetForm,
          }}
        />
      </LimitedWidthContainer>
    </form>
  )
}
