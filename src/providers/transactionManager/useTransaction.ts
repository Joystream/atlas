import { ExtrinsicFailedError, ExtrinsicResult, ExtrinsicSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { TransactionDialogStep, useTransactionManagerStore } from './store'

import { useConnectionStatusStore } from '../connectionStatus'
import { useDialog } from '../dialogs'
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

  const [openErrorDialog, closeErrorDialog] = useDialog({
    variant: 'error',
    title: 'Something went wrong...',
    description:
      'Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help.',
    secondaryButton: {
      text: 'Close',
      onClick: () => {
        closeErrorDialog()
      },
    },
    onExitClick: () => {
      closeErrorDialog()
    },
  })

  const [openCompletedDialog, closeCompletedDialog] = useDialog()

  return async ({ preProcess, txFactory, onTxFinalize, onTxSync, successMessage }) => {
    try {
      if (nodeConnectionStatus !== 'connected') {
        openErrorDialog()
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
        onTxFinalize(txData).catch((e) =>
          SentryLogger.error('Failed transaction finalize callback', 'TransactionManager', e)
        )
      }

      setDialogStep(ExtrinsicStatus.Syncing)
      const queryNodeSyncPromise = new Promise<void>((resolve) => {
        const syncCallback = async () => {
          if (onTxSync) {
            try {
              await onTxSync(txData)
            } catch (e) {
              SentryLogger.error('Failed transaction sync callback', 'TransactionManager', e)
            }
          }
          resolve()
        }
        addBlockAction({ callback: syncCallback, targetBlock: block })
      })

      return new Promise((resolve) => {
        const handleDialogClose = () => {
          closeCompletedDialog()
          resolve(true)
        }

        queryNodeSyncPromise.then(() => {
          setDialogStep(null)
          openCompletedDialog({
            variant: 'success',
            title: successMessage.title,
            description: successMessage.description,
            secondaryButton: {
              text: 'Close',
              onClick: handleDialogClose,
            },
            onExitClick: handleDialogClose,
          })
        })
      })
    } catch (e) {
      if (e instanceof ExtrinsicSignCancelledError) {
        ConsoleLogger.warn('Sign cancelled')
        setDialogStep(null)
        displaySnackbar({
          title: 'Transaction signing cancelled',
          iconType: 'warning',
          timeout: TX_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
        })
        return false
      }

      if (e instanceof ExtrinsicFailedError) {
        SentryLogger.error('Extrinsic failed', 'TransactionManager', e)
      } else {
        SentryLogger.error('Unknown sendExtrinsic error', 'TransactionManager', e)
      }
      setDialogStep(null)
      openErrorDialog()
      return false
    }
  }
}
