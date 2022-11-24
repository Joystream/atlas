import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { BN } from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import {
  GetPayloadDataObjectIdByCommitmentDocument,
  GetPayloadDataObjectIdByCommitmentQuery,
  GetPayloadDataObjectIdByCommitmentQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { SvgAlertsInformative24, SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { getClaimableReward } from '@/joystream-lib/channelPayouts'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useDistributionOperators } from '@/providers/assets/assets.provider'
import { useJoystream, useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, media, sizes, zIndex } from '@/styles'
import { createAssetDownloadEndpoint } from '@/utils/asset'
import { formatNumber, getRandomIntInclusive } from '@/utils/number'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId, accountId, activeMembership } = useUser()
  const [availableAward, setAvailableAward] = useState<number | undefined>()
  const [isAwardLoading, setAwardLoading] = useState(true)
  const { channel, loading, refetch } = useFullChannel(channelId || '')
  const handleTransaction = useTransaction()
  const client = useApolloClient()

  const { getAllDistributionOperatorsForBag } = useDistributionOperators()

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

  const getPayloadDataObjectIdAndNodeEndpoint = useCallback(
    async (commitment: string) => {
      const {
        data: { channelPayoutsUpdatedEvents },
      } = await client.query<GetPayloadDataObjectIdByCommitmentQuery, GetPayloadDataObjectIdByCommitmentQueryVariables>(
        {
          query: GetPayloadDataObjectIdByCommitmentDocument,
          variables: {
            commitment,
          },
        }
      )

      const operators = await getAllDistributionOperatorsForBag(
        channelPayoutsUpdatedEvents[0]?.payloadDataObject.storageBagId
      )
      const randomOperatorIdx = getRandomIntInclusive(0, operators?.length ? operators.length - 1 : 0)

      return {
        nodeEndpoint: operators?.[randomOperatorIdx].endpoint,
        payloadDataObjectId: channelPayoutsUpdatedEvents?.[0].payloadDataObject.id,
      }
    },
    [client, getAllDistributionOperatorsForBag]
  )

  const handleFetchReward = useCallback(async () => {
    setAwardLoading(true)
    if (!channelId || !joystream || !memberId || channel?.cumulativeRewardClaimed === undefined) {
      return
    }
    const commitment = await joystream.getContentCommitment()

    const { payloadDataObjectId, nodeEndpoint } = await getPayloadDataObjectIdAndNodeEndpoint(commitment)
    if (!payloadDataObjectId || !nodeEndpoint) {
      return
    }
    const payloadUrl = createAssetDownloadEndpoint(nodeEndpoint, payloadDataObjectId)

    const { reward } = await getClaimableReward(channelId, channel?.cumulativeRewardClaimed, payloadUrl)

    setAvailableAward(hapiBnToTokenNumber(reward))
    setAwardLoading(false)
  }, [channel?.cumulativeRewardClaimed, channelId, getPayloadDataObjectIdAndNodeEndpoint, joystream, memberId])

  const handleClaimReward = async () => {
    const cumulativeRewardClaimed = channel?.cumulativeRewardClaimed
    if (!channelId || !joystream || !memberId || cumulativeRewardClaimed === undefined) {
      return
    }
    const commitment = await joystream.getContentCommitment()

    const { payloadDataObjectId, nodeEndpoint } = await getPayloadDataObjectIdAndNodeEndpoint(commitment)
    if (!payloadDataObjectId || !nodeEndpoint) {
      return
    }

    const payloadUrl = createAssetDownloadEndpoint(nodeEndpoint, payloadDataObjectId)

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).claimReward(
          channelId,
          memberId,
          cumulativeRewardClaimed,
          payloadUrl,
          commitment,
          proxyCallback(updateStatus)
        ),
      onTxSync: () => refetch(),
    })
  }

  useEffect(() => {
    if (!channelId || !memberId || channel?.cumulativeRewardClaimed === undefined) {
      return
    }
    handleFetchReward()
  }, [channel?.cumulativeRewardClaimed, channelId, handleFetchReward, memberId])

  return (
    <>
      <TilesWrapper>
        <WidgetTile
          title="Claimable Rewards"
          loading={isAwardLoading || loading}
          text={availableAward ? formattedReward : undefined}
          button={
            availableAward
              ? {
                  text: 'Claim',
                  onClick: handleClaimReward,
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

const CustomNodeWrapper = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
`

export const AvatarAndTokenWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const TokenWrapper = styled.div`
  position: relative;
  left: -4px;
  z-index: ${zIndex.overlay};
  margin-right: ${sizes(2)};

  /* token background */

  &::before {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: ${cVar('colorBackgroundMuted')};
    border-radius: 100%;
    left: -2px;
    top: -2px;
  }
`
export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  position: relative;
`

const TilesWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  grid-template-rows: repeat(3, 1fr);

  ${media.sm} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`
