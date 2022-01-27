import { ReactNode } from 'react'

import { createStore } from '@/store'
import { createId } from '@/utils/createId'

export type SnackbarIconType = 'success' | 'error' | 'info' | 'warning' | 'uploading'

export type DisplaySnackbarArgs = {
  customId?: string
  timeout?: number
  variant?: 'primary' | 'secondary'
  iconType?: SnackbarIconType
  title: string
  description?: string
  onExit?: () => void
  actionText?: string
  onActionClick?: () => void
  actionIcon?: ReactNode
}

type Snackbar = {
  id: string
} & DisplaySnackbarArgs

export type SnackbarStoreState = {
  snackbars: Snackbar[]
}

type SnackbarStoreActions = {
  displaySnackbar: (args: DisplaySnackbarArgs, onActionClick?: () => void) => string
  updateSnackbar: (id: string, opts: Omit<DisplaySnackbarArgs, 'id'>) => void
  closeSnackbar: (id: string) => void
  cancelSnackbarTimeout: (id: string) => void
}

export const useSnackbarStore = createStore<SnackbarStoreState, SnackbarStoreActions>({
  state: {
    snackbars: [],
  },
  actionsFactory: (set) => ({
    updateSnackbar: (id, opts) => {
      set((state) => {
        const snackbarIdx = state.snackbars.findIndex((s) => s.id === id)
        if (snackbarIdx === -1) return
        state.snackbars[snackbarIdx] = { ...state.snackbars[snackbarIdx], ...opts }
      })
    },
    closeSnackbar: (id) =>
      set((state) => {
        state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== id)
      }),
    cancelSnackbarTimeout: (id) => {
      set((state) => {
        state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== id)
      })
    },
    displaySnackbar: ({ timeout, customId, onExit, ...args }) => {
      const id = customId ?? createId()
      set((state) => {
        state.snackbars.push({ id, ...args })
      })
      if (timeout) {
        onExit?.()
        setTimeout(() => {
          set((state) => {
            state.snackbars.shift()
          })
        }, timeout)
      }
      return id
    },
  }),
})
