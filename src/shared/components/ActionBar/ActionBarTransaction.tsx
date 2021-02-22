import React from 'react'
import ActionBar, { ActionBarProps } from './ActionBar'

type ActionBarTransactionProps = {
  fee: number
} & ActionBarProps

const ActionBarTransaction: React.FC<ActionBarTransactionProps> = ({ fee, primaryButtonText, ...actionBarArgs }) => {
  return (
    <ActionBar
      {...actionBarArgs}
      primaryText={`Fee: ${fee} Joy`}
      secondaryText="Every change in the blockchain state requires paying a nominal fee."
      primaryButtonText={`${primaryButtonText} (${fee} JOY)`}
    />
  )
}

export default ActionBarTransaction
