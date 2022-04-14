import { useCallback } from 'react'

import { ErrorCode, ExtrinsicResult, ExtrinsicStatus, JoystreamLibErrorType } from '@/joystream-lib'
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
  onError?: () => void
  snackbarSuccessMessage?: SnackbarSuccessMessage
}
type HandleTransactionFn = <T extends ExtrinsicResult>(opts: HandleTransactionOpts<T>) => Promise<boolean>

const TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000
const TX_COMPLETED_SNACKBAR_TIMEOUT = 5000

export const useTransaction = (): HandleTransactionFn => {
  const { addBlockAction, setDialogStep, setErrorCode } = useTransactionManagerStore((state) => state.actions)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()

  return useCallback(
    async ({ preProcess, txFactory, onTxFinalize, onTxSync, snackbarSuccessMessage, onError }) => {
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
        const result = await txFactory(setDialogStep)
        if (onTxFinalize) {
          onTxFinalize(result).catch((error) =>
            SentryLogger.error('Failed transaction finalize callback', 'TransactionManager', error)
          )
        }

        setDialogStep(ExtrinsicStatus.Syncing)
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
            setDialogStep(ExtrinsicStatus.Completed)
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
        onError?.()
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
          // extract error code from error message
          const errorCode = Object.keys(ErrorCode).find((key) => error.message.includes(key))

          SentryLogger.error(
            errorCode === ErrorCode.VoucherSizeLimitExceeded ? 'Voucher size limit exceeded' : 'Extrinsic failed',
            'TransactionManager',
            error
          )
          setDialogStep(ExtrinsicStatus.Error)
          errorCode && setErrorCode(errorCode as ErrorCode)
        } else {
          setDialogStep(ExtrinsicStatus.Error)
          SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', error)
        }
        return false
      }
    },
    [addBlockAction, displaySnackbar, nodeConnectionStatus, setDialogStep, setErrorCode]
  )
}
