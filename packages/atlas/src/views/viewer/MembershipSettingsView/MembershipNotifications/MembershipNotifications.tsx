import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useResizeObserver from 'use-resize-observer'

import { NotificationsState, NotificationsTable } from '@/components/NotificationsTable'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { useMemberSettingsData } from './MembershipNotifications.hooks'
import { StyledActionBar, Wrapper } from './MembershipNotifications.styles'
import { TABLE_STRUCTURE } from './MembershipNotifications.utils'

export const MembershipNotifications = () => {
  const { data, isLoading, isSubmitting, submit } = useMemberSettingsData()

  const form = useForm<NotificationsState>()
  const {
    reset,
    formState: { isDirty },
  } = form

  useEffect(() => reset(data), [reset, data])

  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })

  const handleEditMember = form.handleSubmit(submit)

  const isBusy = isLoading || isSubmitting

  return (
    <EntitySettingTemplate
      isFirst
      title="Membership address"
      description="Set up all notifications regarding channels that you follow or your assets."
    >
      <form onSubmit={handleEditMember}>
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <NotificationsTable sections={TABLE_STRUCTURE} form={form} disabled={isBusy} />
        </Wrapper>

        <StyledActionBar
          ref={actionBarRef}
          primaryButton={{
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            disabled: isBusy || !isDirty,
            type: 'submit',
          }}
          secondaryButton={{
            text: 'Cancel',
            disabled: isBusy || !isDirty,
            onClick: () => reset(),
          }}
          isNoneCrypto
        />
      </form>
    </EntitySettingTemplate>
  )
}
