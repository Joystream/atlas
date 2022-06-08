import { createStore } from '@/store'

type CurrentBlockStoreState = {
  currentBlock: number
  currentBlockMsTimestamp: number
}

type CurrentBlockStoreActions = {
  setCurrentBlock: (block: number) => void
  setCurrentBlockMsTimestamp: (timestamp: number) => void
}

export const useCurrentBlockStore = createStore<CurrentBlockStoreState, CurrentBlockStoreActions>({
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
