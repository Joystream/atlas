import React from 'react'
import ActionDialog from '../ActionDialog/ActionDialog'
import { TransactionDialogProps } from '../TransactionDialog/TransactionDialog'
import { StyledIcon, StyledTitleText, StyledDescriptionText } from './MessageDialog.style'
import { IconType } from '@/shared/components/Icon'

export type MessageDialogProps = {
  variant?: 'success' | 'warning' | 'error' | 'info'
} & TransactionDialogProps

const MessageDialog: React.FC<MessageDialogProps> = ({
  title,
  description,
  variant = 'info',
  ...actionDialogProps
}) => {
  const hasIcon = ['success', 'warning', 'error'].includes(variant)
  const icon = `dialog-${variant}` as IconType

  return (
    <ActionDialog {...actionDialogProps}>
      {hasIcon && <StyledIcon name={icon} />}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
    </ActionDialog>
  )
}

export default MessageDialog
