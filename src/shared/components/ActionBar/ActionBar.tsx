import React from 'react'
import {
  StyledActionBarContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledTooltip,
  StyledDetailsTextContainer,
  StyledButtonsContainer,
} from './ActionBar.style'
import { Button, Icon } from '@/shared/components'
import type { IconType } from '../Icon'

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  primaryButtonText?: string
  detailsText?: string
  tooltipText?: string
  detailsTextIcon?: IconType
  secondaryButtonText?: string
  secondaryButtonIcon?: IconType
  className?: string
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  detailsText,
  tooltipText,
  detailsTextIcon,
  secondaryButtonIcon,
  className,
  onConfirmClick,
  onCancelClick,
}) => {
  return (
    <StyledActionBarContainer className={className}>
      <StyledInfoContainer>
        <StyledPrimaryText>{primaryText}</StyledPrimaryText>
        <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
      </StyledInfoContainer>
      <StyledButtonsContainer>
        {detailsText && tooltipText && (
          <StyledTooltip text={tooltipText} above right>
            <StyledDetailsTextContainer>
              {detailsText} <Icon name={detailsTextIcon || 'info'} />
            </StyledDetailsTextContainer>
          </StyledTooltip>
        )}
        {secondaryButtonText && !detailsText && (
          <Button icon={secondaryButtonIcon} onClick={onCancelClick} variant="tertiary">
            {secondaryButtonText}
          </Button>
        )}
        {primaryButtonText && <Button onClick={onConfirmClick}>{primaryButtonText}</Button>}
      </StyledButtonsContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
