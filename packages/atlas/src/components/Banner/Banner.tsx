import { FC, ReactNode } from 'react'

import { SvgActionClose } from '@/components/_icons'
import { usePersonalDataStore } from '@/providers/personalData'

import { BannerDescription, BannerHeader, BannerText, BannerWrapper, CloseButton, IconWrapper } from './Banner.styles'

export type BannerProps = {
  dismissibleId?: string
  title?: string
  description?: ReactNode
  className?: string
  icon?: ReactNode
}

export const Banner: FC<BannerProps> = ({ title, description, className, icon, dismissibleId }) => {
  const isDismissedMessage =
    usePersonalDataStore((state) => state.dismissedMessages.some((message) => message.id === dismissibleId)) &&
    !!dismissibleId
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage) {
    return null
  }

  return (
    <BannerWrapper className={className}>
      {title && (
        <BannerHeader>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <BannerText as="h3" variant="h400">
            {title}
          </BannerText>
          {dismissibleId && (
            <CloseButton
              icon={<SvgActionClose />}
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(dismissibleId)}
              variant="tertiary"
              size="small"
            />
          )}
        </BannerHeader>
      )}
      {description && (
        <BannerDescription withTitle={!!title}>
          {icon && !title && <IconWrapper>{icon}</IconWrapper>}
          <BannerText as="p" variant="t200" color="colorText">
            {description}
          </BannerText>
          {!title && dismissibleId && (
            <CloseButton
              icon={<SvgActionClose />}
              aria-label="close dialog"
              onClick={() => updateDismissedMessages(dismissibleId)}
              variant="tertiary"
              size="small"
            />
          )}
        </BannerDescription>
      )}
    </BannerWrapper>
  )
}
