import { FC, FormEvent, PropsWithChildren, ReactNode, Ref } from 'react'

import { Fee } from '@/components/Fee'
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
  onSubmit?: (e?: FormEvent) => void
  noContentPadding?: boolean
  actionDivider?: boolean
  className?: string
  contentClassName?: string
  contentRef?: Ref<HTMLDivElement>
  fee?: number
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
  onSubmit,
  noContentPadding,
  actionDivider = false,
  additionalActionsNodeMobilePosition = 'top',
  className,
  contentClassName,
  contentRef,
  fee,
}) => {
  const isCompact = size === 'compact'
  const smMatch = useMediaMatch('sm')
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const hasAdditionalActionsNode = !!additionalActionsNode || fee !== undefined
  const buttonSize = isCompact ? 'small' : 'medium'

  return (
    <DialogContainer onSubmit={onSubmit} size={size} className={className} onClick={(e) => e.stopPropagation()}>
      {(title || onExitClick) && (
        <Header dividers={dividers}>
          <HeaderContent>
            <Text as="h1" variant={isCompact ? 'h300' : smMatch ? 'h500' : 'h400'}>
              {title}
            </Text>
          </HeaderContent>
          {onExitClick && (
            <Button icon={<SvgActionClose />} aria-label="close modal" onClick={onExitClick} variant="tertiary" />
          )}
        </Header>
      )}
      <Content
        data-scroll-lock-scrollable
        noContentPadding={noContentPadding}
        className={contentClassName}
        ref={contentRef}
      >
        {children}
      </Content>
      {hasFooter && (
        <Footer
          dividers={dividers || actionDivider}
          data-has-additional-actions={!!hasAdditionalActionsNode}
          additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}
        >
          {fee !== undefined && <Fee amount={fee} variant="h200" color="colorTextStrong" />}
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
