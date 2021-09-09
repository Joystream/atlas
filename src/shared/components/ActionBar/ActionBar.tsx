import React, { ReactNode } from 'react'

import { SvgGlyphInfo } from '@/shared/icons'

import {
  DetailsContainer,
  DetailsIconWrapper,
  StyledActionBarContainer,
  StyledButtonsContainer,
  StyledInfoContainer,
  StyledInnerContainer,
  StyledPrimaryText,
  StyledSecondaryText,
} from './ActionBar.style'

import { Button } from '../Button'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  primaryButtonTooltipText?: {
    headerText: string
    text: string
    icon: boolean
  }
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
  primaryButtonTooltipText,
}) => {
  const renderButton = () =>
    primaryButtonText ? (
      <Button disabled={disabled} onClick={onConfirmClick} size="large" type="submit">
        {primaryButtonText}
      </Button>
    ) : null

  return (
    <StyledActionBarContainer className={className}>
      <StyledInnerContainer>
        <StyledInfoContainer>
          <StyledPrimaryText>{primaryText}</StyledPrimaryText>
          <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
        </StyledInfoContainer>
        <StyledButtonsContainer>
          {detailsText && tooltipText && (
            <Tooltip arrowDisabled text={tooltipText} placement="top-end">
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
          {primaryButtonTooltipText ? (
            <Tooltip
              arrowDisabled
              headerText={primaryButtonTooltipText?.headerText}
              text={primaryButtonTooltipText?.text}
              icon={primaryButtonTooltipText?.icon}
              placement="top-end"
            >
              {renderButton()}
            </Tooltip>
          ) : (
            <>{renderButton()}</>
          )}
        </StyledButtonsContainer>
      </StyledInnerContainer>
    </StyledActionBarContainer>
  )
}
