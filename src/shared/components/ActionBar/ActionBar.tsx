import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
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
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  primaryButton?: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps & { visible?: boolean }
  draftBadge?: ActionDialogDraftBadge
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ primaryText, secondaryText, className, primaryButton, secondaryButton, draftBadge }, ref) => {
    const smMatch = useMediaMatch('sm')
    const lgMatch = useMediaMatch('lg')

    const draftBadgeNode = draftBadge ? (
      <DraftsBadgeContainer>
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
          icon={!smMatch ? secondaryButton.icon : undefined}
          disabled={secondaryButton.disabled}
          onClick={secondaryButton.onClick}
          variant={!smMatch ? 'tertiary' : 'secondary'}
          size={!smMatch ? 'small' : 'large'}
          iconPlacement="right"
        >
          {secondaryButton.text}
        </Button>
      </CSSTransition>
    ) : null

    const primaryButtonNode = primaryButton?.text ? (
      <ActionButtonPrimary
        isMobile={!smMatch}
        disabled={primaryButton.disabled}
        onClick={primaryButton.onClick}
        size="large"
        type="submit"
      >
        {primaryButton.text}
      </ActionButtonPrimary>
    ) : null

    if (!smMatch)
      return (
        <ActionBarContainer ref={ref} className={className}>
          <FlexWrapper>
            <StyledPrimaryText variant="h6">{primaryText}</StyledPrimaryText>
            {draftBadge?.visible ? draftBadgeNode : secondaryButtonNode}
          </FlexWrapper>
          {primaryButtonNode}
        </ActionBarContainer>
      )

    return (
      <ActionBarContainer ref={ref} className={className}>
        <FlexWrapper>
          <StyledPrimaryText variant="h5">{primaryText}</StyledPrimaryText>
          {lgMatch && (
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
