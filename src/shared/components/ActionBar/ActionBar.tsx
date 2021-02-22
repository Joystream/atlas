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
  detailsTextIcon: IconType
  secondaryButtonText?: string
  secondaryButtonIcon?: IconType
  onClickPrimaryButton?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickSecondaryButton?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  detailsText,
  detailsTextIcon,
  secondaryButtonIcon,
  onClickPrimaryButton,
  onClickSecondaryButton,
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
            {detailsText} <Icon name={detailsTextIcon} />
          </StyledDetailsTextContainer>
        )}
        {secondaryButtonText && (
          <StyledSecondaryButton icon={secondaryButtonIcon} onClick={onClickSecondaryButton}>
            {secondaryButtonText}
          </StyledSecondaryButton>
        )}
        {primaryButtonText && <Button onClick={onClickPrimaryButton}>{primaryButtonText}</Button>}
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
