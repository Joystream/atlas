import React, { FormEvent } from 'react'

import { Text } from '@/components/Text'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose, SvgAlertsError32, SvgAlertsSuccess32, SvgAlertsWarning32 } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Content,
  DialogContainer,
  DialogSize,
  Footer,
  FooterButtonsContainer,
  Header,
  HeaderContent,
  HeaderIconContainer,
  StyledPrimaryButton,
} from './Dialog.styles'

type DialogButtonProps = {
  text: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

type DialogIconType = 'success' | 'warning' | 'error'

export type DialogProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  iconType?: DialogIconType
  headerIcon?: React.ReactNode
  dividers?: boolean
  size?: DialogSize
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  additionalActionsNode?: React.ReactNode
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
  as?: React.ElementType
  onSubmit?: (e?: FormEvent) => void
  noContentPadding?: boolean
  actionDivider?: boolean
}

const TYPE_TO_ICON: Record<DialogIconType, React.ReactNode | null> = {
  success: <SvgAlertsSuccess32 />,
  warning: <SvgAlertsWarning32 />,
  error: <SvgAlertsError32 />,
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  iconType,
  headerIcon,
  dividers = false,
  size = 'default',
  primaryButton,
  secondaryButton,
  additionalActionsNode,
  onExitClick,
  children,
  className,
  as,
  onSubmit,
  noContentPadding,
  actionDivider = false,
}) => {
  const isCompact = size === 'compact'
  const smMatch = useMediaMatch('sm')
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const buttonProps: ButtonProps = { size: isCompact ? 'small' : !smMatch ? 'medium' : 'large' }

  const iconNode = headerIcon || (iconType && TYPE_TO_ICON[iconType]) || null

  return (
    <DialogContainer onSubmit={onSubmit} size={size} className={className} as={as}>
      {(title || onExitClick) && (
        <Header dividers={dividers}>
          <HeaderContent>
            {iconNode ? <HeaderIconContainer>{iconNode}</HeaderIconContainer> : null}
            <Text variant={isCompact ? 'h300' : !smMatch ? 'h400' : 'h500'}>{title}</Text>
          </HeaderContent>
          {onExitClick && (
            <IconButton aria-label="close modal" onClick={onExitClick} variant="tertiary">
              <SvgActionClose />
            </IconButton>
          )}
        </Header>
      )}
      <Content denseHeader={!!iconNode} data-scroll-lock-scrollable noContentPadding={noContentPadding}>
        {description ? (
          <Text variant="t200" secondary>
            {description}
          </Text>
        ) : null}
        {children}
      </Content>
      {hasFooter && (
        <Footer dividers={dividers || actionDivider} hasAdditionalActions={!!additionalActionsNode}>
          {additionalActionsNode}
          <FooterButtonsContainer>
            {secondaryButton && (
              <Button variant={secondaryButton.variant || 'secondary'} {...buttonProps} {...secondaryButton}>
                {secondaryButton.text}
              </Button>
            )}
            {primaryButton && (
              <StyledPrimaryButton variant={primaryButton.variant || 'primary'} {...buttonProps} {...primaryButton}>
                {primaryButton.text}
              </StyledPrimaryButton>
            )}
          </FooterButtonsContainer>
        </Footer>
      )}
    </DialogContainer>
  )
}
