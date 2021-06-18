import React, { useEffect, useState } from 'react'

import { usePersonalData } from '@/providers'
import { SvgGlyphClose } from '@/shared/icons'

import {
  MessageButton,
  MessageDescription,
  MessageTitle,
  MessageWrapper,
  StyledSvgGlyphInfo,
} from './DismissibleMessage.style'

export type DismissibleMessageProps = {
  title?: string
  description?: string
  id: string
  className?: string
}

export const DismissibleMessage: React.FC<DismissibleMessageProps> = ({ title, description, id, className }) => {
  const {
    updateDismissedMessages,
    state: { dismissedMessages },
  } = usePersonalData()
  const [isDismissedMessage, setDismissedMessage] = useState<boolean>()

  useEffect(() => {
    const isDissmised = dismissedMessages.some((channel) => channel.id === id)
    setDismissedMessage(isDissmised)
  }, [dismissedMessages, id])

  if (isDismissedMessage) {
    return null
  }

  return (
    <MessageWrapper className={className}>
      <MessageTitle variant="subtitle2">
        <StyledSvgGlyphInfo />
        {title}
      </MessageTitle>
      <MessageButton aria-label="close dialog" onClick={() => updateDismissedMessages(id)} variant="tertiary">
        <SvgGlyphClose />
      </MessageButton>
      <MessageDescription variant="body2">{description}</MessageDescription>
    </MessageWrapper>
  )
}
