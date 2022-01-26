import { action } from '@storybook/addon-actions'
import * as React from 'react'

export interface WithValueProps<T> {
  initial: T
  actionName?: string
  children: (value: T, setValue: (value: T) => void) => React.ReactElement
}

export function WithValue<T>(props: WithValueProps<T>) {
  const [value, setValue] = React.useState<T>(props.initial)
  return props.children(value, (value) => {
    action(props.actionName || 'setValue')(value)
    setValue(value)
  })
}
