import { FC, ReactNode } from 'react'

import { SvgActionClose } from '@/components/_icons'
import { usePersonalDataStore } from '@/providers/personalData'

import { BannerDescription, BannerHeader, BannerText, BannerWrapper, CloseButton, IconWrapper } from './Banner.styles'

export type BannerProps = {
  id: string
  title?: string
  description?: ReactNode
  className?: string
  dismissable?: boolean
  icon?: ReactNode
}

export const Banner: FC<BannerProps> = ({ title, description, className, icon, id = '', dismissable = true }) => {
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === id)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage && dismissable) {
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
              icon={<SvgActionClose />}
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(id)}
              variant="tertiary"
              size="small"
            />
          )}
        </BannerHeader>
      )}
      {description && (
        <BannerDescription withTitle={!!title}>
          {icon && !title && <IconWrapper>{icon}</IconWrapper>}
          <BannerText as="p" variant="t200" color="default">
            {description}
          </BannerText>
          {!title && dismissable && (
            <CloseButton
              icon={<SvgActionClose />}
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(id)}
              variant="tertiary"
              size="small"
            />
          )}
        </BannerDescription>
      )}
    </BannerWrapper>
  )
}
