import React, { ReactNode } from 'react'

import { SvgGlyphInfo } from '@/shared/icons'

import {
  StyledActionBarContainer,
  StyledInnerContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledButtonsContainer,
  DetailsIconWrapper,
  DetailsContainer,
} from './ActionBar.style'

import { Button } from '../Button'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  primaryButtonText?: string
  detailsText?: string
  tooltipText?: string
  detailsTextIcon?: ReactNode
  isActive?: boolean
  fullWidth?: boolean
  secondaryButtonText?: string
  secondaryButtonIcon?: ReactNode
  className?: string
  disabled?: boolean
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  detailsText,
  tooltipText,
  detailsTextIcon,
  secondaryButtonIcon,
  className,
  disabled,
  onConfirmClick,
  onCancelClick,
}) => {
  return (
    <StyledActionBarContainer className={className}>
      <StyledInnerContainer>
        <StyledInfoContainer>
          <StyledPrimaryText>{primaryText}</StyledPrimaryText>
          <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
        </StyledInfoContainer>
        <StyledButtonsContainer>
          {detailsText && tooltipText && (
            <Tooltip text={tooltipText} placement="top-end" offsetX={-6}>
              <DetailsContainer>
                <Text variant="body2" secondary>
                  {detailsText}
                </Text>
                <DetailsIconWrapper>{detailsTextIcon || <SvgGlyphInfo />}</DetailsIconWrapper>
              </DetailsContainer>
            </Tooltip>
          )}
          {secondaryButtonText && !detailsText && (
            <Button icon={secondaryButtonIcon} onClick={onCancelClick} variant="secondary" size="large">
              {secondaryButtonText}
            </Button>
          )}
          {primaryButtonText && (
            <Button disabled={disabled} onClick={onConfirmClick} size="large" type="submit">
              {primaryButtonText}
            </Button>
          )}
        </StyledButtonsContainer>
      </StyledInnerContainer>
    </StyledActionBarContainer>
  )
}
