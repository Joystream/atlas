import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { StyledIcon, StyledTitleText, StyledDescriptionText, Spinner } from './MessageDialog.style'
import * as Icons from '@/shared/icons'

export type MessageDialogProps = {
  title: string
  description: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'spinner'
} & ActionDialogProps

const MessageDialog: React.FC<MessageDialogProps> = ({
  title,
  description,
  variant = 'info',
  ...actionDialogProps
}) => {
  const hasIcon = ['success', 'warning', 'error'].includes(variant)
  const icon = `dialog-${variant}` as Icons.IconType
  const hasSpinner = variant === 'spinner'

  return (
    <ActionDialog {...actionDialogProps}>
      {hasIcon && <StyledIcon name={icon} />}
      {hasSpinner && <Spinner />}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
    </ActionDialog>
  )
}

export default MessageDialog
