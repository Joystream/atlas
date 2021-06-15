import create, { State, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { SnackbarState, useSnackbar } from './snackbars'
import { UploadStoreState, useUploadsManagerStore } from './uploads'

const ZUSTAND_LOCAL_STORAGE_KEY = 'uploads_zustand'

export type RootState = SnackbarState & UploadStoreState

export const combineStateCreators = <TState extends State>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...stateCreators: StateCreator<any>[]
): StateCreator<TState> => (set, get, api) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let values: any = {}

  stateCreators.forEach((sc) => {
    values = Object.assign({}, values, sc(set, get, api))
  })
  return values
}

export const useStore = create<RootState>(
  persist(combineStateCreators(useSnackbar, useUploadsManagerStore), {
    name: ZUSTAND_LOCAL_STORAGE_KEY,
    whitelist: ['uploadsState'],
  })
)
