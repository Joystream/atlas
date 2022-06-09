import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { GetNftDocument } from '@/api/queries'
import { GetBidsDocument } from '@/api/queries/__generated__/bids.generated'
import { NftSaleType } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'

export const useNftTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [openModal, closeModal] = useConfirmationModal()
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
          title: 'Bid withdrawn successfully',
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
          snackbarSuccessMessage: {
            title: 'NFT removed from sale successfully',
            description: 'You can put it back on sale anytime.',
          },
        })

      openModal({
        title: 'Remove from sale?',
        description: 'Are you sure you want to remove this NFT from sale? You can put it back on sale anytime.',
        type: 'warning',
        primaryButton: {
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
      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).changeNftPrice(activeMemberId, id, price, proxyCallback(updateStatus)),
        onTxSync: async () => _refetchData(),
        snackbarSuccessMessage: {
          title: 'NFT price changed successfully',
          description: 'You can update the price anytime.',
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
        snackbarSuccessMessage: {
          title: 'Bid accepted',
          description: 'Your auction has ended. The ownership has been transferred.',
        },
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
