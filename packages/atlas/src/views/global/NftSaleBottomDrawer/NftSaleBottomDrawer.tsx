import { useApolloClient } from '@apollo/client'
import { FC, useCallback, useState } from 'react'

import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries'
import { ActionBarProps } from '@/components/ActionBar'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { absoluteRoutes } from '@/config/routes'
import { useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'
import { openInNewTab } from '@/utils/browser'
import { ConsoleLogger } from '@/utils/logs'

import { NftForm, NftFormData, NftFormStatus } from './NftForm'

const SUCCESS_SNACKBAR_TIMEOUT = 6000

export const NftSaleBottomDrawer: FC = () => {
  const { currentAction, currentNftId, closeNftAction } = useNftActions()
  const [formStatus, setFormStatus] = useState<NftFormStatus | null>(null)

  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const { displaySnackbar } = useSnackbar()

  const isOpen = currentAction === 'putOnSale'

  const handleSubmit = useCallback(
    async (data: NftFormData) => {
      if (!joystream) {
        ConsoleLogger.error('No Joystream instance! Has webworker been initialized?')
        return
      }

      if (!currentNftId || !activeMemberId) {
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
          (await joystream.extrinsics).putNftOnSale(currentNftId, activeMemberId, data, proxyCallback(cb)),
        onTxSync: refetchData,
      })
      if (completed) {
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
    [activeMemberId, client, closeNftAction, currentNftId, displaySnackbar, handleTransaction, joystream, proxyCallback]
  )

  const handleCancel = useCallback(() => {
    closeNftAction()
    setFormStatus(null)
  }, [closeNftAction])

  const actionBarProps: ActionBarProps = {
    variant: 'nft',
    primaryButton: {
      text: !formStatus?.canGoForward ? 'Start sale' : 'Next step',
      disabled: formStatus?.isDisabled,
      onClick: !formStatus?.canGoForward ? formStatus?.triggerSubmit : formStatus?.triggerGoForward,
    },
    secondaryButton: {
      text: !formStatus?.canGoBack ? 'Cancel' : 'Go back',
      onClick: !formStatus?.canGoBack ? handleCancel : formStatus?.triggerGoBack,
      disabled: false,
      visible: true,
    },
  }

  return (
    <BottomDrawer isOpen={isOpen} onClose={closeNftAction} actionBar={actionBarProps}>
      {isOpen && currentNftId && (
        <NftForm onSubmit={handleSubmit} videoId={currentNftId} setFormStatus={setFormStatus} />
      )}
    </BottomDrawer>
  )
}
