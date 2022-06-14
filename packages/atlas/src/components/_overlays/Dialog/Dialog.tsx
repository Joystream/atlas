import { ElementType, FC, FormEvent, PropsWithChildren, ReactNode } from 'react'

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
  StyledPrimaryButton,
} from './Dialog.styles'

export type DialogButtonProps = {
  text: string
} & Omit<ButtonProps, 'children'>

export type DialogProps = PropsWithChildren<{
  title?: ReactNode
  dividers?: boolean
  size?: DialogSize
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  additionalActionsNode?: ReactNode
  additionalActionsNodeMobilePosition?: 'top' | 'bottom'
  onExitClick?: () => void
  as?: ElementType
  onSubmit?: (e?: FormEvent) => void
  noContentPadding?: boolean
  actionDivider?: boolean
  className?: string
  contentClassName?: string
}>

export const Dialog: FC<DialogProps> = ({
  title,
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
  const buttonSize = isCompact ? 'small' : 'medium'

  return (
    <DialogContainer onSubmit={onSubmit} size={size} className={className} as={as}>
      {(title || onExitClick) && (
        <Header dividers={dividers}>
          <HeaderContent>
            <Text variant={isCompact ? 'h300' : smMatch ? 'h500' : 'h400'}>{title}</Text>
          </HeaderContent>
          {onExitClick && (
            <Button icon={<SvgActionClose />} aria-label="close modal" onClick={onExitClick} variant="tertiary" />
          )}
        </Header>
      )}
      <Content data-scroll-lock-scrollable noContentPadding={noContentPadding} className={contentClassName}>
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
              <Button variant={secondaryButton.variant || 'secondary'} size={buttonSize} {...secondaryButton}>
                {secondaryButton.text}
              </Button>
            )}
            {primaryButton && (
              <StyledPrimaryButton variant={primaryButton.variant || 'primary'} size={buttonSize} {...primaryButton}>
                {primaryButton.text}
              </StyledPrimaryButton>
            )}
          </FooterButtonsContainer>
        </Footer>
      )}
    </DialogContainer>
  )
}
