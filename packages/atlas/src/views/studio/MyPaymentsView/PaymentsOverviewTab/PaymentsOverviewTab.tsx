import { BN } from 'bn.js'
import { useMemo } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgAlertsInformative24, SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'

import { useChannelPayout } from './PaymentsOverviewTab.hooks'
import {
  AvatarAndTokenWrapper,
  CustomNodeWrapper,
  StyledJoyTokenIcon,
  StyledWidgetTile,
  TilesWrapper,
  TokenWrapper,
} from './PaymentsOverviewTab.styles'

export const PaymentsOverViewTab = () => {
  const { channelId, accountId, activeMembership } = useUser()
  const { channel, loading } = useFullChannel(channelId || '')
  const { availableAward, claimReward, isAwardLoading } = useChannelPayout()

  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(channel?.channelStateBloatBond || 0)
  }, [channel?.channelStateBloatBond])

  const { accountBalance: memberBalance } = useSubscribeAccountBalance()
  const { accountBalance: channelBalance } =
    useSubscribeAccountBalance(channel?.rewardAccount, {
      channelStateBloatBond: memoizedChannelStateBloatBond,
    }) || new BN(0)

  const formattedChannelBalance = formatNumber(hapiBnToTokenNumber(channelBalance || new BN(0)))
  const formattedMemberBalance = formatNumber(hapiBnToTokenNumber(memberBalance || new BN(0)))
  const formattedReward = formatNumber(availableAward || 0)

  const { url, isLoadingAsset } = useMemberAvatar(activeMembership)

  const mdMatch = useMediaMatch('md')

  return (
    <>
      <TilesWrapper>
        <StyledWidgetTile
          title="Claimable Rewards"
          loading={isAwardLoading || loading}
          text={availableAward ? formattedReward : undefined}
          button={
            availableAward
              ? {
                  text: 'Claim',
                  onClick: claimReward,
                  fullWidth: mdMatch ? false : true,
                }
              : undefined
          }
          customNode={
            availableAward ? undefined : (
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
          icon={<SvgJoyTokenMonochrome24 />}
          text={formattedChannelBalance}
          loading={loading || channelBalance === undefined}
          button={{
            text: 'Withdraw',
            variant: 'secondary',
            fullWidth: mdMatch ? false : true,
            // todo handle withdraw
          }}
        />
        <WidgetTile
          title="Membership wallet balance"
          loading={loading || memberBalance === undefined}
          icon={
            <AvatarAndTokenWrapper>
              <Avatar size="bid" assetUrl={url} loading={isLoadingAsset} />
              <TokenWrapper>
                <StyledJoyTokenIcon variant="gray" size={24} />
              </TokenWrapper>
            </AvatarAndTokenWrapper>
          }
          text={formattedMemberBalance}
          customTopRightNode={accountId ? <CopyAddressButton size="small" address={accountId} /> : undefined}
        />
      </TilesWrapper>
    </>
  )
}