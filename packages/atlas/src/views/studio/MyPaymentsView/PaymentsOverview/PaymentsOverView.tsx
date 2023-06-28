import { BN } from 'bn.js'
import { useMemo, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgAlertsInformative24 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { ClaimChannelPaymentsDialog } from '@/components/_overlays/ClaimChannelPaymentsDialog'
import { WithdrawFundsDialog } from '@/components/_overlays/SendTransferDialogs'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'

import { useChannelPayout } from './PaymentsOverview.hooks'
import { CustomNodeWrapper, StyledSvgJoyTokenMonochrome24, TilesWrapper } from './PaymentsOverview.styles'

export const PaymentsOverView = () => {
  const { channelId, activeMembership } = useUser()
  const { url: memberAvatarUrl } = getMemberAvatar(activeMembership)
  const { totalBalance } = useSubscribeAccountBalance()
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState<boolean>(false)
  const { channel, loading } = useFullChannel(channelId || '')
  const { availableAward, isAwardLoading } = useChannelPayout()

  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(channel?.channelStateBloatBond || 0)
  }, [channel?.channelStateBloatBond])

  const { accountBalance: channelBalance } =
    useSubscribeAccountBalance(channel?.rewardAccount, {
      channelStateBloatBond: memoizedChannelStateBloatBond,
    }) || new BN(0)

  const mdMatch = useMediaMatch('md')

  return (
    <>
      <WithdrawFundsDialog
        avatarUrl={memberAvatarUrl}
        activeMembership={activeMembership}
        show={showWithdrawDialog}
        onExitClick={() => setShowWithdrawDialog(false)}
        totalBalance={totalBalance}
        channelBalance={channelBalance}
        channelId={channelId}
      />
      <ClaimChannelPaymentsDialog show={showClaimDialog} onExit={() => setShowClaimDialog(false)} />
      <TilesWrapper>
        <WidgetTile
          title="Claimable Rewards"
          loading={isAwardLoading || loading}
          button={
            availableAward
              ? {
                  text: 'Claim',
                  onClick: () => setShowClaimDialog(true),
                  fullWidth: !mdMatch,
                }
              : undefined
          }
          customNode={
            availableAward ? (
              <NumberFormat
                value={availableAward}
                as="span"
                icon={<StyledSvgJoyTokenMonochrome24 />}
                withDenomination
              />
            ) : (
              <CustomNodeWrapper>
                <SvgAlertsInformative24 />
                <Text variant="t100" as="p" color="colorText">
                  High-quality content is occasionally rewarded through JOY tokens by the Joystream council. When you
                  receive a reward, it'll appear here for you to claim. Learn more
                </Text>
              </CustomNodeWrapper>
            )
          }
        />
        <WidgetTile
          title="Channel balance"
          customNode={
            <NumberFormat
              value={channelBalance || new BN(0)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
            />
          }
          loading={loading || channelBalance === undefined}
          button={{
            text: 'Withdraw',
            variant: 'secondary',
            fullWidth: !mdMatch,
            onClick: () => setShowWithdrawDialog(true),
          }}
        />
      </TilesWrapper>
    </>
  )
}
