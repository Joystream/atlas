import React from 'react'

import { SvgGlyphInfo } from '@/shared/icons'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  DetailsIconWrapper,
  DraftsBadgeContainer,
  FlexWrapper,
  StyledPrimaryText,
  StyledSecondaryText,
} from './ActionBar.style'

import { Button, ButtonProps } from '../Button'
import { Text } from '../Text'
import { Tooltip, TooltipProps } from '../Tooltip'

export type ActionBarSize = 'large' | 'medium' | 'compact'

type ActionDialogButtonProps = {
  text?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: TooltipProps
} & Omit<ButtonProps, 'children'>

type ActionDialogDraftBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  size?: ActionBarSize
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  primaryButton?: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps & { isDraftBadgeVisible?: boolean }
  draftBadge?: ActionDialogDraftBadge
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ primaryText, secondaryText, className, primaryButton, secondaryButton, draftBadge, size = 'compact' }) => {
    const draftBadgeNode = draftBadge ? (
      <DraftsBadgeContainer size={size}>
        <Text variant="body2" secondary>
          {draftBadge.text}
        </Text>
        <DetailsIconWrapper>
          <SvgGlyphInfo />
        </DetailsIconWrapper>
      </DraftsBadgeContainer>
    ) : null

    const secondaryButtonNode = secondaryButton?.text ? (
      <Button
        icon={size === 'compact' ? secondaryButton.icon : undefined}
        disabled={secondaryButton.disabled}
        onClick={secondaryButton.onClick}
        variant={size === 'compact' ? 'tertiary' : 'secondary'}
        size={size === 'compact' ? 'small' : 'large'}
        iconPlacement="right"
      >
        {secondaryButton.text}
      </Button>
    ) : null

    const primaryButtonNode = primaryButton?.text ? (
      <ActionButtonPrimary
        actonBarSize={size}
        disabled={primaryButton.disabled}
        fullWidth={size === 'compact'}
        onClick={primaryButton.onClick}
        size="large"
        type="submit"
      >
        {primaryButton.text}
      </ActionButtonPrimary>
    ) : null

    if (size === 'compact')
      return (
        <ActionBarContainer size={size} className={className}>
          <FlexWrapper compact>
            <StyledPrimaryText variant="h6">{primaryText}</StyledPrimaryText>
            {secondaryButton?.isDraftBadgeVisible ? draftBadgeNode : secondaryButtonNode}
          </FlexWrapper>
          {primaryButtonNode}
        </ActionBarContainer>
      )
    return (
      <ActionBarContainer size={size} className={className}>
        <FlexWrapper>
          <StyledPrimaryText variant="h5">{primaryText}</StyledPrimaryText>
          {size === 'large' && (
            <StyledSecondaryText variant="body2" secondary>
              {secondaryText}
            </StyledSecondaryText>
          )}
        </FlexWrapper>
        <FlexWrapper>
          {secondaryButtonNode}
          {secondaryButton?.isDraftBadgeVisible && (
            <Tooltip arrowDisabled placement="top-end" {...draftBadge?.tooltip}>
              {draftBadgeNode}
            </Tooltip>
          )}
          {primaryButton?.text && (
            <Tooltip arrowDisabled placement="top-end" {...primaryButton.tooltip}>
              {primaryButtonNode}
            </Tooltip>
          )}
        </FlexWrapper>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
