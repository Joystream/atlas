import { useApolloClient } from '@apollo/client'
import { useCallback, useEffect } from 'react'

import { MetaprotocolTransactionSuccessFieldsFragment } from '@/api/queries'
import {
  GetMetaprotocolTransactionStatusEventsDocument,
  GetMetaprotocolTransactionStatusEventsQuery,
  GetMetaprotocolTransactionStatusEventsQueryVariables,
} from '@/api/queries/__generated__/transactionEvents.generated'
import { ErrorCode, ExtrinsicResult, ExtrinsicStatus, JoystreamLibError, JoystreamLibErrorType } from '@/joystream-lib'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { wait } from '@/utils/misc'

import { useTransactionManagerStore } from './store'

import { useConfirmationModal } from '../confirmationModal'
import { useConnectionStatusStore } from '../connectionStatus'
import { useSnackbar } from '../snackbars'

type UpdateStatusFn = (status: ExtrinsicStatus | null) => void
type SnackbarSuccessMessage = {
  title: string
  description?: string
}
type HandleTransactionOpts<T extends ExtrinsicResult> = {
  txFactory: (updateStatus: UpdateStatusFn) => Promise<T>
  preProcess?: () => void | Promise<void>
  onTxFinalize?: (data: T) => Promise<unknown>
  onTxSync?: (data: T, metaStatus?: MetaprotocolTransactionSuccessFieldsFragment) => Promise<unknown>
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
  const { addBlockAction, setExtrinsicStatus, setErrorCode, setIsMinimized } = useTransactionManagerStore(
    (state) => state.actions
  )
  const extrinsicStatus = useTransactionManagerStore((state) => state.extrinsicStatus)
  const [openOngoingTransactionModal, closeOngoingTransactionModal] = useConfirmationModal()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()
  const getMetaprotocolTxStatus = useMetaprotocolTransactionStatus()

  useEffect(() => {
    if (extrinsicStatus === ExtrinsicStatus.Signed) {
      closeOngoingTransactionModal()
    }
  }, [closeOngoingTransactionModal, extrinsicStatus])

  return useCallback(
    async ({ preProcess, txFactory, onTxFinalize, onTxSync, snackbarSuccessMessage, onError, minimized = null }) => {
      try {
        if (extrinsicStatus) {
          const isUnsigned = extrinsicStatus === ExtrinsicStatus.Unsigned
          openOngoingTransactionModal({
            title: isUnsigned ? 'Sign outstanding transactions' : 'Wait for other transactions',
            type: 'informative',
            description: isUnsigned
              ? 'You have outstanding blockchain transactions waiting for you to sign them in Polkadot. Please, sign or cancel previous transactions in Polkadot to continue.'
              : 'You have other blockchain transactions which are still being processed. Please, try again in about a minute.',
            primaryButton: {
              text: 'Got it',
              onClick: () => {
                closeOngoingTransactionModal()
              },
            },
          })
          return false
        }

        setIsMinimized(!!minimized)

        if (nodeConnectionStatus !== 'connected') {
          if (!minimized) {
            setExtrinsicStatus(ExtrinsicStatus.Error)
          }
          return false
        }

        // if provided, do any preprocessing
        if (preProcess) {
          if (!minimized) {
            setExtrinsicStatus(ExtrinsicStatus.ProcessingAssets)
          }
          try {
            await preProcess()
          } catch (e) {
            SentryLogger.error('Failed transaction preprocess', 'TransactionManager', e)
            return false
          }
        }
        setExtrinsicStatus(ExtrinsicStatus.Unsigned)

        const result = await txFactory(setExtrinsicStatus)

        if (onTxFinalize) {
          onTxFinalize(result).catch((error) =>
            SentryLogger.error('Failed transaction finalize callback', 'TransactionManager', error)
          )
        }
        setExtrinsicStatus(ExtrinsicStatus.Syncing)

        const queryNodeSyncPromise = new Promise<void>((resolve, reject) => {
          const syncCallback = async () => {
            let status: MetaprotocolTransactionSuccessFieldsFragment | undefined = undefined
            try {
              if (result.transactionHash) {
                status = await getMetaprotocolTxStatus(result.transactionHash)
              }
            } catch (e) {
              reject(e)
              return
            }

            if (onTxSync) {
              try {
                await onTxSync(result, status)
              } catch (error) {
                SentryLogger.error('Failed transaction sync callback', 'TransactionManager', error)
              }
            }
            resolve()
          }
          addBlockAction({ callback: syncCallback, targetBlock: result.block })
        })

        await queryNodeSyncPromise

        setExtrinsicStatus(ExtrinsicStatus.Completed)
        snackbarSuccessMessage &&
          displaySnackbar({
            ...snackbarSuccessMessage,
            iconType: 'success',
            timeout: TX_COMPLETED_SNACKBAR_TIMEOUT,
          })

        if (minimized) {
          setExtrinsicStatus(null)
        }

        return true
      } catch (error) {
        onError?.()

        const errorName = error.name as JoystreamLibErrorType

        if (errorName === 'SignCancelledError') {
          ConsoleLogger.warn('Sign cancelled')
          setExtrinsicStatus(null)
          displaySnackbar({
            title: 'Transaction signing cancelled',
            iconType: 'warning',
            timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
          })
          return false
        }

        if (errorName === 'MetaprotocolTransactionError') {
          SentryLogger.error('Metaprotocol transaction error', 'TransactionManager', error)
          if (minimized) {
            displaySnackbar({
              title: 'Something went wrong',
              description: minimized.signErrorMessage,
              iconType: 'error',
              timeout: MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
            })
          } else {
            setExtrinsicStatus(ExtrinsicStatus.Error)
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
            setExtrinsicStatus(ExtrinsicStatus.Error)
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
            setExtrinsicStatus(ExtrinsicStatus.Error)
          }
          SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', error)
        }
        return false
      }
    },
    [
      addBlockAction,
      closeOngoingTransactionModal,
      displaySnackbar,
      extrinsicStatus,
      getMetaprotocolTxStatus,
      nodeConnectionStatus,
      openOngoingTransactionModal,
      setErrorCode,
      setExtrinsicStatus,
      setIsMinimized,
    ]
  )
}

