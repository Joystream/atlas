import { createStore } from '@/store'

export type SearchState = {
  searchOpen: boolean
}

export type SearchStoreActions = {
  setSearchOpen: (open: boolean) => void
}

const INITIAL_STATE: SearchState = {
  searchOpen: false,
}

export const useSearchStore = createStore<SearchState, SearchStoreActions>({
  state: INITIAL_STATE,
  actionsFactory: (set) => ({
    setSearchOpen: (open) => {
      set((state) => {
        state.searchOpen = open
      })
    },
  }),
})
