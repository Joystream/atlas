import React, { useEffect, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { MintNftFirstTimeModal } from '@/components/_overlays/MintNftFirstTimeModal'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { ExtrinsicStatus } from '@/joystream-lib'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { useTransactionManagerStore } from './store'

const SNACKBAR_ID = 'transaction-snackbar'

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    extrinsicStatus,
    showFirstMintDialog,
    errorCode,
    isMinimized,
    actions: { removeOldBlockActions, setShowFistMintDialog, setErrorCode, setExtrinsicStatus },
  } = useTransactionManagerStore((state) => state)
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const [lastIndexedBlock, setLastIndexedBlock] = useState(0)
  const { displaySnackbar, updateSnackbar, closeSnackbar } = useSnackbar()

  const handleFirstMintDialogClose = () => {
    updateDismissedMessages('first-mint')
    setShowFistMintDialog(false)
  }

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) {
        return
      }

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      setLastIndexedBlock(indexerHead)
    },
  })

  // run due actions
  useEffect(() => {
    const syncedActions = blockActions.filter((action) => lastIndexedBlock >= action.targetBlock)

    if (!syncedActions.length) {
      return
    }

    syncedActions.forEach((action) => {
      try {
        action.callback()
      } catch (e) {
        SentryLogger.error('Failed to execute tx sync callback', 'TransactionManager', e)
      }
    })

    removeOldBlockActions(lastIndexedBlock)
  }, [blockActions, lastIndexedBlock, removeOldBlockActions])

  useEffect(() => {
    if (extrinsicStatus === ExtrinsicStatus.Unsigned && isMinimized) {
      displaySnackbar({
        customId: SNACKBAR_ID,
        title: 'Continue in Polkadot',
        description: 'To leave your comment or reaction you need to sign the transaction in Polkadot extension.',
        iconType: 'loading',
        sticked: true,
      })
    }
    if (extrinsicStatus !== ExtrinsicStatus.Unsigned && isMinimized) {
      closeSnackbar(SNACKBAR_ID)
    }
  }, [closeSnackbar, displaySnackbar, extrinsicStatus, isMinimized, updateSnackbar])

  return (
    <>
      <MintNftFirstTimeModal show={showFirstMintDialog} onClose={handleFirstMintDialogClose} />
      {!isMinimized && (
        <TransactionModal
          status={extrinsicStatus}
          onClose={() => {
            setErrorCode(null)
            setExtrinsicStatus(null)
          }}
          errorCode={errorCode}
        />
      )}
    </>
  )
}
