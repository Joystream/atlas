import React from 'react'

import { PopoverProps } from './Popover'
import { ContentContainer, FooterContainer, HeaderContainer, PopoverContainer } from './PopoverDialog.styles'

type PopoverDialogProps = {
  header?: string
  content: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
} & PopoverProps

export const PopoverDialog: React.FC<PopoverDialogProps> = ({
  header,
  content,
  footer,
  scrollable = false,
  children,
  ...rest
}) => {
  return (
    <PopoverContainer
      {...rest}
      content={
        <>
          {header && (
            <HeaderContainer isScrollable={scrollable} variant="h6">
              {header}
            </HeaderContainer>
          )}
          <ContentContainer isScrollable={scrollable}>{content}</ContentContainer>
          {footer && <FooterContainer isScrollable={scrollable}>{footer}</FooterContainer>}
        </>
      }
    >
      {children}
    </PopoverContainer>
  )
}
