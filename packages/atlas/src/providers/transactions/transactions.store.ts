import { createStore } from '@/store'

import { Transaction } from './transactions.types'

type ProcessedBlockAction = {
  targetBlock: number
  callback: () => void
}

type TransactionManagerStoreState = {
  blockActions: ProcessedBlockAction[]
  transactions: Record<string, Transaction>
  showFirstMintDialog: boolean
}

type TransactionManagerStoreActions = {
  addBlockAction: (action: ProcessedBlockAction) => void
  removeOldBlockActions: (currentBlock: number) => void

  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Transaction) => void
  removeTransaction: (id: string) => void

  setShowFistMintDialog: (show: boolean) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: {
    blockActions: [],

    transactions: {},

    showFirstMintDialog: false,
  },
  actionsFactory: (set) => ({
    addBlockAction: (action) =>
      set((state) => {
        state.blockActions.push(action)
      }),
    removeOldBlockActions: (currentBlock) =>
      set((state) => {
        state.blockActions = state.blockActions.filter((action) => action.targetBlock > currentBlock)
      }),

    addTransaction: (transaction) =>
      set((state) => {
        state.transactions[transaction.id] = transaction
      }),
    updateTransaction: (id, transaction) =>
      set((state) => {
        state.transactions[id] = transaction
      }),
    removeTransaction: (id) =>
      set((state) => {
        delete state.transactions[id]
      }),

    setShowFistMintDialog: (show) =>
      set((state) => {
        state.showFirstMintDialog = show
      }),
  }),
})
