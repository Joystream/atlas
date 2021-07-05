import React, { useEffect, useState } from 'react'

import { usePersonalDataStore } from '@/providers'

import { Banner, BannerProps } from '../Banner'

export type DismissibleMessageProps = {
  id: string
} & Omit<BannerProps, 'onExitClick'>

export const DismissibleMessage: React.FC<DismissibleMessageProps> = ({ id, ...dismissedMessageProps }) => {
  const dismissedMessages = usePersonalDataStore((state) => state.dismissedMessages)
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const [isDismissedMessage, setDismissedMessage] = useState<boolean>()

  useEffect(() => {
    const isDissmised = dismissedMessages.some((channel) => channel.id === id)
    setDismissedMessage(isDissmised)
  }, [dismissedMessages, id])

  if (isDismissedMessage) {
    return null
  }

  return <Banner {...dismissedMessageProps} onExitClick={() => updateDismissedMessages(id)} />
}
