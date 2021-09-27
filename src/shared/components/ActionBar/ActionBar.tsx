import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SvgGlyphInfo } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  ActionButtonPrimaryTooltip,
  DetailsIconWrapper,
  DraftsBadgeContainer,
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
  primaryButton: ActionDialogButtonProps
  isEdit?: boolean
  primaryText?: string
  secondaryText?: string
  fullWidth?: boolean
  className?: string
  secondaryButton?: ActionDialogButtonProps & { visible?: boolean }
  draftBadge?: ActionDialogDraftBadge
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ primaryText, secondaryText, className, primaryButton, secondaryButton, draftBadge, isEdit }, ref) => {
    const smMatch = useMediaMatch('sm')

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isEdit ? !primaryButton?.disabled : true}>
        <StyledPrimaryText variant={!smMatch ? 'h6' : 'h5'}>{primaryText}</StyledPrimaryText>
        <StyledSecondaryText variant="body2" secondary>
          {secondaryText}
        </StyledSecondaryText>
        {draftBadge?.visible ? (
          <Tooltip arrowDisabled placement="top-end" {...draftBadge?.tooltip}>
            <DraftsBadgeContainer>
              <Text variant="body2" secondary>
                {draftBadge.text}
              </Text>
              <DetailsIconWrapper>
                <SvgGlyphInfo />
              </DetailsIconWrapper>
            </DraftsBadgeContainer>
          </Tooltip>
        ) : secondaryButton ? (
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
        ) : null}
        <ActionButtonPrimaryTooltip arrowDisabled placement="top-end" {...primaryButton?.tooltip}>
          <ActionButtonPrimary
            disabled={primaryButton.disabled}
            onClick={primaryButton.onClick}
            size="large"
            type="submit"
          >
            {primaryButton.text}
          </ActionButtonPrimary>
        </ActionButtonPrimaryTooltip>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
