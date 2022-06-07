import { ErrorCode, ExtrinsicStatus } from '@/joystream-lib'
import { createStore } from '@/store'

type ProcessedBlockAction = {
  targetBlock: number
  callback: () => void
}

type TransactionManagerStoreState = {
  blockActions: ProcessedBlockAction[]
  extrinsicStatus: ExtrinsicStatus | null
  showFirstMintDialog: boolean
  isMinimized: boolean
  errorCode: ErrorCode | null
}

type TransactionManagerStoreActions = {
  addBlockAction: (action: ProcessedBlockAction) => void
  removeOldBlockActions: (currentBlock: number) => void
  setExtrinsicStatus: (step: ExtrinsicStatus | null) => void
  setIsMinimized: (isMinimized: boolean) => void
  setShowFistMintDialog: (show: boolean) => void
  setErrorCode: (errorCode: ErrorCode | null) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: {
    blockActions: [],
    extrinsicStatus: null,
    showFirstMintDialog: false,
    isMinimized: false,
    errorCode: null,
  },
  actionsFactory: (set) => ({
    addBlockAction: (action) => {
      return set((state) => {
        state.blockActions.push(action)
      })
    },
    removeOldBlockActions: (currentBlock) =>
      set((state) => {
        state.blockActions = state.blockActions.filter((action) => action.targetBlock > currentBlock)
      }),
    setExtrinsicStatus: (step) =>
      set((state) => {
        state.extrinsicStatus = step
      }),
    setIsMinimized: (isMinimized) =>
      set((state) => {
        state.isMinimized = isMinimized
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
