import React from 'react'
import {
  StyledActionBarContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledDetailsTextContainer,
  StyledButtonsContainer,
  StyledSecondaryButton,
} from './ActionBar.style'
import { Button, Icon } from '@/shared/components'
import type { IconType } from '../Icon'

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  primaryButtonText?: string
  detailsText?: string
  detailsTextIcon?: IconType
  secondaryButtonText?: string
  secondaryButtonIcon?: IconType
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  detailsText,
  detailsTextIcon,
  secondaryButtonIcon,
  onConfirmClick,
  onCancelClick,
}) => {
  return (
    <StyledActionBarContainer>
      <StyledInfoContainer>
        <StyledPrimaryText>{primaryText}</StyledPrimaryText>
        <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
      </StyledInfoContainer>
      <StyledButtonsContainer>
        {detailsText && (
          <StyledDetailsTextContainer>
            {detailsText} <Icon name={detailsTextIcon || 'info'} />
          </StyledDetailsTextContainer>
        )}
        {secondaryButtonText && (
          <StyledSecondaryButton icon={secondaryButtonIcon} onClick={onCancelClick}>
            {secondaryButtonText}
          </StyledSecondaryButton>
        )}
        {primaryButtonText && <Button onClick={onConfirmClick}>{primaryButtonText}</Button>}
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
