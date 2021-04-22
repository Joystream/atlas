import React from 'react'
import ActionBar, { ActionBarProps } from './ActionBar'

export type ActionBarTransactionProps = {
  fee: number
  fullWidth?: boolean
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

const ActionBarTransaction: React.FC<ActionBarTransactionProps> = ({ fee, fullWidth, ...actionBarArgs }) => {
  return (
    <ActionBar
      {...actionBarArgs}
      fullWidth={fullWidth}
      primaryText={`Fee: ${fee} Joy`}
      secondaryText="Every change in the blockchain state requires paying a nominal fee."
    />
  )
}

export default ActionBarTransaction
