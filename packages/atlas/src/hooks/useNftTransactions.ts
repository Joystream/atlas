import { useNft } from '@/api/hooks'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'

export const useNftTransactions = (videoId?: string) => {
  const { refetch } = useNft(videoId || '')
  const { activeMemberId } = useAuthorizedUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()

  const cancelNftSale = (isBuyNow?: boolean, cb?: () => Promise<unknown>) => {
    if (!joystream || !videoId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftSale(
          videoId,
          activeMemberId,
          isBuyNow || false,
          proxyCallback(updateStatus)
        ),
      onTxSync: async (_) => refetch(),
      onTxFinalize: cb ? () => cb() : undefined,
    })
  }

  return {
    cancelNftSale,
  }
}
