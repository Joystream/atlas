import { usePersonalData } from '@/hooks'
import React, { useEffect, useState } from 'react'
import { MessageWrapper, MessageTitle, MessageButton, MessageDescription } from './DismissibleMessage.style'
import { SvgGlyphClose, SvgGlyphInfo } from '@/shared/icons'

export type DismissibleMessageProps = {
  title?: string
  description?: string
  id: string
  className?: string
}

const DismissibleMessage: React.FC<DismissibleMessageProps> = ({ title, description, id, className }) => {
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
      <MessageTitle variant="h6">
        <SvgGlyphInfo />
        {title}
      </MessageTitle>
      <MessageButton aria-label="close dialog" onClick={() => updateDismissedMessages(id)} variant="tertiary">
        <SvgGlyphClose />
      </MessageButton>
      <MessageDescription variant="body2">{description}</MessageDescription>
    </MessageWrapper>
  )
}

export default DismissibleMessage
