import { useApolloClient } from '@apollo/client'
import { FC, useCallback, useState } from 'react'

import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries/__generated__/nfts.generated'
import { ActionBarProps } from '@/components/ActionBar'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { absoluteRoutes } from '@/config/routes'
import useAnalytics from '@/hooks/useSegmentAnalytics'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { openInNewTab } from '@/utils/browser'
import { ConsoleLogger } from '@/utils/logs'

import { NftForm, NftFormData, NftFormStatus } from './NftForm'

const SUCCESS_SNACKBAR_TIMEOUT = 6000

export const NftSaleBottomDrawer: FC = () => {
  const { currentAction, currentNftId, closeNftAction } = useNftActions()

  const [formStatus, setFormStatus] = useState<NftFormStatus | null>(null)
  const [openPuttingOnSaleDialog, closeCancelPuttingOnSaleDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Cancel putting on sale?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      onClick: () => {
        closeNftAction()
        closeCancelPuttingOnSaleDialog()
      },
      text: 'Confirm and close',
    },
    secondaryButton: {
      onClick: () => closeCancelPuttingOnSaleDialog(),
      text: 'Cancel',
    },
  })

  const { memberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const { displaySnackbar } = useSnackbar()
  const { nftSale } = useAnalytics()

  const isOpen = currentAction === 'putOnSale'

  const handleSubmit = useCallback(
    async (data: NftFormData) => {
      if (!joystream) {
        ConsoleLogger.error('No Joystream instance! Has webworker been initialized?')
        return
      }

      if (!currentNftId || !memberId) {
        ConsoleLogger.error('Missing NFT or member ID')
        return
      }

      const refetchData = async () => {
        await client.query<GetNftQuery, GetNftQueryVariables>({
          query: GetNftDocument,
          variables: { id: currentNftId },
          fetchPolicy: 'network-only',
        })
      }

      const completed = await handleTransaction({
        txFactory: async (cb) =>
          (await joystream.extrinsics).putNftOnSale(currentNftId, memberId, data, proxyCallback(cb)),
        onTxSync: refetchData,
      })
      if (completed) {
        nftSale(data.type, data.type === 'buyNow' ? data.buyNowPrice : data.startingPrice)
        displaySnackbar({
          customId: currentNftId,
          title: 'NFT put on sale successfully',
          iconType: 'success',
          timeout: SUCCESS_SNACKBAR_TIMEOUT,
          actionText: 'See details',
          onActionClick: () => openInNewTab(absoluteRoutes.viewer.video(currentNftId), true),
        })
        closeNftAction()
      }
    },
    [
      memberId,
      client,
      closeNftAction,
      currentNftId,
      displaySnackbar,
      handleTransaction,
      joystream,
      proxyCallback,
      nftSale,
    ]
  )

  const handleCancel = useCallback(() => {
    closeNftAction()
    setFormStatus(null)
  }, [closeNftAction])

  const actionBarProps: ActionBarProps = {
    fee: formStatus?.actionBarFee,
    feeLoading: formStatus?.actionBarLoading,
    primaryButton: {
      text: !formStatus?.canGoForward ? 'Start sale' : 'Next step',
      onClick: !formStatus?.canGoForward ? formStatus?.triggerSubmit : formStatus?.triggerGoForward,
    },
    secondaryButton: {
      text: !formStatus?.canGoBack ? 'Cancel' : 'Back',
      onClick: !formStatus?.canGoBack ? handleCancel : formStatus?.triggerGoBack,
      disabled: false,
    },
  }

  const handleClose = () => {
    if (formStatus?.canGoBack || !formStatus?.canGoForward) {
      openPuttingOnSaleDialog()
    } else {
      closeNftAction()
    }
  }

  return (
    <BottomDrawer isOpen={isOpen} onClose={handleClose} actionBar={actionBarProps}>
      {isOpen && currentNftId && (
        <NftForm onSubmit={handleSubmit} videoId={currentNftId} setFormStatus={setFormStatus} />
      )}
    </BottomDrawer>
  )
}
