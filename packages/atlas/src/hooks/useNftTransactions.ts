import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'

export const useNftTransactions = () => {
  const { activeMemberId } = useAuthorizedUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [openModal, closeModal] = useConfirmationModal()
  const client = useApolloClient()

  const _refetchData = useCallback(
    (id: string) => {
      client.query<GetNftQuery, GetNftQueryVariables>({
        query: GetNftDocument,
        variables: { id },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const cancelNftSale = useCallback(
    (id: string, videoId: string, isBuyNow?: boolean, cb?: () => Promise<unknown>) => {
      if (!joystream) {
        return
      }
      const handleCancelTransaction = () =>
        handleTransaction({
          txFactory: async (updateStatus) =>
            (await joystream.extrinsics).cancelNftSale(
              videoId,
              activeMemberId,
              isBuyNow || false,
              proxyCallback(updateStatus)
            ),
          onTxSync: async (_) => _refetchData(id),
          onTxFinalize: cb ? () => cb() : undefined,
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

  return {
    cancelNftSale,
  }
}
