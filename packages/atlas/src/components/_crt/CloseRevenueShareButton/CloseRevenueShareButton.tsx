import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback } from 'react'

import { Button, ButtonProps } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

type CloseRevenueShareButtonProps = {
  revenueShareEndingBlock?: number
  hideOnInactiveRevenue?: boolean
} & Pick<ButtonProps, 'variant' | 'disabled'>

export const CloseRevenueShareButton = ({
  variant,
  disabled,
  hideOnInactiveRevenue,
  revenueShareEndingBlock,
}: CloseRevenueShareButtonProps) => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { currentBlock } = useJoystreamStore()
  const client = useApolloClient()

  const finalizeRevenueShare = useCallback(() => {
    if (!joystream || !memberId || !channelId) {
      SentryLogger.error('Failed to submit close revenue share', 'CloseRevenueShareButton', {
        joystream,
        memberId,
        channelId,
      })
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).finalizeRevenueSplit(memberId, channelId, proxyCallback(updateStatus)),
      onTxSync: async (data) => {
        client.refetchQueries({ include: 'active' })
        displaySnackbar({
          title: 'Revenue share is closed',
          description: `Remaining unclaimed ${hapiBnToTokenNumber(new BN(data.amount))} ${
            atlasConfig.joystream.tokenTicker
          } were transferred back to your channel balance.`,
          iconType: 'info',
        })
      },
      onError: () => {
        SentryLogger.error('Failed to close revenue share', 'CloseRevenueShareButton', {
          joystream,
          memberId,
          channelId,
        })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }, [channelId, client, displaySnackbar, handleTransaction, joystream, memberId, proxyCallback])

  if (hideOnInactiveRevenue && currentBlock < (revenueShareEndingBlock ?? 0)) {
    return null
  }

  return (
    <Button disabled={disabled} onClick={finalizeRevenueShare} variant={variant}>
      Close revenue share
    </Button>
  )
}
