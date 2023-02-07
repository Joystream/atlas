import { FC, ReactNode } from 'react'

import { SvgActionClose } from '@/assets/icons'
import { ButtonProps } from '@/components/_buttons/Button'
import { usePersonalDataStore } from '@/providers/personalData'

import {
  ActionButton,
  BannerDescription,
  BannerHeader,
  BannerText,
  BannerWrapper,
  CloseButton,
  IconWrapper,
} from './Banner.styles'

type ActionButtonProps = {
  text: string
  onClick: () => void
} & Omit<ButtonProps, 'children'>

export type BannerProps = {
  dismissibleId?: string
  title?: string
  description?: ReactNode
  className?: string
  icon?: ReactNode
  size?: 'small' | 'medium'
  actionButton?: ActionButtonProps
}

export const Banner: FC<BannerProps> = ({
  title,
  description,
  className,
  icon,
  dismissibleId,
  size = 'small',
  actionButton,
}) => {
  const isDismissedMessage =
    usePersonalDataStore((state) => state.dismissedMessages.some((message) => message.id === dismissibleId)) &&
    !!dismissibleId
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  if (isDismissedMessage) {
    return null
  }

  return (
    <BannerWrapper size={size} className={className}>
      {title && (
        <BannerHeader>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <BannerText as="h3" variant="h400" color="colorTextStrong">
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
      {actionButton && (
        <ActionButton {...actionButton} variant="primary" _textOnly>
          {actionButton.text}
        </ActionButton>
      )}
    </BannerWrapper>
  )
}
