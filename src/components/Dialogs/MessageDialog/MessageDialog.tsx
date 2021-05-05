import React, { ReactNode } from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { StyledTitleText, StyledDescriptionText, MessageIconWrapper } from './MessageDialog.style'
import { SvgOutlineError, SvgOutlineSuccess, SvgOutlineWarning } from '@/shared/icons'

type DialogVariant = 'success' | 'warning' | 'error' | 'info'

export type MessageDialogProps = {
  variant?: DialogVariant
  title?: string
  description?: string
  icon?: React.ReactElement
} & ActionDialogProps

const VARIANT_TO_ICON: Record<DialogVariant, ReactNode | null> = {
  success: <SvgOutlineSuccess />,
  warning: <SvgOutlineWarning />,
  error: <SvgOutlineError />,
  info: null,
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  title,
  description,
  variant = 'info',
  icon,
  ...actionDialogProps
}) => {
  const iconNode = icon || VARIANT_TO_ICON[variant]

  return (
    <ActionDialog {...actionDialogProps}>
      {iconNode && <MessageIconWrapper>{iconNode}</MessageIconWrapper>}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
    </ActionDialog>
  )
}

export default MessageDialog
