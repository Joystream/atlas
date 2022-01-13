import { useCallback } from 'react'

import { ExtrinsicFailedError, ExtrinsicResult, ExtrinsicSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { TransactionDialogStep, useTransactionManagerStore } from './store'

import { useConnectionStatusStore } from '../connectionStatus'
import { useSnackbar } from '../snackbars'

type UpdateStatusFn = (status: TransactionDialogStep) => void
type SuccessMessage = {
  title: string
  description: string
}
type HandleTransactionOpts<T> = {
  txFactory: (updateStatus: UpdateStatusFn) => Promise<ExtrinsicResult<T>>
  preProcess?: () => void | Promise<void>
  onTxFinalize?: (data: T) => Promise<unknown>
  onTxSync?: (data: T) => Promise<unknown>
  successMessage: SuccessMessage
}
type HandleTransactionFn = <T>(opts: HandleTransactionOpts<T>) => Promise<boolean>

const TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000

export const useTransaction = (): HandleTransactionFn => {
  const { addBlockAction, setDialogStep } = useTransactionManagerStore((state) => state.actions)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()

  return useCallback(
    async ({ preProcess, txFactory, onTxFinalize, onTxSync }) => {
      try {
        if (nodeConnectionStatus !== 'connected') {
          setDialogStep(ExtrinsicStatus.Error)
          return false
        }

        // if provided, do any preprocessing
        if (preProcess) {
          setDialogStep(ExtrinsicStatus.ProcessingAssets)
          try {
            await preProcess()
          } catch (e) {
            SentryLogger.error('Failed transaction preprocess', 'TransactionManager', e)
            return false
          }
        }

        // run txFactory and prompt for signature
        setDialogStep(ExtrinsicStatus.Unsigned)
        const { data: txData, block } = await txFactory(setDialogStep)
        if (onTxFinalize) {
          onTxFinalize(txData).catch((error) =>
            SentryLogger.error('Failed transaction finalize callback', 'TransactionManager', error)
          )
        }

        setDialogStep(ExtrinsicStatus.Syncing)
        const queryNodeSyncPromise = new Promise<void>((resolve) => {
          const syncCallback = async () => {
            if (onTxSync) {
              try {
                await onTxSync(txData)
              } catch (error) {
                SentryLogger.error('Failed transaction sync callback', 'TransactionManager', error)
              }
            }
            resolve()
          }
          addBlockAction({ callback: syncCallback, targetBlock: block })
        })

        return new Promise((resolve) => {
          queryNodeSyncPromise.then(() => {
            setDialogStep(ExtrinsicStatus.Completed)
            resolve(true)
          })
        })
      } catch (error) {
        if (error instanceof ExtrinsicSignCancelledError) {
          ConsoleLogger.warn('Sign cancelled')
          setDialogStep(null)
          displaySnackbar({
            title: 'Transaction signing cancelled',
            iconType: 'warning',
            timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
          })
          return false
        }

        if (error instanceof ExtrinsicFailedError && !error.voucherSizeLimitExceeded) {
          SentryLogger.error('Extrinsic failed', 'TransactionManager', error)
        } else {
          SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', error)
        }
        if (error.voucherSizeLimitExceeded) {
          SentryLogger.message('Voucher size limit exceeded', 'TransactionManager', error)
          setDialogStep(ExtrinsicStatus.VoucherSizeLimitExceeded)
        } else {
          setDialogStep(ExtrinsicStatus.Error)
        }
        return false
      }
    },
    [addBlockAction, displaySnackbar, nodeConnectionStatus, setDialogStep]
  )
}
