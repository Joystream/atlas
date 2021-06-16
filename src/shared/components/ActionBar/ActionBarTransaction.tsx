import React from 'react'

import { ActionBarProps, ActionBar } from './ActionBar'
import { ActionBarTransactionWrapper, StyledCheckout } from './ActionBarTransaction.style'

import { Step } from '../Checkout/Checkout'

export type ActionBarTransactionProps = {
  fee: number
  checkoutSteps?: Step[]
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

export const ActionBarTransaction: React.FC<ActionBarTransactionProps> = ({
  fee,
  fullWidth,
  isActive,
  checkoutSteps,
  ...actionBarArgs
}) => {
  return (
    <ActionBarTransactionWrapper fullWidth={fullWidth} isActive={isActive}>
      {checkoutSteps?.length ? <StyledCheckout steps={checkoutSteps} /> : null}
      <ActionBar
        {...actionBarArgs}
        fullWidth={fullWidth}
        primaryText={`Fee: ${fee} Joy`}
        secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
      />
    </ActionBarTransactionWrapper>
  )
}
