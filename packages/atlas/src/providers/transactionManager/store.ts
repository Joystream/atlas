import { ExtrinsicStatus } from '@/joystream-lib'
import { createStore } from '@/store'

type ProcessedBlockAction = {
  targetBlock: number
  callback: () => void
}

export type TransactionDialogStep = ExtrinsicStatus | null
export type MinimizedTransaction = {
  signMessage: string
  signErrorMessage: string
}

type TransactionManagerStoreState = {
  blockActions: ProcessedBlockAction[]
  dialogStep: TransactionDialogStep
  minimized: MinimizedTransaction | null
  pendingSigns: string[]
}

type TransactionManagerStoreActions = {
  addBlockAction: (action: ProcessedBlockAction) => void
  removeOldBlockActions: (currentBlock: number) => void
  setDialogStep: (step: TransactionDialogStep) => void
  setMinimized: (minimized: MinimizedTransaction | null) => void
  addPendingSign: (id: string) => void
  removePendingSign: (id: string) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: { blockActions: [], dialogStep: null, minimized: null, pendingSigns: [] },
  actionsFactory: (set) => ({
    addBlockAction: (action) =>
      set((state) => {
        state.blockActions.push(action)
      }),
    removeOldBlockActions: (currentBlock) =>
      set((state) => {
        state.blockActions = state.blockActions.filter((action) => action.targetBlock > currentBlock)
      }),
    setDialogStep: (step) =>
      set((state) => {
        state.dialogStep = step
      }),
    setMinimized: (minimized) =>
      set((state) => {
        state.minimized = minimized
      }),
    addPendingSign: (id) =>
      set((state) => {
        state.pendingSigns = [...state.pendingSigns, id]
      }),
    removePendingSign: (id) =>
      set((state) => {
        state.pendingSigns = [...state.pendingSigns.filter((transaction) => transaction !== id)]
      }),
  }),
})
