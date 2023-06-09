import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback } from 'react'

import { GetBidsDocument } from '@/api/queries/__generated__/bids.generated'
import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries/__generated__/nfts.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { NftSaleType } from '@/joystream-lib/types'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatDateTime } from '@/utils/time'

export const useNftTransactions = () => {
  const { memberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [openModal, closeModal] = useConfirmationModal()
  const client = useApolloClient()

  const refetchNftData = useCallback(
    (id: string) => {
      client.query<GetNftQuery, GetNftQueryVariables>({
        query: GetNftDocument,
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const withdrawBid = useCallback(
    (id: string, userBidAmount: BN, userBidCreatedAt: Date) => {
      if (!joystream || !memberId) {
        return
      }
      const handleWithdrawTransaction = () =>
        handleTransaction({
          snackbarSuccessMessage: {
            title: 'Bid withdrawn successfully',
          },
          txFactory: async (updateStatus) =>
            (await joystream.extrinsics).cancelNftBid(id, memberId, proxyCallback(updateStatus)),
          onTxSync: async () => {
            client.refetchQueries({
              include: [GetBidsDocument],
            })
            return refetchNftData(id)
          },
        })

      openModal({
        title: (
          <>
            Withdraw your <NumberFormat value={userBidAmount} as="span" withToken /> bid?
          </>
        ),
        description: (
          <>
            Are you sure you want to withdraw your{' '}
            <NumberFormat value={userBidAmount} as="span" color="colorText" withToken /> bid placed on{' '}
            {formatDateTime(userBidCreatedAt)}?
          </>
        ),
        primaryButton: {
          text: 'Withdraw',
          onClick: () => {
            handleWithdrawTransaction()
            closeModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeModal(),
        },
        fee: {
          methodName: 'cancelNftBidTx',
          args: [id, memberId],
        },
      })
    },
    [joystream, memberId, openModal, handleTransaction, proxyCallback, client, refetchNftData, closeModal]
  )

  const cancelNftSale = useCallback(
    (id: string, saleType: NftSaleType) => {
      if (!joystream || !memberId) {
        return
      }
      const handleCancelTransaction = () =>
        handleTransaction({
          txFactory: async (updateStatus) =>
            (await joystream.extrinsics).cancelNftSale(id, memberId, saleType, proxyCallback(updateStatus)),
          onTxSync: async () => {
            return refetchNftData(id)
          },
          snackbarSuccessMessage: {
            title: 'NFT removed from sale successfully',
            description: 'You can put it back on sale anytime.',
          },
        })

      openModal({
        title: 'Remove from sale?',
        description: `Are you sure you want to remove this NFT from sale? ${
          saleType === 'buyNow'
            ? 'You can put it back on sale anytime.'
            : 'You may lose the bids that were already placed.'
        } `,
        type: 'destructive',
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
        fee: {
          methodName: 'cancelNftSaleTx',
          args: [id, memberId, saleType],
        },
      })
    },
    [joystream, memberId, openModal, handleTransaction, proxyCallback, refetchNftData, closeModal]
  )

  const changeNftPrice = useCallback(
    (id: string, price: BN) => {
      if (!joystream || !memberId) {
        return
      }
      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).changeNftPrice(memberId, id, price.toString(), proxyCallback(updateStatus)),
        onTxSync: async () => refetchNftData(id),
        snackbarSuccessMessage: {
          title: 'NFT price changed successfully',
          description: 'You can update the price anytime.',
        },
      })
    },
    [refetchNftData, memberId, handleTransaction, joystream, proxyCallback]
  )

  const acceptNftBid = useCallback(
    (ownerId: string, id: string, bidderId: string, price: BN) => {
      if (!joystream || !memberId) {
        return
      }
      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).acceptNftBid(
            ownerId,
            id,
            bidderId,
            price.toString(),
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => refetchNftData(id),
        snackbarSuccessMessage: {
          title: 'Bid accepted',
          description: 'Your auction has ended. The ownership has been transferred.',
        },
      })
    },
    [refetchNftData, memberId, handleTransaction, joystream, proxyCallback]
  )

  return {
    cancelNftSale,
    changeNftPrice,
    withdrawBid,
    acceptNftBid,
  }
}
