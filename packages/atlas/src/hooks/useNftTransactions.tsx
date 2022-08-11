import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback } from 'react'

import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries'
import { GetBidsDocument } from '@/api/queries/__generated__/bids.generated'
import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { NftSaleType } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useFee, useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'
import { formatDateTime } from '@/utils/time'

export const useNftTransactions = () => {
  const { memberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [openModal, closeModal] = useConfirmationModal()
  const client = useApolloClient()
  const { loading: withdrawFeeLoading, updateFullFeeHandler: updateWithdrawFee } = useFee(
    'cancelNftBidTx',
    undefined,
    undefined,
    true
  )

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
    async (id: string, bid: BN, date: Date) => {
      if (!joystream || !memberId) {
        return
      }
      const handleWithdrawBid = () =>
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
      const fee = await updateWithdrawFee([id, memberId])

      openModal({
        title: (
          <>
            Withdraw your <NumberFormat value={bid} as="span" withToken /> bid?
          </>
        ),
        additionalActionsNode: <Fee loading={withdrawFeeLoading} variant="h200" amount={fee || new BN(0)} />,
        description: (
          <>
            Are you sure you want to withdraw your <NumberFormat value={bid} as="span" color="colorText" withToken />{' '}
            bid placed on {formatDateTime(date)}?
          </>
        ),
        primaryButton: {
          text: 'Withdraw',
          onClick: () => {
            handleWithdrawBid()
            closeModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeModal(),
        },
      })
    },
    [
      joystream,
      memberId,
      updateWithdrawFee,
      openModal,
      withdrawFeeLoading,
      handleTransaction,
      proxyCallback,
      client,
      refetchNftData,
      closeModal,
    ]
  )

  const cancelNftSale = useCallback(
    (id: string, saleType: NftSaleType) => {
      if (!joystream || !memberId) {
        return
      }
      return handleTransaction({
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
    },
    [refetchNftData, memberId, handleTransaction, joystream, proxyCallback]
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
