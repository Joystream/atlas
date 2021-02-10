import React from 'react'
import {
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledButtonsContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from './ActionDialog.style'
import { Icon } from '@/shared/components'

type MouseEvent = React.MouseEvent<HTMLButtonElement>

export type DialogProps = {
  title?: string
  content: string
  primaryButton?: string
  secondaryButton?: string
  icon?: 'success' | 'failure'
  handlePrimaryButton?: (e: MouseEvent) => void
  handleSecondaryButton?: (e: MouseEvent) => void
  showDialog?: boolean
}

const GeneralDialog: React.FC<DialogProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  icon,
  handlePrimaryButton,
  handleSecondaryButton,
}) => {
  return (
    <>
      {icon ? <StyledHeadRow>{icon && <Icon name={icon} width="30px" />}</StyledHeadRow> : null}
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      <StyledContentText variant="body2">{content}</StyledContentText>
      <StyledButtonsContainer>
        {secondaryButton && (
          <StyledSecondaryButton variant="secondary" onClick={handleSecondaryButton}>
            {secondaryButton}
          </StyledSecondaryButton>
        )}
        {primaryButton && <StyledPrimaryButton onClick={handlePrimaryButton}>{primaryButton}</StyledPrimaryButton>}
      </StyledButtonsContainer>
    </>
  )
}

export default GeneralDialog