const useMetaprotocolTransactionStatus = () => {
  const client = useApolloClient()

  const getTransactionStatus = useCallback(
    async (txHash: string) => {
      const { data } = await client.query<
        GetMetaprotocolTransactionStatusEventsQuery,
        GetMetaprotocolTransactionStatusEventsQueryVariables
      >({
        query: GetMetaprotocolTransactionStatusEventsDocument,
        variables: {
          transactionHash: txHash,
        },
      })

      return data?.metaprotocolTransactionStatusEvents[0]?.status || null
    },
    [client]
  )

  return useCallback(
    async (txHash: string): Promise<MetaprotocolTransactionSuccessFieldsFragment> => {
      let status = await getTransactionStatus(txHash)

      if (!status || status.__typename === 'MetaprotocolTransactionPending') {
        for (let i = 0; i <= RETRIES; i++) {
          ConsoleLogger.warn(`No transaction status event found - retries: ${i + 1}/${RETRIES}`)
          await wait(RETRIES_TIMEOUT)

          status = await getTransactionStatus(txHash)

          if (status?.__typename === 'MetaprotocolTransactionSuccessful') {
            break
          }
        }

        if (!status) {
          throw new JoystreamLibError({
            name: 'MetaprotocolTransactionError',
            message: 'No transaction status event found',
          })
        }
      }

      if (status.__typename !== 'MetaprotocolTransactionSuccessful') {
        throw new JoystreamLibError({
          name: 'MetaprotocolTransactionError',
          message:
            status.__typename === 'MetaprotocolTransactionErrored'
              ? status.message
              : 'Transaction still in pending state after retries',
        })
      }

      return status
    },
    [getTransactionStatus]
  )
}
