import { createStore } from '@/utils/store'

export type MiscStoreState = {
  openedContexMenuId?: string
}

type MiscStoreActions = {
  setOpenedContextMenuId: (id: string) => void
}

export const useMiscStore = createStore<MiscStoreState, MiscStoreActions>({
  state: {
    openedContexMenuId: '',
  },
  actionsFactory: (set) => ({
    setOpenedContextMenuId: (id) => {
      set((state) => {
        state.openedContexMenuId = id
      })
    },
  }),
})
