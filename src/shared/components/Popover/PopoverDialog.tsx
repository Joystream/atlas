import React from 'react'

import { PopoverProps } from './Popover'
import { ContentContainer, FooterContainer, HeaderContainer, PopoverContainer } from './PopoverDialog.styles'

type PopoverDialogProps = {
  header?: string
  content: React.ReactNode
  footer?: React.ReactNode
  dividers?: boolean
} & PopoverProps

export const PopoverDialog: React.FC<PopoverDialogProps> = ({
  header,
  content,
  footer,
  dividers = false,
  children,
  ...rest
}) => {
  return (
    <PopoverContainer
      {...rest}
      hasHeader={!!header}
      content={
        <>
          {header && (
            <HeaderContainer dividers={dividers} variant="h6">
              {header}
            </HeaderContainer>
          )}
          <ContentContainer hasHeader={!!header} dividers={dividers}>
            {content}
          </ContentContainer>
          {footer && <FooterContainer dividers={dividers}>{footer}</FooterContainer>}
        </>
      }
    >
      {children}
    </PopoverContainer>
  )
}
