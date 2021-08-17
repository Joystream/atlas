import React from 'react'

import { ActionBar, ActionBarProps } from './ActionBar'
import { ActionBarTransactionWrapper, StyledProgressDrawer } from './ActionBarTransaction.style'

import { Step } from '../ProgressDrawer/ProgressDrawer'

export type ActionBarTransactionProps = {
  fee: number
  progressDrawerSteps?: Step[]
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

export const ActionBarTransaction = React.forwardRef<HTMLDivElement, ActionBarTransactionProps>(
  ({ fee, fullWidth, isActive, progressDrawerSteps, ...actionBarArgs }, ref) => {
    return (
      <ActionBarTransactionWrapper ref={ref} fullWidth={fullWidth} isActive={isActive}>
        {progressDrawerSteps?.length ? <StyledProgressDrawer steps={progressDrawerSteps} /> : null}
        <ActionBar
          {...actionBarArgs}
          fullWidth={fullWidth}
          primaryText={`Fee: ${fee} Joy`}
          secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        />
      </ActionBarTransactionWrapper>
    )
  }
)

ActionBarTransaction.displayName = 'ActionBarTransaction'
