import { createStore } from '@/utils/store'

export type SearchState = {
  searchOpen: boolean
  searchQuery: string
}

export type SearchStoreActions = {
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
}

const INITIAL_STATE: SearchState = {
  searchOpen: false,
  searchQuery: '',
}

export const useSearchStore = createStore<SearchState, SearchStoreActions>({
  state: INITIAL_STATE,
  actionsFactory: (set) => ({
    setSearchOpen: (open) => {
      set((state) => {
        state.searchOpen = open
      })
    },
    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query
      })
    },
  }),
})
