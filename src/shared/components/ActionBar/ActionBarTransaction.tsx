import React from 'react'
import { Step } from '../Checkout/Checkout'
import ActionBar, { ActionBarProps } from './ActionBar'
import { ActionBarTransactionWrapper, StyledCheckout } from './ActionBarTransaction.style'

export type ActionBarTransactionProps = {
  fee: number
  checkoutSteps?: Step[]
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

const ActionBarTransaction: React.FC<ActionBarTransactionProps> = ({
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
        secondaryText="Every change in the blockchain state requires paying a nominal fee."
      />
    </ActionBarTransactionWrapper>
  )
}

export default ActionBarTransaction
