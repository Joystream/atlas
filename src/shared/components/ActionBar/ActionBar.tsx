import React from 'react'

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

import { Button, ButtonProps } from '../Button'
import { Text } from '../Text'
import { Tooltip, TooltipProps } from '../Tooltip'

export type ActionBarSize = 'large' | 'medium' | 'compact'

type ActionDialogButtonProps = {
  text?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  isDraftButton?: boolean
  tooltip?: TooltipProps
} & Omit<ButtonProps, 'children'>

export type ActionBarProps = {
  size?: ActionBarSize
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  primaryButton?: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  detailsText?: string
  detailsTextTooltip?: {
    text: string
    headerText?: string
    icon?: boolean
  }
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({
    primaryText,
    secondaryText,
    className,
    primaryButton,
    secondaryButton,
    detailsTextTooltip,
    detailsText,
    size = 'compact',
  }) => {
    const detailsNode = secondaryButton?.isDraftButton ? (
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
      !secondaryButton?.isDraftButton && secondaryButton?.text ? (
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
            {secondaryButtonNode}
            {detailsNode}
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
          {secondaryButton?.isDraftButton && detailsText && (
            <Tooltip arrowDisabled text={detailsTextTooltip?.text} placement="top-end">
              {detailsNode}
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
