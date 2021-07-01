import React, { ReactNode, useEffect, useState } from 'react'

import { usePersonalDataStore } from '@/providers'
import { IconButton } from '@/shared/components'
import { SvgAlertError, SvgAlertInfo, SvgAlertSuccess, SvgAlertWarning, SvgGlyphClose } from '@/shared/icons'

import {
  MessageActionButton,
  MessageButtonsContainer,
  MessageDescription,
  MessageHeader,
  MessageIconContainer,
  MessageTitle,
  MessageWrapper,
} from './DismissibleMessage.style'

export type DismissibleMessageVariant = 'primary' | 'secondary' | 'tertiary'

type DismissibleMessageIconType = 'success' | 'error' | 'info' | 'warning'

const ICON_TYPE_TO_ICON: Record<DismissibleMessageIconType, ReactNode> = {
  info: <SvgAlertInfo />,
  success: <SvgAlertSuccess />,
  error: <SvgAlertError />,
  warning: <SvgAlertWarning />,
}

export type DismissibleMessageProps = {
  title?: string
  description?: string
  id: string
  className?: string
  variant?: DismissibleMessageVariant
  icon?: DismissibleMessageIconType
  actionText?: string
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const DismissibleMessage: React.FC<DismissibleMessageProps> = ({
  title,
  description,
  id,
  className,
  variant = 'primary',
  icon,
  actionText,
  onActionClick,
}) => {
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

  return (
    <MessageWrapper className={className} variant={variant}>
      <MessageHeader>
        {icon && <MessageIconContainer>{ICON_TYPE_TO_ICON[icon]}</MessageIconContainer>}
        <MessageTitle variant="subtitle2">{title}</MessageTitle>
        <MessageButtonsContainer>
          {actionText && (
            <MessageActionButton variant="tertiary" onClick={onActionClick}>
              {actionText}
            </MessageActionButton>
          )}
          <IconButton
            aria-label="close dialog"
            onClick={() => updateDismissedMessages(id)}
            variant="tertiary"
            size="small"
          >
            <SvgGlyphClose />
          </IconButton>
        </MessageButtonsContainer>
      </MessageHeader>
      {description && <MessageDescription variant="body2">{description}</MessageDescription>}
    </MessageWrapper>
  )
}
