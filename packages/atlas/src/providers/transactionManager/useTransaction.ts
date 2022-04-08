import { useCallback } from 'react'

import { ExtrinsicResult, ExtrinsicStatus, JoystreamLibErrorType } from '@/joystream-lib'
import { createId } from '@/utils/createId'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { TransactionDialogStep, useTransactionManagerStore } from './store'

import { useConnectionStatusStore } from '../connectionStatus'
import { useSnackbar } from '../snackbars'

type UpdateStatusFn = (status: TransactionDialogStep) => void
type SnackbarSuccessMessage = {
  title: string
  description?: string
}
type HandleTransactionOpts<T extends ExtrinsicResult> = {
  txFactory: (updateStatus: UpdateStatusFn) => Promise<T>
  preProcess?: () => void | Promise<void>
  onTxFinalize?: (data: T) => Promise<unknown>
  onTxSync?: (data: T) => Promise<unknown>
  snackbarSuccessMessage?: SnackbarSuccessMessage
  minimized?: {
    signErrorMessage: string
  }
}
type HandleTransactionFn = <T extends ExtrinsicResult>(opts: HandleTransactionOpts<T>) => Promise<boolean>

const TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000
const TX_COMPLETED_SNACKBAR_TIMEOUT = 5000
const MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000

export const useTransaction = (): HandleTransactionFn => {
  const { addBlockAction, setDialogStep, addPendingSign, removePendingSign } = useTransactionManagerStore(
    (state) => state.actions
  )
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()

  return useCallback(
    async ({ preProcess, txFactory, onTxFinalize, onTxSync, snackbarSuccessMessage, minimized = null }) => {
      const transactionId = createId()
      try {
        if (minimized) {
          addPendingSign(transactionId)
        }
        if (nodeConnectionStatus !== 'connected') {
          if (!minimized) {
            setDialogStep(ExtrinsicStatus.Error)
          }
          return false
        }

        // if provided, do any preprocessing
        if (preProcess) {
          if (!minimized) {
            setDialogStep(ExtrinsicStatus.ProcessingAssets)
          }
          try {
            await preProcess()
          } catch (e) {
            SentryLogger.error('Failed transaction preprocess', 'TransactionManager', e)
            return false
          }
        }

        // run txFactory and prompt for signature
        if (!minimized) {
          setDialogStep(ExtrinsicStatus.Unsigned)
        }
        const result = await txFactory(
          !minimized
            ? setDialogStep
            : (status) => {
                if (status === ExtrinsicStatus.Signed) {
                  removePendingSign(transactionId)
                }
              }
        )
        if (onTxFinalize) {
          onTxFinalize(result).catch((error) =>
            SentryLogger.error('Failed transaction finalize callback', 'TransactionManager', error)
          )
        }
        if (!minimized) {
          setDialogStep(ExtrinsicStatus.Syncing)
        }
        const queryNodeSyncPromise = new Promise<void>((resolve) => {
          const syncCallback = async () => {
            if (onTxSync) {
              try {
                await onTxSync(result)
              } catch (error) {
                SentryLogger.error('Failed transaction sync callback', 'TransactionManager', error)
              }
            }
            resolve()
          }
          addBlockAction({ callback: syncCallback, targetBlock: result.block })
        })

        return new Promise((resolve) => {
          queryNodeSyncPromise.then(() => {
            if (!minimized) {
              setDialogStep(ExtrinsicStatus.Completed)
            }
            snackbarSuccessMessage &&
              displaySnackbar({
                ...snackbarSuccessMessage,
                iconType: 'success',
                timeout: TX_COMPLETED_SNACKBAR_TIMEOUT,
              })
            resolve(true)
          })
        })
      } catch (error) {
        if (minimized) {
          removePendingSign(transactionId)
        }
        const errorName = error.name as JoystreamLibErrorType
        if (errorName === 'SignCancelledError') {
          ConsoleLogger.warn('Sign cancelled')
          setDialogStep(null)
          displaySnackbar({
            title: 'Transaction signing cancelled',
            iconType: 'warning',
            timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
          })
          return false
        }

        if (errorName === 'FailedError') {
          SentryLogger.error('Extrinsic failed', 'TransactionManager', error)
        } else {
          SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', error)
        }
        if (errorName === 'VoucherLimitError') {
          SentryLogger.message('Voucher size limit exceeded', 'TransactionManager', error)
          if (!minimized) {
            setDialogStep(ExtrinsicStatus.VoucherSizeLimitExceeded)
          }
        } else {
          if (minimized) {
            displaySnackbar({
              title: 'Something went wrong',
              description: minimized.signErrorMessage,
              iconType: 'error',
              timeout: MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
            })
          } else {
            setDialogStep(ExtrinsicStatus.Error)
          }
        }
        return false
      }
    },
    [addBlockAction, addPendingSign, displaySnackbar, nodeConnectionStatus, removePendingSign, setDialogStep]
  )
}
