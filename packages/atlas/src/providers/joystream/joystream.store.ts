import { createStore } from '@/store'

type JoystreamStoreState = {
  currentBlock: number
  currentBlockMsTimestamp: number
}

type JoystreamStoreActions = {
  setCurrentBlock: (block: number) => void
  setCurrentBlockMsTimestamp: (timestamp: number) => void
}

export const useJoystreamStore = createStore<JoystreamStoreState, JoystreamStoreActions>({
  state: {
    currentBlock: 0,
    currentBlockMsTimestamp: 0,
  },
  actionsFactory: (set) => ({
    setCurrentBlock: (block) =>
      set((state) => {
        state.currentBlock = block
      }),
    setCurrentBlockMsTimestamp: (timestamp) =>
      set((state) => {
        state.currentBlockMsTimestamp = timestamp
      }),
  }),
})
