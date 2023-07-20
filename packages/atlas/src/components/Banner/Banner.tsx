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
  Container,
  IconWrapper,
} from './Banner.styles'

type ActionButtonProps = {
  text: string
  onClick: () => void
} & Omit<ButtonProps, 'children'>

export type BannerProps = {
  dismissibleId?: string
  borderColor?: string
  title?: string
  description?: ReactNode
  className?: string
  icon?: ReactNode
  size?: 'small' | 'medium'
  actionButton?: ActionButtonProps
}

export const Banner: FC<BannerProps> = ({
  title,
  borderColor,
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
    <BannerWrapper size={size} className={className} borderColor={borderColor}>
      <Container>
        <div>
          {title && (
            <BannerHeader>
              {icon && <IconWrapper>{icon}</IconWrapper>}
              <BannerText as="h3" variant="h300" color="colorTextStrong">
                {title}
              </BannerText>
            </BannerHeader>
          )}
          {description && (
            <BannerDescription withTitle={!!title}>
              {icon && !title && <IconWrapper>{icon}</IconWrapper>}
              <BannerText as="p" variant="t200" color="colorText">
                {description}
              </BannerText>
            </BannerDescription>
          )}
          {actionButton && (
            <ActionButton {...actionButton} variant="primary" _textOnly>
              {actionButton.text}
            </ActionButton>
          )}
        </div>
        {dismissibleId && (
          <CloseButton
            icon={<SvgActionClose />}
            aria-label="close dialog"
            onClick={() => updateDismissedMessages(dismissibleId)}
            variant="tertiary"
            size="small"
          />
        )}
      </Container>
    </BannerWrapper>
  )
}
