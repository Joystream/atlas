import { useCallback } from 'react'

import { useGetMetaprotocolTransactionStatusEventsLazyQuery } from '@/api/queries/__generated__/transactionEvents.generated'
import { ErrorCode, ExtrinsicResult, ExtrinsicStatus, JoystreamLibError, JoystreamLibErrorType } from '@/joystream-lib'
import { createId } from '@/utils/createId'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { wait } from '@/utils/misc'

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
  minimized?: {
    signErrorMessage: string
  }
}
type HandleTransactionFn = <T extends ExtrinsicResult>(opts: HandleTransactionOpts<T>) => Promise<boolean>

const TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000
const TX_COMPLETED_SNACKBAR_TIMEOUT = 5000
const MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000
const RETRIES_TIMEOUT = 1000
const RETRIES = 10

export const useTransaction = (): HandleTransactionFn => {
  const { addBlockAction, setDialogStep, setErrorCode, addPendingSign, removePendingSign } = useTransactionManagerStore(
    (state) => state.actions
  )
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()
  const [getTransactionStatus, { refetch: refetchTransactionStatus, data }] =
    useGetMetaprotocolTransactionStatusEventsLazyQuery({
      fetchPolicy: 'network-only',
      onError: (error) =>
        SentryLogger.error('Failed to fetch metaprotocol transaction status event', 'TransactionManager', error),
    })

  return useCallback(
    async ({ preProcess, txFactory, onTxFinalize, onTxSync, snackbarSuccessMessage, onError, minimized = null }) => {
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

        await queryNodeSyncPromise

        if (result.transactionHash) {
          await getTransactionStatus({ variables: { transactionHash: result.transactionHash } })
          const status = data?.metaprotocolTransactionStatusEvents[0]?.status

          if (status?.__typename === 'MetaprotocolTransactionErrored') {
            throw new JoystreamLibError({
              name: 'MetaprotocolTransactionError',
              message: status?.message,
              details: result,
            })
          }

          if (!status) {
            for (let i = 0; i <= RETRIES; i++) {
              ConsoleLogger.warn(`No transaction status event found - retries: ${i}/${RETRIES}`)
              await wait(RETRIES_TIMEOUT)
              const { data: refetchedData } = await refetchTransactionStatus()
              const statusAfterRefetch = refetchedData?.metaprotocolTransactionStatusEvents[0]?.status

              if (statusAfterRefetch?.__typename === 'MetaprotocolTransactionErrored') {
                throw new JoystreamLibError({
                  name: 'MetaprotocolTransactionError',
                  message: statusAfterRefetch?.message,
                  details: result,
                })
              }
              if (i === 10 && !statusAfterRefetch) {
                throw new JoystreamLibError({
                  name: 'MetaprotocolTransactionError',
                  message: 'No transaction status event found',
                  details: result,
                })
              }
              if (statusAfterRefetch) {
                break
              }
            }
          }
        }

        if (!minimized) {
          setDialogStep(ExtrinsicStatus.Completed)
        }
        snackbarSuccessMessage &&
          displaySnackbar({
            ...snackbarSuccessMessage,
            iconType: 'success',
            timeout: TX_COMPLETED_SNACKBAR_TIMEOUT,
          })

        return true
      } catch (error) {
        onError?.()
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

        if (errorName === 'MetaprotocolTransactionError') {
          SentryLogger.error('Metaprotocol transaction error', 'TransactionManager', error)
          if (!minimized) {
            setDialogStep(ExtrinsicStatus.Error)
          } else {
            displaySnackbar({
              title: 'Something went wrong',
              description: minimized.signErrorMessage,
              iconType: 'error',
              timeout: MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
            })
          }
          return false
        }

        if (errorName === 'FailedError') {
          // extract error code from error message
          const errorCode = Object.keys(ErrorCode).find((key) => error.message.includes(key)) as ErrorCode | undefined

          SentryLogger.error(
            errorCode === ErrorCode.VoucherSizeLimitExceeded ? 'Voucher size limit exceeded' : 'Extrinsic failed',
            'TransactionManager',
            error
          )
          if (!minimized) {
            setDialogStep(ExtrinsicStatus.Error)
            errorCode && setErrorCode(errorCode)
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
          SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', error)
        }
        return false
      }
    },
    [
      addBlockAction,
      addPendingSign,
      data?.metaprotocolTransactionStatusEvents,
      displaySnackbar,
      getTransactionStatus,
      nodeConnectionStatus,
      refetchTransactionStatus,
      removePendingSign,
      setDialogStep,
      setErrorCode,
    ]
  )
}
