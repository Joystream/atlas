import { forwardRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  DraftsBadgeContainer,
  FeeContainer,
  SecondaryButton,
  StyledInformation,
  StyledPrimaryText,
} from './ActionBar.styles'

import { NumberFormat } from '../NumberFormat'

export type ActionDialogButtonProps = {
  text?: string
} & Omit<ButtonProps, 'children'>

type ActionDialogInfoBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  fee?: number
  infoBadge?: ActionDialogInfoBadge
  primaryButton: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  isActive?: boolean
  className?: string
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ fee, isActive = true, className, primaryButton, secondaryButton, infoBadge }, ref) => {
    const smMatch = useMediaMatch('sm')

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isActive}>
        <FeeContainer>
          <StyledPrimaryText as="span" variant={smMatch ? 'h400' : 'h200'}>
            Fee: <NumberFormat as="span" format="short" withToken value={fee ?? 0} />
          </StyledPrimaryText>
          <StyledInformation
            multiline
            icon
            placement="top-end"
            headerText="Blockchain transaction"
            text="This action requires a blockchain transaction, which comes with a fee."
          />
        </FeeContainer>
        {infoBadge ? (
          <DraftsBadgeContainer>
            <Text as="span" align="right" variant={smMatch ? 't200' : 't100'} color="default">
              {infoBadge?.text}
            </Text>
            <StyledInformation multiline placement="top-end" {...infoBadge.tooltip} />
          </DraftsBadgeContainer>
        ) : null}
        <CSSTransition
          in={!!secondaryButton}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <SecondaryButton {...secondaryButton} variant="secondary" size={smMatch ? 'large' : 'medium'}>
            {secondaryButton?.text}
          </SecondaryButton>
        </CSSTransition>
        <ActionButtonPrimary
          {...primaryButton}
          secondaryButtonExists={!!secondaryButton}
          size={smMatch ? 'large' : 'medium'}
          type="submit"
        >
          {primaryButton.text}
        </ActionButtonPrimary>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
