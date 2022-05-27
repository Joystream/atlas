import { action } from '@storybook/addon-actions'
import { ReactElement, useState } from 'react'

export interface WithValueProps<T> {
  initial: T
  actionName?: string
  children: (value: T, setValue: (value: T) => void) => ReactElement
}

export function WithValue<T>(props: WithValueProps<T>) {
  const [value, setValue] = useState<T>(props.initial)
  return props.children(value, (value) => {
    action(props.actionName || 'setValue')(value)
    setValue(value)
  })
}
