import React from 'react'
import {
  StyledContainer,
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledIcon,
  StyledButtonContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
  dialogTransitions,
} from './Dialog.style'

export type DialogProps = {
  title?: string
  content: string
  primaryButton?: string
  secondaryButton?: string
  icon?: 'success' | 'failure' | null
  exitButton?: boolean
  handleExit?: () => void
  handlePrimaryButton?: () => void
  handleSecondaryButton?: () => void
}

const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  icon,
  exitButton,
  handleExit,
  handlePrimaryButton,
  handleSecondaryButton,
}) => {
  return (
    <StyledContainer css={dialogTransitions}>
      {icon || exitButton ? (
        <StyledHeadRow>
          {icon && <StyledIcon name={icon} />}
          {exitButton && <StyledIcon marginLeft={!icon} name="times-white" onClick={handleExit} />}
        </StyledHeadRow>
      ) : (
        ''
      )}

      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledContentText variant="body2">{content}</StyledContentText>
      <StyledButtonContainer>
        {secondaryButton && (
          <StyledSecondaryButton variant="secondary" onClick={handleSecondaryButton}>
            {secondaryButton}
          </StyledSecondaryButton>
        )}
        {primaryButton && <StyledPrimaryButton onClick={handlePrimaryButton}>{primaryButton}</StyledPrimaryButton>}
      </StyledButtonContainer>
    </StyledContainer>
  )
}

export default Dialog
