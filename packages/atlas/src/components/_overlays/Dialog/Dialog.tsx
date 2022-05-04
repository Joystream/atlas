import React, { FormEvent } from 'react'

import { Text } from '@/components/Text'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { SvgActionClose } from '@/components/_icons'
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

export type DialogButtonProps = {
  text: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

export type DialogProps = {
  title?: React.ReactNode
  icon?: React.ReactNode
  dividers?: boolean
  size?: DialogSize
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  additionalActionsNode?: React.ReactNode
  additionalActionsNodeMobilePosition?: 'top' | 'bottom'
  onExitClick?: () => void
  children?: React.ReactNode
  as?: React.ElementType
  onSubmit?: (e?: FormEvent) => void
  noContentPadding?: boolean
  actionDivider?: boolean
  className?: string
  contentClassName?: string
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  icon,
  dividers = false,
  size = 'default',
  primaryButton,
  secondaryButton,
  additionalActionsNode,
  onExitClick,
  children,
  as,
  onSubmit,
  noContentPadding,
  actionDivider = false,
  additionalActionsNodeMobilePosition = 'top',
  className,
  contentClassName,
}) => {
  const isCompact = size === 'compact'
  const smMatch = useMediaMatch('sm')
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const buttonProps: ButtonProps = { size: isCompact ? 'small' : 'medium' }

  return (
    <DialogContainer onSubmit={onSubmit} size={size} className={className} as={as}>
      {(title || icon || onExitClick) && (
        <Header dividers={dividers}>
          <HeaderContent>
            {icon && <HeaderIconContainer>{icon}</HeaderIconContainer>}
            <Text variant={isCompact ? 'h300' : smMatch ? 'h500' : 'h400'}>{title}</Text>
          </HeaderContent>
          {onExitClick && (
            <Button
              iconOnly
              icon={<SvgActionClose />}
              aria-label="close modal"
              onClick={onExitClick}
              variant="tertiary"
            />
          )}
        </Header>
      )}
      <Content
        denseHeader={!!icon}
        data-scroll-lock-scrollable
        noContentPadding={noContentPadding}
        className={contentClassName}
      >
        {children}
      </Content>
      {hasFooter && (
        <Footer
          dividers={dividers || actionDivider}
          data-has-additional-actions={!!additionalActionsNode}
          additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}
        >
          {additionalActionsNode}
          <FooterButtonsContainer additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}>
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
