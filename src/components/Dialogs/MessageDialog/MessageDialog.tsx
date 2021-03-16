import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { StyledIcon, StyledTitleText, StyledDescriptionText, Spinner } from './MessageDialog.style'

export type MessageDialogProps = {
  title: string
  description: string
  icon?: 'success' | 'error' | 'warning' | 'info'
  spinner?: boolean
} & ActionDialogProps

const MessageDialog: React.FC<MessageDialogProps> = ({ title, description, icon, spinner, ...actionDialogProps }) => {
  return (
    <ActionDialog {...actionDialogProps}>
      {icon && !spinner && <StyledIcon name={icon} width="30px" />}
      {spinner && <Spinner />}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
    </ActionDialog>
  )
}

export default MessageDialog
