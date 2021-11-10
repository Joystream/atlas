import React from 'react'

import { Banner, BannerProps } from '@/components/Banner'
import { usePersonalDataStore } from '@/providers/personalData'

export type DismissibleBannerProps = {
  id: string
} & Omit<BannerProps, 'onExitClick'>

export const DismissibleBanner: React.FC<DismissibleBannerProps> = ({ id, ...dismissedMessageProps }) => {
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === id)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage) {
    return null
  }

  return <Banner {...dismissedMessageProps} onExitClick={() => updateDismissedMessages(id)} />
}
