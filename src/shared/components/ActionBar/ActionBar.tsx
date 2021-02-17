import React from 'react'
import {
  StyledActionBarContainer,
  StyledTextContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledButtonsContainer,
  StyledSecondaryButton,
} from './ActionBar.style'
import { Button } from '@/shared/components'

const ActionBar = () => {
  return (
    <StyledActionBarContainer>
      <StyledTextContainer>
        <StyledPrimaryText>Fee: 0.2 Joy</StyledPrimaryText>
        <StyledSecondaryText>Every change to the blockchain requires making a nominal transaction.</StyledSecondaryText>
      </StyledTextContainer>
      <StyledButtonsContainer>
        <StyledSecondaryButton variant="secondary">Save As Draft</StyledSecondaryButton>
        <Button>Start Publishing</Button>
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
