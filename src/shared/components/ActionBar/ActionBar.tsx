import React, { ReactNode } from 'react'

import { SvgGlyphInfo } from '@/shared/icons'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  DetailsContainer,
  DetailsIconWrapper,
  FlexWrapper,
  StyledPrimaryText,
  StyledSecondaryText,
} from './ActionBar.style'

import { Button } from '../Button'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export type ActionBarSize = 'large' | 'medium' | 'compact'

export type ActionBarProps = {
  size?: ActionBarSize
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  primaryButtonText?: string
  primaryButtonDisabled?: boolean
  primaryButtonOnClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  primaryButtonTooltip?: {
    text: string
    headerText?: string
    icon?: boolean
  }
  secondaryButtonText?: string
  secondaryButtonDisabled?: boolean
  secondaryButtonVariant?: 'draft' | 'default'
  secondaryButtonIcon?: ReactNode
  secondaryButtonOnClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  detailsText?: string
  detailsTextTooltip?: {
    text: string
    headerText?: string
    icon?: boolean
  }
}

export const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  className,
  primaryButtonText,
  primaryButtonDisabled,
  primaryButtonOnClick,
  primaryButtonTooltip,
  secondaryButtonText,
  secondaryButtonDisabled,
  secondaryButtonIcon,
  secondaryButtonVariant,
  secondaryButtonOnClick,
  detailsTextTooltip,
  detailsText,
  size = 'compact',
}) => {
  const detailsNode =
    secondaryButtonVariant === 'draft' ? (
      <DetailsContainer size={size}>
        <Text variant="body2" secondary>
          {detailsText}
        </Text>
        <DetailsIconWrapper>
          <SvgGlyphInfo />
        </DetailsIconWrapper>
      </DetailsContainer>
    ) : null

  const secondaryButtonNode =
    secondaryButtonVariant === 'default' && secondaryButtonText ? (
      <Button
        icon={size === 'compact' ? secondaryButtonIcon : undefined}
        disabled={secondaryButtonDisabled}
        onClick={secondaryButtonOnClick}
        variant={size === 'compact' ? 'tertiary' : 'secondary'}
        size={size === 'compact' ? 'small' : 'large'}
        iconPlacement="right"
      >
        {secondaryButtonText}
      </Button>
    ) : null

  const primaryButtonNode = primaryButtonText ? (
    <ActionButtonPrimary
      actonBarSize={size}
      disabled={primaryButtonDisabled}
      fullWidth={size === 'compact'}
      onClick={primaryButtonOnClick}
      size="large"
      type="submit"
    >
      {primaryButtonText}
    </ActionButtonPrimary>
  ) : null

  if (size === 'compact')
    return (
      <ActionBarContainer size={size} className={className}>
        <FlexWrapper>
          <StyledPrimaryText variant="h6">{primaryText}</StyledPrimaryText>
          {secondaryButtonNode}
          {detailsNode}
        </FlexWrapper>
        {primaryButtonNode}
      </ActionBarContainer>
    )
  return (
    <ActionBarContainer size={size} className={className}>
      <FlexWrapper>
        <StyledPrimaryText variant="h6">{primaryText}</StyledPrimaryText>
        {size === 'large' && (
          <StyledSecondaryText variant="body2" secondary>
            {secondaryText}
          </StyledSecondaryText>
        )}
      </FlexWrapper>
      <FlexWrapper>
        {secondaryButtonNode}
        {secondaryButtonVariant === 'draft' && detailsText && (
          <Tooltip arrowDisabled text={detailsTextTooltip?.text} placement="top-end">
            {detailsNode}
          </Tooltip>
        )}
        {primaryButtonText && (
          <Tooltip
            arrowDisabled
            headerText={primaryButtonTooltip?.headerText}
            text={primaryButtonTooltip?.text}
            icon={primaryButtonTooltip?.icon}
            placement="top-end"
          >
            {primaryButtonNode}
          </Tooltip>
        )}
      </FlexWrapper>
    </ActionBarContainer>
  )
}
