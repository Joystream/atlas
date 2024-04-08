import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { SentryLogger } from '@/utils/logs'

export const useUnlockTokenStake = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const client = useApolloClient()

  return useCallback(
    async (memberId: string, tokenId: string, tokenSymbol: string) => {
      if (!joystream) {
        return
      }
      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).exitRevenueSplit(tokenId, memberId, proxyCallback(updateStatus)),
        onTxSync: async (data) => {
          client.refetchQueries({ include: 'all' })
          displaySnackbar({
            title: `${data.amount} $${tokenSymbol} unlocked`,
            iconType: 'success',
          })
        },
        onError: () => {
          SentryLogger.error('Failed to unlock token stake', 'useUnlockTokenStake', {
            joystream,
            memberId,
            tokenId,
          })
          displaySnackbar({
            iconType: 'error',
            title: 'Something went wrong',
          })
        },
      })
    },
    [joystream, handleTransaction, proxyCallback, client, displaySnackbar]
  )
}
