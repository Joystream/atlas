import BN from 'bn.js'
import { forwardRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Fee } from '@/components/Fee'
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
} from './ActionBar.styles'

export type ActionDialogButtonProps = {
  text?: string
} & Omit<ButtonProps, 'children'>

type ActionDialogInfoBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  fee?: BN
  feeLoading?: boolean
  infoBadge?: ActionDialogInfoBadge
  primaryButton: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  isActive?: boolean
  className?: string
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ fee, feeLoading, isActive = true, className, primaryButton, secondaryButton, infoBadge }, ref) => {
    const smMatch = useMediaMatch('sm')

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isActive}>
        <FeeContainer>
          <Fee
            variant={smMatch ? 'h400' : 'h200'}
            withToken
            amount={BN.isBN(fee) ? fee : new BN(0)}
            loading={feeLoading}
          />
        </FeeContainer>
        {infoBadge ? (
          <DraftsBadgeContainer>
            <Text as="span" align="right" variant={smMatch ? 't200' : 't100'} color="colorText">
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
