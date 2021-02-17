import { usePersonalData } from '@/hooks'
import React from 'react'
import Icon from '../Icon'
import { MessageWrapper, MessageTitle, MessageButton, MessageDescription } from './DismissibleMessage.style'

export type DismissibleMessageProps = {
  title?: string
  description?: string
  id: string
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const DismissibleMessage: React.FC<DismissibleMessageProps> = ({ title, description, onClose }) => {
  const data = usePersonalData()
  return (
    <MessageWrapper>
      <MessageTitle variant="h6">
        <Icon name="warning" />
        {title}
      </MessageTitle>
      <MessageButton onClick={onClose}>
        <Icon name="times" />
      </MessageButton>
      <MessageDescription variant="body2">{description}</MessageDescription>
    </MessageWrapper>
  )
}

export default DismissibleMessage
