import { RefObject, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { ActionBar } from '@/components/ActionBar'
import { NotificationsState, NotificationsTable } from '@/components/NotificationsTable'
import { Portal } from '@/components/Portal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { StyledForm } from './StudioChannelNotificationsTab.styles'
import { TABLE_STRUCTURE } from './StudioChannelNotificationsTab.utils'
import { useChannelSettingsData } from './StudioChannelNotificationsTabStudio.hooks'

export const StudioChannelNotificationsTab = ({ actionBarPortal }: { actionBarPortal: RefObject<HTMLDivElement> }) => {
  const { data, isLoading, isSubmitting, submit } = useChannelSettingsData()

  const form = useForm<NotificationsState>()
  const {
    reset,
    formState: { isDirty },
  } = form

  useEffect(() => reset(data), [reset, data])

  const handleEditNotifications = form.handleSubmit(submit)

  return (
    <>
      <StyledForm>
        <EntitySettingTemplate
          title="Channel notifications"
          description="Set up all notifications regarding this channel."
        >
          <NotificationsTable sections={TABLE_STRUCTURE} form={form} disabled={isLoading} />
        </EntitySettingTemplate>
      </StyledForm>
      <Portal containerRef={actionBarPortal}>
        <ActionBar
          primaryButton={{
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            disabled: isSubmitting || !isDirty,
            onClick: handleEditNotifications,
          }}
          secondaryButton={{
            text: 'Cancel',
            disabled: isSubmitting || !isDirty,
            onClick: () => reset(),
          }}
          isNoneCrypto
        />
      </Portal>
    </>
  )
}
