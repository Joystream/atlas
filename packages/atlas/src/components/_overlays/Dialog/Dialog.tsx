import BN from 'bn.js'
import { FC, FormEvent, PropsWithChildren, ReactNode, Ref } from 'react'

import { SvgActionClose } from '@/assets/icons'
import { Fee } from '@/components/Fee'
import { Text } from '@/components/Text'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Content,
  DialogContainer,
  DialogSize,
  Footer,
  FooterButtonsContainer,
  Header,
  HeaderContent,
} from './Dialog.styles'

export type DialogButtonProps = {
  text: string
  onClick?: (e?: MouseEvent) => void
} & Omit<ButtonProps, 'children'>

export type DialogProps = PropsWithChildren<{
  title?: ReactNode
  dividers?: boolean
  size?: DialogSize
  primaryButton?: DialogButtonProps | JSX.Element
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
  fee?: BN
  stretchButtons?: boolean
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
  stretchButtons = false,
}) => {
  const isCompact = size === 'compact'
  const smMatch = useMediaMatch('sm')
  const hasFooter = !!additionalActionsNode || !!primaryButton || !!secondaryButton
  const hasAdditionalActionsNode = !!additionalActionsNode || fee !== undefined
  const buttonSize = isCompact ? 'small' : 'medium'

  return (
    <DialogContainer
      onSubmit={onSubmit}
      as={onSubmit ? 'form' : undefined}
      size={size}
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
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
        hasFooter={hasFooter}
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
          data-has-additional-actions={hasAdditionalActionsNode}
          additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}
        >
          {fee !== undefined && <Fee amount={fee} variant="h200" color="colorTextStrong" />}
          {additionalActionsNode}
          <FooterButtonsContainer
            stretchButtons={stretchButtons}
            additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}
          >
            {secondaryButton && (
              <Button variant={secondaryButton.variant || 'secondary'} size={buttonSize} fullWidth {...secondaryButton}>
                {secondaryButton.text}
              </Button>
            )}
            {primaryButton &&
              ('text' in primaryButton ? (
                <Button variant={primaryButton.variant || 'primary'} size={buttonSize} fullWidth {...primaryButton}>
                  {primaryButton.text}
                </Button>
              ) : (
                (primaryButton as JSX.Element)
              ))}
          </FooterButtonsContainer>
        </Footer>
      )}
    </DialogContainer>
  )
}
