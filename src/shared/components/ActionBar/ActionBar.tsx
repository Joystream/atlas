import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgGlyphInfo } from '@/shared/icons'
import { transitions } from '@/shared/theme'

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
  visible?: boolean
}

export type ActionBarProps = {
  size?: ActionBarSize
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  primaryButton?: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps & { visible?: boolean }
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
      <CSSTransition
        in={secondaryButton.visible}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
      >
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
      </CSSTransition>
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
            {draftBadge?.visible ? draftBadgeNode : secondaryButtonNode}
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
          {draftBadge?.visible ? (
            <Tooltip arrowDisabled placement="top-end" {...draftBadge?.tooltip}>
              {draftBadgeNode}
            </Tooltip>
          ) : (
            secondaryButtonNode
          )}
          <Tooltip arrowDisabled placement="top-end" {...primaryButton?.tooltip}>
            {primaryButtonNode}
          </Tooltip>
        </FlexWrapper>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
