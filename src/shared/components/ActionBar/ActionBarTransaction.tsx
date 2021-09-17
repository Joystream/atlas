import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ActionBar, ActionBarProps } from './ActionBar'
import { ActionBarTransactionWrapper, StyledProgressDrawer } from './ActionBarTransaction.style'

import { Step } from '../ProgressDrawer/ProgressDrawer'

export type ActionBarTransactionProps = {
  fee: number
  progressDrawerSteps?: Step[]
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

export const ActionBarTransaction = React.forwardRef<HTMLDivElement, ActionBarTransactionProps>(
  ({ fee, fullWidth, progressDrawerSteps, ...actionBarArgs }, ref) => {
    const smMatch = useMediaMatch('sm')
    const lgMatch = useMediaMatch('lg')

    const actionBarSize = lgMatch ? 'large' : smMatch ? 'medium' : 'compact'
    return (
      <ActionBarTransactionWrapper ref={ref} fullWidth={fullWidth}>
        {progressDrawerSteps?.length ? <StyledProgressDrawer steps={progressDrawerSteps} /> : null}
        <ActionBar
          {...actionBarArgs}
          size={actionBarSize}
          fullWidth={fullWidth}
          primaryText={`Fee: ${fee} Joy`}
          secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        />
      </ActionBarTransactionWrapper>
    )
  }
)

ActionBarTransaction.displayName = 'ActionBarTransaction'
