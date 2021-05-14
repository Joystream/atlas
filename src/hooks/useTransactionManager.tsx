import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ExtrinsicResult, ExtrinsicSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { useSnackbar } from '@/hooks/useSnackbar'
import useConnectionStatus from './useConnectionStatus'

type UpdateStatusFn = (status: ExtrinsicStatus) => void
type SuccessMessage = {
  title: string
  description: string
}
type HandleTransactionOpts<T> = {
  txFactory: (updateStatus: UpdateStatusFn) => Promise<ExtrinsicResult<T>>
  preProcess?: () => Promise<void>
  onTxFinalize?: (data: T) => void
  onTxSync?: (data: T) => void
  onTxClose?: (completed: boolean) => void
  successMessage: SuccessMessage
}

type TransactionManagerContextValue = {
  handleTransaction: <T>(opts: HandleTransactionOpts<T>) => Promise<void>
  fee: number
}

const TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000

const TransactionManagerContext = React.createContext<TransactionManagerContextValue | undefined>(undefined)
TransactionManagerContext.displayName = 'TransactionManagerContext'

export const TransactionManagerProvider: React.FC = ({ children }) => {
  const [status, setStatus] = useState<ExtrinsicStatus | null>(null)
  const [finalizationBlock, setFinalizationBlock] = useState<number | null>(null)
  const [syncCallback, setSyncCallback] = useState<(() => void) | null>(null)
  const [dialogCloseCallback, setDialogCloseCallback] = useState<(() => void) | null>(null)
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ title: '', description: '' })

  // Keep persistent subscription to the query node. If this proves problematic for some reason we can skip until in Syncing
  const { queryNodeState } = useQueryNodeStateSubscription()
  const { nodeConnectionStatus } = useConnectionStatus()

  const { displaySnackbar } = useSnackbar()

  useEffect(() => {
    if (!queryNodeState || status !== ExtrinsicStatus.Syncing || !finalizationBlock) {
      return
    }

    if (queryNodeState.indexerHead >= finalizationBlock) {
      setStatus(ExtrinsicStatus.Completed)
      syncCallback?.()
    }
  }, [queryNodeState, finalizationBlock, syncCallback, status])

  const reset = () => {
    setStatus(null)
    setFinalizationBlock(null)
    setSyncCallback(null)
    setDialogCloseCallback(null)
  }

  const handleDialogClose = useCallback(() => {
    dialogCloseCallback?.()
    reset()
  }, [dialogCloseCallback])

  const handleTransaction = async <T,>({
    preProcess,
    txFactory,
    onTxFinalize,
    onTxSync,
    onTxClose,
    successMessage,
  }: HandleTransactionOpts<T>) => {
    try {
      if (nodeConnectionStatus !== 'connected') {
        setStatus(ExtrinsicStatus.Error)
        return
      }
      setSuccessMessage(successMessage)
      // set up fallback dialog close callback
      setDialogCloseCallback(() => () => onTxClose?.(false))

      // if provided, do any preprocessing
      if (preProcess) {
        setStatus(ExtrinsicStatus.ProcessingAssets)
        await preProcess()
      }

      // run txFactory and prompt for signature
      setStatus(ExtrinsicStatus.Unsigned)
      const { data, block } = await txFactory(setStatus)

      // set up query node sync
      setStatus(ExtrinsicStatus.Syncing)
      setFinalizationBlock(block)
      setSyncCallback(() => () => onTxSync?.(data))

      // set up dialog close callback
      setDialogCloseCallback(() => () => onTxClose?.(true))

      // call tx callback
      onTxFinalize?.(data)
    } catch (e) {
      if (e instanceof ExtrinsicSignCancelledError) {
        console.warn('Sign cancelled')
        setStatus(null)
        displaySnackbar({
          title: 'Transaction signing cancelled',
          iconType: 'warning',
          timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
        })
      } else {
        console.error(e)
        setStatus(ExtrinsicStatus.Error)
      }
    }
  }

  return (
    <TransactionManagerContext.Provider value={{ handleTransaction, fee: 0 }}>
      {children}
      <TransactionDialog
        status={status}
        successTitle={successMessage.title}
        successDescription={successMessage.description}
        onClose={handleDialogClose}
      />
    </TransactionManagerContext.Provider>
  )
}

export const useTransactionManager = () => {
  const context = useContext(TransactionManagerContext)
  if (!context) {
    throw new Error(`useTransactionManager must be used within TransactionManagerContext.`)
  }
  return context
}
