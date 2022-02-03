import React, { ReactNode } from 'react'

import { SvgActionClose } from '@/components/_icons'
import { usePersonalDataStore } from '@/providers/personalData'

import { BannerDescription, BannerHeader, BannerText, BannerWrapper, CloseButton, IconWrapper } from './Banner.styles'

export type BannerProps = {
  id: string
  title?: string
  description?: React.ReactNode
  className?: string
  dismissable?: boolean
  icon?: ReactNode
}

export const Banner: React.FC<BannerProps> = ({ title, description, className, icon, id, dismissable = true }) => {
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === id)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage) {
    return null
  }
  return (
    <BannerWrapper className={className}>
      {title && (
        <BannerHeader>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <BannerText variant="h400">{title}</BannerText>
          {dismissable && (
            <CloseButton
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(id)}
              variant="tertiary"
              size="small"
            >
              <SvgActionClose />
            </CloseButton>
          )}
        </BannerHeader>
      )}
      {description && (
        <BannerDescription withTitle={!!title}>
          {icon && !title && <IconWrapper>{icon}</IconWrapper>}
          <BannerText as="p" variant="t200" secondary>
            {description}
          </BannerText>
          {!title && dismissable && (
            <CloseButton
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(id)}
              variant="tertiary"
              size="small"
            >
              <SvgActionClose />
            </CloseButton>
          )}
        </BannerDescription>
      )}
    </BannerWrapper>
  )
}
