import React from 'react'
import {
  StyledContainer,
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledButtonContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from './Dialog.style'
import { Icon } from '@/shared/components'

export type DialogProps = {
  title?: string
  content: string
  primaryButton?: string
  secondaryButton?: string
  icon?: 'success' | 'failure' | null
  exitButton?: boolean
}

const Dialog: React.FC<DialogProps> = ({ title, content, primaryButton, secondaryButton, icon, exitButton }) => {
  return (
    <StyledContainer>
      {icon || exitButton ? (
        <StyledHeadRow>
          {icon && <Icon name={icon} />}
          {exitButton && <Icon name="times-white" />}
        </StyledHeadRow>
      ) : (
        ''
      )}

      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledContentText variant="body2">{content}</StyledContentText>
      <StyledButtonContainer>
        {secondaryButton && <StyledSecondaryButton variant="secondary">{secondaryButton}</StyledSecondaryButton>}
        {primaryButton && <StyledPrimaryButton>{primaryButton}</StyledPrimaryButton>}
      </StyledButtonContainer>
    </StyledContainer>
  )
}

export default Dialog
