import React from 'react'

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
} from './Dialog.styles'

type DialogButtonProps = {
  text: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

type DialogIconType = 'success' | 'warning' | 'error'

export type DialogProps = {
  title?: string
  description?: string
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
}) => {
  const isCompact = size === 'compact'
  const smMatch = useMediaMatch('sm')
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const buttonProps: ButtonProps = { size: isCompact ? 'small' : !smMatch ? 'medium' : 'large' }

  const iconNode = headerIcon || (iconType && TYPE_TO_ICON[iconType]) || null

  return (
    <DialogContainer size={size} className={className}>
      {(title || onExitClick) && (
        <Header dividers={dividers}>
          <HeaderContent>
            {iconNode ? <HeaderIconContainer>{iconNode}</HeaderIconContainer> : null}
            <Text variant={isCompact ? 'h6' : !smMatch ? 'h5' : 'h4'}>{title}</Text>
          </HeaderContent>
          {onExitClick && (
            <IconButton aria-label="close modal" onClick={onExitClick} variant="tertiary">
              <SvgActionClose />
            </IconButton>
          )}
        </Header>
      )}
      <Content denseHeader={!!iconNode} data-scroll-lock-scrollable>
        {description ? (
          <Text variant="body2" secondary>
            {description}
          </Text>
        ) : null}
        {children}
      </Content>
      {hasFooter && (
        <Footer dividers={dividers} hasAdditionalActions={!!additionalActionsNode}>
          {additionalActionsNode}
          <FooterButtonsContainer>
            {/* order of buttons on desktop is reversed via CSS order property */}
            {primaryButton && (
              <Button variant="primary" {...buttonProps} {...primaryButton}>
                {primaryButton.text}
              </Button>
            )}
            {secondaryButton && (
              <Button variant="secondary" {...buttonProps} {...secondaryButton}>
                {secondaryButton.text}
              </Button>
            )}
          </FooterButtonsContainer>
        </Footer>
      )}
    </DialogContainer>
  )
}
