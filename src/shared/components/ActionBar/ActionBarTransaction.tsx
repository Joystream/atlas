import React from 'react'
import ActionBar, { ActionBarProps } from './ActionBar'

export type ActionBarTransactionProps = {
  fee: number
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

const ActionBarTransaction: React.FC<ActionBarTransactionProps> = ({ fee, ...actionBarArgs }) => {
  return (
    <ActionBar
      {...actionBarArgs}
      primaryText={`Fee: ${fee} Joy`}
      secondaryText="Every change in the blockchain state requires paying a nominal fee."
    />
  )
}

export default ActionBarTransaction
