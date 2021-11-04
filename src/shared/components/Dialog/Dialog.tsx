import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button, ButtonProps } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose, SvgOutlineError, SvgOutlineSuccess, SvgOutlineWarning } from '@/shared/icons'

import {
  Content,
  DialogContainer,
  Footer,
  FooterButtonsContainer,
  Header,
  HeaderContent,
  HeaderIconContainer,
  Size,
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
  size?: Size
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  additionalActionsNode?: React.ReactNode
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
}

const TYPE_TO_ICON: Record<DialogIconType, React.ReactNode | null> = {
  success: <SvgOutlineSuccess />,
  warning: <SvgOutlineWarning />,
  error: <SvgOutlineError />,
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
  const hasHeader = !!title || !!onExitClick
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const buttonProps: ButtonProps = { size: isCompact ? 'small' : !smMatch ? 'medium' : 'large' }

  const iconNode = headerIcon || (iconType && TYPE_TO_ICON[iconType]) || null

  return (
    <DialogContainer size={size} className={className}>
      {title && (
        <Header dividers={dividers} denseHeader={!!iconNode}>
          <HeaderContent>
            {iconNode ? <HeaderIconContainer>{iconNode}</HeaderIconContainer> : null}
            <Text variant={isCompact ? 'h6' : !smMatch ? 'h5' : 'h4'}>{title}</Text>
          </HeaderContent>
          {onExitClick && (
            <IconButton aria-label="close modal" onClick={onExitClick} variant="tertiary">
              <SvgGlyphClose />
            </IconButton>
          )}
        </Header>
      )}
      <Content hasHeader={hasHeader} hasFooter={hasFooter} dividers={dividers} data-scroll-lock-scrollable>
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
