import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { GetNftDocument } from '@/api/queries'
import { GetBidsDocument } from '@/api/queries/__generated__/bids.generated'
import { NftSaleType } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'

export const useNftTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [openConfirmationModal, closeModal] = useConfirmationModal()
  const client = useApolloClient()

  const _refetchData = useCallback(
    (includeBids = false) =>
      client.refetchQueries({
        include: [GetNftDocument, ...(includeBids ? [GetBidsDocument] : [])],
      }),
    [client]
  )

  const withdrawBid = useCallback(
    (id: string) => {
      if (!joystream || !activeMemberId) {
        return
      }
      handleTransaction({
        snackbarSuccessMessage: {
          title: 'Your bid was withdrawn successfully',
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).cancelNftBid(id, activeMemberId, proxyCallback(updateStatus)),
        onTxSync: async () => _refetchData(true),
      })
    },
    [_refetchData, activeMemberId, handleTransaction, joystream, proxyCallback]
  )

  const cancelNftSale = useCallback(
    (id: string, saleType: NftSaleType) => {
      if (!joystream || !activeMemberId) {
        return
      }
      const handleCancelTransaction = () =>
        handleTransaction({
          txFactory: async (updateStatus) =>
            (await joystream.extrinsics).cancelNftSale(id, activeMemberId, saleType, proxyCallback(updateStatus)),
          onTxSync: async () => _refetchData(),
        })

      openConfirmationModal({
        title: 'Remove from sale',
        description: 'Do you really want to remove your item from sale? You can put it on sale anytime.',
        type: 'warning',
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
    [_refetchData, activeMemberId, closeModal, handleTransaction, joystream, openConfirmationModal, proxyCallback]
  )

  const changeNftPrice = useCallback(
    (id: string, price: number) => {
      if (!joystream || !activeMemberId) {
        return
      }
      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).changeNftPrice(activeMemberId, id, price, proxyCallback(updateStatus)),
        onTxSync: async () => _refetchData(),
        snackbarSuccessMessage: {
          title: 'NFT price changed',
        },
      })
    },
    [_refetchData, activeMemberId, handleTransaction, joystream, proxyCallback]
  )

  const acceptNftBid = useCallback(
    (ownerId: string, id: string, bidderId: string, price: string) => {
      if (!joystream || !activeMemberId) {
        return
      }
      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).acceptNftBid(ownerId, id, bidderId, price, proxyCallback(updateStatus)),
        onTxSync: async () => _refetchData(),
      })
    },
    [_refetchData, activeMemberId, handleTransaction, joystream, proxyCallback]
  )

  return {
    cancelNftSale,
    changeNftPrice,
    withdrawBid,
    acceptNftBid,
  }
}
