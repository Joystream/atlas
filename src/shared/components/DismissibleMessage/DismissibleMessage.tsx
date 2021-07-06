import React from 'react'

import { usePersonalDataStore } from '@/providers'

import { Banner, BannerProps } from '../Banner'

export type DismissibleMessageProps = {
  id: string
} & Omit<BannerProps, 'onExitClick'>

export const DismissibleMessage: React.FC<DismissibleMessageProps> = ({ id, ...dismissedMessageProps }) => {
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === id)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage) {
    return null
  }

  return <Banner {...dismissedMessageProps} onExitClick={() => updateDismissedMessages(id)} />
}
