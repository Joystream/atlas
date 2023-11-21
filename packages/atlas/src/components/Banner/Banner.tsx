import { FC, ReactNode } from 'react'

import { SvgActionClose } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
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
  rightActionButton?: boolean
  children?: ReactNode
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
  rightActionButton,
  children,
}) => {
  const isDismissedMessage =
    usePersonalDataStore((state) => state.dismissedMessages.some((message) => message.id === dismissibleId)) &&
    !!dismissibleId
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const smMatch = useMediaMatch('sm')
  if (isDismissedMessage) {
    return null
  }

  return (
    <BannerWrapper size={size} className={className} borderColor={borderColor}>
      <Container>
        <FlexBox flow="column">
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
          {actionButton && (!rightActionButton || !smMatch) && (
            <ActionButton variant="primary" _textOnly {...actionButton}>
              {actionButton.text}
            </ActionButton>
          )}
        </FlexBox>
        <FlexBox width="auto" flow="row" justifyContent="end" alignItems="center">
          {actionButton && rightActionButton && smMatch && (
            <ActionButton variant="primary" rightActionButton _textOnly {...actionButton}>
              {actionButton.text}
            </ActionButton>
          )}
          {dismissibleId && (
            <CloseButton
              icon={<SvgActionClose />}
              aria-label="close dialog"
              rightActionButton
              onClick={() => updateDismissedMessages(dismissibleId)}
              variant="tertiary"
              size="small"
            />
          )}
        </FlexBox>
        {children}
      </Container>
    </BannerWrapper>
  )
}
