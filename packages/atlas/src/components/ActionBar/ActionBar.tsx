import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { SvgActionInformative, SvgControlsCancel } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  ActionButtonPrimaryTooltip,
  DetailsIconWrapper,
  DraftsBadgeContainer,
  EditSecondaryButton,
  NFTBottomWrapper,
  NFTTopWrapper,
  SecondaryButton,
  StyledPrimaryText,
  StyledSecondaryText,
} from './ActionBar.styles'

export type ActionDialogButtonProps = {
  text?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: TooltipProps
} & Omit<ButtonProps, 'children'>

type ActionDialogDraftBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarVariant = 'new' | 'edit' | 'nft'

export type ActionBarProps = {
  variant?: ActionBarVariant
  primaryButton: ActionDialogButtonProps
  primaryText?: string
  secondaryText?: string
  className?: string
  secondaryButton?: ActionDialogButtonProps & { visible?: boolean }
  draftBadge?: ActionDialogDraftBadge
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ primaryText, secondaryText, className, primaryButton, secondaryButton, draftBadge, variant = 'new' }, ref) => {
    const smMatch = useMediaMatch('sm')

    const textNode = (
      <>
        <StyledPrimaryText variant={!smMatch ? 'h300' : 'h400'}>{primaryText}</StyledPrimaryText>
        <StyledSecondaryText variant="t200" secondary>
          {secondaryText}
        </StyledSecondaryText>
      </>
    )

    const primaryButtonNode = (
      <ActionButtonPrimaryTooltip arrowDisabled placement="top-end" {...primaryButton?.tooltip}>
        <ActionButtonPrimary {...primaryButton} size="large" type="submit">
          {primaryButton.text}
        </ActionButtonPrimary>
      </ActionButtonPrimaryTooltip>
    )

    const secondaryButtonNode = (
      <CSSTransition
        in={secondaryButton?.visible}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
      >
        <SecondaryButton {...secondaryButton} variant="secondary" size="large">
          {secondaryButton?.text}
        </SecondaryButton>
      </CSSTransition>
    )

    const draftNode = draftBadge ? (
      <Tooltip arrowDisabled placement="top-end" {...draftBadge?.tooltip}>
        <DraftsBadgeContainer>
          <Text variant="t200" secondary>
            {draftBadge?.text}
          </Text>
          <DetailsIconWrapper>
            <SvgActionInformative />
          </DetailsIconWrapper>
        </DraftsBadgeContainer>
      </Tooltip>
    ) : null

    const getActionBarVariant = (variant: ActionBarVariant) => {
      switch (variant) {
        case 'new':
          return (
            <>
              {textNode}
              {draftNode}
              {primaryButtonNode}
            </>
          )
        case 'edit':
          return (
            <>
              {textNode}
              <EditSecondaryButton
                {...secondaryButton}
                icon={!smMatch ? <SvgControlsCancel width={16} height={16} /> : undefined}
                variant={!smMatch ? 'tertiary' : 'secondary'}
                size={!smMatch ? 'small' : 'large'}
                iconPlacement="right"
              >
                {secondaryButton?.text}
              </EditSecondaryButton>
              {primaryButtonNode}
            </>
          )
        case 'nft':
          return smMatch ? (
            <>
              {textNode}
              {draftNode}
              {secondaryButtonNode}
              {primaryButtonNode}
            </>
          ) : (
            <>
              <NFTTopWrapper>
                {textNode}
                {draftNode}
              </NFTTopWrapper>
              <NFTBottomWrapper>
                {secondaryButtonNode}
                {primaryButtonNode}
              </NFTBottomWrapper>
            </>
          )
      }
    }

    return (
      <ActionBarContainer
        variant={variant}
        ref={ref}
        className={className}
        isActive={variant === 'edit' ? !primaryButton?.disabled : true}
      >
        {getActionBarVariant(variant)}
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
