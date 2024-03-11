import { createStore } from '@/utils/store'

type JoystreamStoreState = {
  currentBlock: number
  currentBlockMsTimestamp: number
  sessionTokenPrice: number | null
}

type JoystreamStoreActions = {
  setCurrentBlock: (block: number) => void
  setCurrentBlockMsTimestamp: (timestamp: number) => void
  setSessionTokenPrice: (price: number) => void
}

export const useJoystreamStore = createStore<JoystreamStoreState, JoystreamStoreActions>({
  state: {
    currentBlock: 0,
    currentBlockMsTimestamp: 0,
    sessionTokenPrice: null,
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
    setSessionTokenPrice: (price) =>
      set((state) => {
        state.sessionTokenPrice = price
      }),
  }),
})
