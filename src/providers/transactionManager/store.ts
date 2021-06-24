import { ExtrinsicStatus } from '@/joystream-lib'
import { createStore } from '@/store'

type TransactionSyncCallback = {
  targetBlock: number
  callback: () => void
}

export type TransactionDialogStep =
  | ExtrinsicStatus.ProcessingAssets
  | ExtrinsicStatus.Unsigned
  | ExtrinsicStatus.Signed
  | ExtrinsicStatus.Syncing
  | null

type TransactionManagerStoreState = {
  syncCallbacks: TransactionSyncCallback[]
  dialogStep: TransactionDialogStep
}

type TransactionManagerStoreActions = {
  addCallback: (callback: TransactionSyncCallback) => void
  removeOldCallbacks: (currentBlock: number) => void
  setDialogStep: (step: TransactionDialogStep) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: { syncCallbacks: [], dialogStep: null },
  actionsFactory: (set) => ({
    addCallback: (callback) =>
      set((draft) => {
        draft.syncCallbacks.push(callback)
      }),
    removeOldCallbacks: (currentBlock) =>
      set((draft) => {
        draft.syncCallbacks = draft.syncCallbacks.filter((cb) => cb.targetBlock > currentBlock)
      }),
    setDialogStep: (step) =>
      set((state) => {
        state.dialogStep = step
      }),
  }),
})
