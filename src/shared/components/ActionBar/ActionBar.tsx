import React from 'react'
import {
  StyledActionBarContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledButtonsContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from './ActionBar.style'
import type { IconType } from '../Icon'

export type ActionBarProps = {
  variant: 'primary' | 'secondary'
  primaryText?: string
  secondaryText?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  secondaryButtonIcon?: IconType
  onClickPrimaryButton?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickSecondaryButton?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionBar: React.FC<ActionBarProps> = ({
  children,
  variant,
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  secondaryButtonIcon,
  onClickPrimaryButton,
  onClickSecondaryButton,
}) => {
  const isPrimary = variant === 'primary'
  return (
    <StyledActionBarContainer>
      <StyledInfoContainer>
        {isPrimary ? (
          <>
            <StyledPrimaryText>{primaryText}</StyledPrimaryText>
            <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
          </>
        ) : (
          children
        )}
      </StyledInfoContainer>
      <StyledButtonsContainer>
        {secondaryButtonText && (
          <StyledSecondaryButton icon={secondaryButtonIcon} onClick={onClickSecondaryButton}>
            {secondaryButtonText}
          </StyledSecondaryButton>
        )}
        {primaryButtonText && (
          <StyledPrimaryButton isActionBarPrimary={isPrimary} onClick={onClickPrimaryButton}>
            {primaryButtonText}
          </StyledPrimaryButton>
        )}
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
