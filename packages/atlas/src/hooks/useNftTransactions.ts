import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'

export const useNftTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const [openModal, closeModal] = useConfirmationModal()
  const client = useApolloClient()

  const _refetchData = useCallback(
    (id: string) =>
      client.query<GetNftQuery, GetNftQueryVariables>({
        query: GetNftDocument,
        variables: { id },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  const withdrawBid = useCallback(
    async (id: string) => {
      if (!joystream || !activeMemberId) {
        return
      }
      const completed = await handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).cancelNftBid(id, activeMemberId, proxyCallback(updateStatus)),
        onTxSync: async (_) => _refetchData(id),
      })
      if (completed) {
        displaySnackbar({
          title: 'Your bid was withdrawn successfully',
          iconType: 'success',
        })
      }
    },
    [_refetchData, activeMemberId, displaySnackbar, handleTransaction, joystream, proxyCallback]
  )

  const cancelNftSale = useCallback(
    (id: string, isBuyNow?: boolean) => {
      if (!joystream || !activeMemberId) {
        return
      }
      const handleCancelTransaction = () =>
        handleTransaction({
          txFactory: async (updateStatus) =>
            (await joystream.extrinsics).cancelNftSale(
              id,
              activeMemberId,
              isBuyNow || false,
              proxyCallback(updateStatus)
            ),
          onTxSync: async (_) => _refetchData(id),
        })

      openModal({
        title: 'Remove from sale',
        description: 'Do you really want to remove your item from sale? You can put it on sale anytime.',
        primaryButton: {
          variant: 'destructive',
          text: 'Remove',
          onClick: () => {
            handleCancelTransaction()
            closeModal()
          },
        },
        secondaryButton: {
          variant: 'secondary',
          text: 'Cancel',
          onClick: () => closeModal(),
        },
      })
    },
    [_refetchData, activeMemberId, closeModal, handleTransaction, joystream, openModal, proxyCallback]
  )

  const changeNftPrice = useCallback(
    (id: string, price: number) => {
      if (!joystream || !activeMemberId) {
        return
      }
      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).changeNftPrice(activeMemberId, id, price, proxyCallback(updateStatus)),
        onTxSync: async (_) => _refetchData(id),
        snackbarSuccessMessage: {
          title: 'NFT price changed',
        },
      })
    },
    [_refetchData, activeMemberId, handleTransaction, joystream, proxyCallback]
  )

  return {
    cancelNftSale,
    changeNftPrice,
    withdrawBid,
  }
}
