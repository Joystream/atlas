import BN from 'bn.js'

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
import { useFee, useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'
import { useChannelPayout } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.hooks'

interface ClaimChannelPaymentsDialogProps {
  show?: boolean
  onExit?: () => void
}

export const ClaimChannelPaymentsDialog = ({ onExit, show }: ClaimChannelPaymentsDialogProps) => {
  const { activeMembership } = useUser()
  const { availableAward, claimReward, isAwardLoading, txParams } = useChannelPayout(onExit)
  const { fullFee, loading: feeLoading } = useFee('claimRewardTx', txParams)
  const { totalBalance } = useSubscribeAccountBalance(activeMembership?.controllerAccount)
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
        <SkeletonLoader height={mdMatch ? 31 : 24} width={128} bottomSpace={5} />
      ) : (
        <TextWrapper>
          <SvgJoyTokenMonochrome24 />
          <NumberFormat
            value={availableAward ?? 0}
            as="p"
            variant={mdMatch ? 'h500' : 'h400'}
            margin={{ bottom: 0.5 }}
          />
        </TextWrapper>
      )}

      <BalanceWrapper>
        <Text variant="t100" as="p" color="colorText" margin={{ top: 1 }}>
          Membership account balance
        </Text>
        <NumberFormat
          value={hapiBnToTokenNumber(totalBalance ?? new BN(0))}
          as="p"
          variant="t100"
          color="colorText"
          margin={{ top: 1 }}
          withToken
        />
      </BalanceWrapper>
    </DialogModal>
  )
}
