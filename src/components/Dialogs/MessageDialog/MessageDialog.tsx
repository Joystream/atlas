import React, { ReactNode } from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { StyledTitleText, StyledDescriptionText, MessageIcon } from './MessageDialog.style'
import { SvgOutlineError, SvgOutlineSuccess, SvgOutlineWarning } from '@/shared/icons'

type DialogVariant = 'success' | 'warning' | 'error' | 'info'

export type MessageDialogProps = {
  variant?: DialogVariant
  title?: string
  description?: string
} & ActionDialogProps

// TODO: change to wrapper
const VARIANT_TO_ICON: Record<DialogVariant, ReactNode | null> = {
  success: <MessageIcon as={SvgOutlineSuccess} />,
  warning: <MessageIcon as={SvgOutlineWarning} />,
  error: <MessageIcon as={SvgOutlineError} />,
  info: null,
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  title,
  description,
  variant = 'info',
  ...actionDialogProps
}) => {
  const iconNode = VARIANT_TO_ICON[variant]

  return (
    <ActionDialog {...actionDialogProps}>
      {iconNode}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
    </ActionDialog>
  )
}

export default MessageDialog
