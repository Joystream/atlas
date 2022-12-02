import BN from 'bn.js'
import { useMemo } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextWrapper } from '@/components/WidgetTile/WidgetTile.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BalanceWrapper } from '@/components/_overlays/ClaimChannelPaymentsDialog/ClaimChannelPaymentsDialog.styles'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useFee, useSubscribeAccountBalance, useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { useChannelPayout } from '@/views/studio/MyPaymentsView/PaymentsOverviewTab/PaymentsOverviewTab.hooks'

interface ClaimChannelPaymentsDialogProps {
  show?: boolean
  onExit?: () => void
}

export const ClaimChannelPaymentsDialog = ({ onExit, show }: ClaimChannelPaymentsDialogProps) => {
  const { channelId } = useUser()
  const { channel } = useFullChannel(channelId || '')
  const { availableAward, claimReward, rawHapiAward, isAwardLoading, txParams } = useChannelPayout(onExit)
  const { fullFee, loading: feeLoading } = useFee('claimRewardTx', txParams)
  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(channel?.channelStateBloatBond || 0)
  }, [channel?.channelStateBloatBond])
  const { accountBalance: channelBalance } =
    useSubscribeAccountBalance(channel?.rewardAccount, {
      channelStateBloatBond: memoizedChannelStateBloatBond,
    }) || new BN(0)
  const { convertHapiToUSD } = useTokenPrice()
  const mdMatch = useMediaMatch('md')

  return (
    <DialogModal
      show={show}
      onExitClick={onExit}
      title="Claim payouts"
      primaryButton={{ text: 'Claim', onClick: claimReward }}
      secondaryButton={{ text: 'Cancel', onClick: onExit }}
      additionalActionsNode={<Fee amount={fullFee} loading={feeLoading} variant="h200" />}
    >
      {isAwardLoading ? (
        <div>
          <SkeletonLoader height={mdMatch ? 31 : 24} width={128} bottomSpace={5} />
          <SkeletonLoader height={mdMatch ? 21 : 14} width={64} />
        </div>
      ) : (
        <>
          <TextWrapper>
            <SvgJoyTokenMonochrome24 />
            <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
              {formatNumber(availableAward ?? 0)}
            </Text>
          </TextWrapper>
          <NumberFormat
            variant="t100"
            as="p"
            format="dollar"
            value={convertHapiToUSD(rawHapiAward ?? new BN(0)) ?? 0}
            margin={{ top: 1 }}
          />
        </>
      )}

      <BalanceWrapper>
        <Text variant="t100" as="p" color="colorText" margin={{ top: 1 }}>
          Membership account balance
        </Text>
        <Text variant="t100" as="p" color="colorText" margin={{ top: 1 }}>
          {formatNumber(channelBalance ? hapiBnToTokenNumber(channelBalance) : 0)} tJOY
        </Text>
      </BalanceWrapper>
    </DialogModal>
  )
}
