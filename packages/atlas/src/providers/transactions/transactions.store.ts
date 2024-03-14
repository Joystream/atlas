import { TransactionType } from '@/components/ChangeNowModal/steps/types'
import { createStore } from '@/utils/store'

import { Transaction } from './transactions.types'

type ProcessedBlockAction = {
  targetBlock: number
  callback: () => void
}

type TransactionManagerStoreState = {
  blockActions: ProcessedBlockAction[]
  transactions: Record<string, Transaction>
  changeNowModal: TransactionType | null
}

type TransactionManagerStoreActions = {
  addBlockAction: (action: ProcessedBlockAction) => void
  removeOldBlockActions: (currentBlock: number) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Transaction) => void
  removeTransaction: (id: string) => void
  setChangeNowModal: (type: TransactionType | null) => void
}

export const useTransactionManagerStore = createStore<TransactionManagerStoreState, TransactionManagerStoreActions>({
  state: {
    blockActions: [],
    transactions: {},
    changeNowModal: null,
  },
  actionsFactory: (set) => ({
    setChangeNowModal: (type) =>
      set((state) => {
        state.changeNowModal = type
      }),
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
  }),
})
