import React from 'react'
import {
  StyledActionBarContainer,
  StyledInnerContainer,
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

const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  (
    {
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
    },
    ref
  ) => {
    return (
      <StyledActionBarContainer ref={ref} className={className}>
        <StyledInnerContainer>
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
        </StyledInnerContainer>
      </StyledActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'

export default ActionBar
