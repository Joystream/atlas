import React, { useState } from 'react'

import { createStore } from '@/store'

type TestStoreState = {
  newCount: number
  test: number
}

type TestStoreActions = {
  increment: (by: number) => void
  decrement: (by: number) => void
}

const useStore = createStore<TestStoreState, TestStoreActions>(
  {
    state: { newCount: 0, test: 1 },
    actionsFactory: (set) => ({
      increment: (by) =>
        set((draft) => {
          draft.newCount += by
        }),
      decrement: (by) =>
        set((draft) => {
          draft.newCount -= by
        }),
    }),
  },
  {
    persist: {
      key: 'test',
      whitelist: ['newCount'],
      version: 1,
      migrate: (oldState, oldVersion, storageValue) => {
        if (!oldVersion && oldVersion !== 0) {
          // legacy store
          return {
            newCount: storageValue.count,
          }
        } else if (oldVersion === 0) {
          return {
            newCount: oldState.count,
          }
        }
      },
    },
  }
)

export const PlaygroundCommonStore: React.FC = () => {
  const count = useStore((store) => store.newCount)
  const { increment, decrement } = useStore((store) => store.actions)

  const [value, setValue] = useState('')

  const valueAsNumber = parseInt(value)

  return (
    <div>
      <p>Count: {count}</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => increment(valueAsNumber)}>Increment</button>
      <button onClick={() => decrement(valueAsNumber)}>Decrement</button>
    </div>
  )
}
