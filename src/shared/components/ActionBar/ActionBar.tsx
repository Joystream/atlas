import React from 'react'
import {
  StyledActionBarContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledButtonsContainer,
  StyledSecondaryButton,
} from './ActionBar.style'
import { Button } from '@/shared/components'

export type ActionBarProps = {
  variant: 'primary' | 'secondary'
  primaryText: string
  secondaryText: string
  primaryButtonText: string
  secondaryButtonText: string
}

const ActionBar: React.FC<ActionBarProps> = ({
  variant,
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
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
        ) : null}
      </StyledInfoContainer>
      <StyledButtonsContainer>
        <StyledSecondaryButton variant="secondary">{secondaryButtonText}</StyledSecondaryButton>
        <Button>{primaryButtonText}</Button>
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
