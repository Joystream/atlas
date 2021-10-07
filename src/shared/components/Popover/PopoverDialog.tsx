import React from 'react'

import { PopoverProps } from './Popover'
import { ContentContainer, FooterContainer, Header, PopoverContainer } from './PopoverDialog.styles'

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
      content={
        <>
          {header && (
            <Header dividers={dividers} variant="h6">
              {header}
            </Header>
          )}
          <ContentContainer hasHeader={!!header}>{content}</ContentContainer>
          {footer && <FooterContainer dividers={dividers}>{footer}</FooterContainer>}
        </>
      }
    >
      {children}
    </PopoverContainer>
  )
}
