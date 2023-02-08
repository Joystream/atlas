import { ReactNode } from 'react'

import { createStore } from '@/store'
import { createId } from '@/utils/createId'

export type SnackbarIconType = 'success' | 'error' | 'info' | 'warning' | 'uploading' | 'loading' | 'token'

export type DisplaySnackbarArgs = {
  customId?: string
  timeout?: number
  iconType?: SnackbarIconType
  title: string
  description?: string
  onExit?: () => void
  actionText?: string
  onActionClick?: () => void
  actionIcon?: ReactNode
  sticked?: boolean
}

type Snackbar = {
  id: string
  timeoutId?: number
} & DisplaySnackbarArgs

export type SnackbarStoreState = {
  snackbars: Snackbar[]
}

type SnackbarStoreActions = {
  displaySnackbar: (args: DisplaySnackbarArgs, onActionClick?: () => void) => string
  updateSnackbar: (id: string, opts: Omit<DisplaySnackbarArgs, 'id'>) => void
  closeSnackbar: (id: string) => void
  cancelSnackbarTimeout: (id: string) => void
  restartSnackbarTimeout: (id: string) => void
}

export const useSnackbarStore = createStore<SnackbarStoreState, SnackbarStoreActions>({
  state: {
    snackbars: [],
  },
  actionsFactory: (set, get) => ({
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

    displaySnackbar: ({ timeout = 4000, customId, onExit, ...args }) => {
      const id = customId ?? createId()
      set((state) => {
        state.snackbars.push({ id, timeout, ...args })
      })
      if (timeout) {
        onExit?.()
        const timeoutId = window.setTimeout(() => {
          set((state) => {
            state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== id)
          })
        }, timeout)
        set((state) => {
          const snackbarIdx = state.snackbars.findIndex((snackbar) => snackbar.id === id)
          state.snackbars[snackbarIdx].timeoutId = timeoutId
        })
      }
      return id
    },
    cancelSnackbarTimeout: (id) => {
      const snackbar = get().snackbars.find((snackbar) => snackbar.id === id)
      window.clearTimeout(snackbar?.timeoutId)
    },
    restartSnackbarTimeout: (id) => {
      const snackbar = get().snackbars.find((snackbar) => snackbar.id === id)
      if (snackbar?.timeout) {
        window.setTimeout(() => {
          set((state) => {
            state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== id)
          })
        }, snackbar.timeout)
      }
    },
  }),
})
