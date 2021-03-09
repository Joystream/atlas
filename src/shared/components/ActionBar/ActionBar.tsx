import React from 'react'
import {
  StyledActionBarContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledTooltip,
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
  tooltipText?: string
  detailsTextIcon?: IconType
  secondaryButtonText?: string
  secondaryButtonIcon?: IconType
  renderInfo?: React.ReactNode
  renderButtons?: React.ReactNode
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
  renderInfo,
  renderButtons,
  onConfirmClick,
  onCancelClick,
}) => {
  return (
    <StyledActionBarContainer>
      {renderInfo || (
        <StyledInfoContainer>
          <StyledPrimaryText>{primaryText}</StyledPrimaryText>
          <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
        </StyledInfoContainer>
      )}
      {renderButtons || (
        <StyledButtonsContainer>
          {detailsText && tooltipText && (
            <StyledTooltip text={tooltipText} above right>
              <StyledDetailsTextContainer>
                {detailsText} <Icon name={detailsTextIcon || 'info'} />
              </StyledDetailsTextContainer>
            </StyledTooltip>
          )}
          {secondaryButtonText && !detailsText && (
            <StyledSecondaryButton icon={secondaryButtonIcon} onClick={onCancelClick}>
              {secondaryButtonText}
            </StyledSecondaryButton>
          )}
          {primaryButtonText && <Button onClick={onConfirmClick}>{primaryButtonText}</Button>}
        </StyledButtonsContainer>
      )}
    </StyledActionBarContainer>
  )
}

export default ActionBar
