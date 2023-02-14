import { createStore } from '@/utils/store'

type BottomNavState = {
  open: boolean
}

type BottomNavActions = {
  setOpen: (open: boolean) => void
}

const INITIAL_STATE = {
  open: false,
}

export const useBottomNavStore = createStore<BottomNavState, BottomNavActions>({
  state: INITIAL_STATE,
  actionsFactory: (set) => ({
    setOpen: (open) => {
      set((state) => {
        state.open = open
      })
    },
  }),
})
