import { ErrorCode, ExtrinsicStatus } from '@/joystream-lib'
import { createStore } from '@/store'

type ProcessedBlockAction = {
  targetBlock: number
  callback: () => void
}

export type TransactionDialogStep = ExtrinsicStatus | null

type TransactionManagerStoreState = {
  blockActions: ProcessedBlockAction[]
  dialogStep: TransactionDialogStep
  showFirstMintDialog: boolean
  errorCode: ErrorCode | null
}

type TransactionManagerStoreActions = {
  addBlockAction: (action: ProcessedBlockAction) => void
  removeOldBlockActions: (currentBlock: number) => void
  setDialogStep: (step: TransactionDialogStep) => void
  setShowFistMintDialog: (show: boolean) => void
  setErrorCode: (errorCode: ErrorCode | null) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: { blockActions: [], dialogStep: null, showFirstMintDialog: false, errorCode: null },
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
    setShowFistMintDialog: (show) =>
      set((state) => {
        state.showFirstMintDialog = show
      }),
    setErrorCode: (errorCode) =>
      set((state) => {
        state.errorCode = errorCode
      }),
  }),
})
