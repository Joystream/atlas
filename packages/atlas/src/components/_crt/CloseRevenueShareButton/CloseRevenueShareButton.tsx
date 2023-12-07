import { useCallback } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { useJoystream } from '@/providers/joystream'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'

type CloseRevenueShareButtonProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
}

export const CloseRevenueShareButton = ({ revenueShare }: CloseRevenueShareButtonProps) => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { currentBlock } = useJoystreamStore()

  const finalizeRevenueShare = useCallback(() => {
    if (!joystream || !memberId || !channelId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).finalizeRevenueSplit(memberId, channelId, proxyCallback(updateStatus)),
      onTxSync: async (data) => {
        displaySnackbar({
          title: 'Revenue share is closed',
          description: `Remaining unclaimed ${data.amount} ${atlasConfig.joystream.tokenTicker} was transfered back to your channel balance`,
          iconType: 'info',
        })
      },
    })
  }, [channelId, displaySnackbar, handleTransaction, joystream, memberId, proxyCallback])

  if (currentBlock < revenueShare.endsAt) {
    return null
  }

  return <Button onClick={finalizeRevenueShare}>Close revenue share</Button>
}