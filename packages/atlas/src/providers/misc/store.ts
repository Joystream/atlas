import { createStore } from '@/utils/store'

export type MiscStoreState = {
  openedContexMenuId?: string
  isAdminModalOpen?: boolean
}

type MiscStoreActions = {
  setOpenedContextMenuId: (id: string) => void
  setAdminModalOpen: (value: boolean) => void
}

export const useMiscStore = createStore<MiscStoreState, MiscStoreActions>({
  state: {
    openedContexMenuId: '',
    isAdminModalOpen: false,
  },
  actionsFactory: (set) => ({
    setOpenedContextMenuId: (id) => {
      set((state) => {
        state.openedContexMenuId = id
      })
    },
    setAdminModalOpen: (value) => {
      set((state) => {
        state.isAdminModalOpen = value
      })
    },
  }),
})
