import create from 'zustand'

import { createId } from '@/utils/createId'

type SnackbarIconType = 'success' | 'error' | 'info' | 'warning'

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
}

type Snackbar = {
  id: string
} & Omit<DisplaySnackbarArgs, 'time'>

export type SnackbarState = {
  snackbars: Snackbar[]
  displaySnackbar: (args: DisplaySnackbarArgs, onActionClick?: () => void) => string
  updateSnackbar: (id: string, opts: Omit<DisplaySnackbarArgs, 'id'>) => void
  closeSnackbar: (id: string) => void
}

export const useSnackbar = create<SnackbarState>((set) => ({
  snackbars: [],
  updateSnackbar: (id, opts) => {
    set((state) => ({
      ...state,
      snackbars: state.snackbars.map((snackbar) => (snackbar.id === id ? { ...snackbar, ...opts } : snackbar)),
    }))
  },
  closeSnackbar: (id) =>
    set((state) => ({ ...state, snackbars: state.snackbars.filter((snackbar) => snackbar.id !== id) })),
  displaySnackbar: ({ timeout, customId, onExit, ...args }) => {
    const id = customId ?? createId()
    set((state) => ({
      ...state,
      snackbars: [...state.snackbars, { id, ...args }],
    }))
    if (timeout) {
      onExit?.()
      setTimeout(() => {
        set((state) => ({
          ...state,
          snackbars: state.snackbars.filter((snackbar) => snackbar.id !== id),
        }))
      }, timeout)
    }
    return id
  },
}))
