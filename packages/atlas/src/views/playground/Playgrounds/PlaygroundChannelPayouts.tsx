import { useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import {
  GetPayloadDataObjectIdByCommitmentDocument,
  GetPayloadDataObjectIdByCommitmentQuery,
  GetPayloadDataObjectIdByCommitmentQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { getClaimableReward } from '@/joystream-lib/channelPayouts'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useDistributionOperators } from '@/providers/assets/assets.provider'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { getRandomIntInclusive } from '@/utils/number'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const [availableAward, setAvailableAward] = useState<number | undefined>()
  const [isAwardLoading, setAwardLoading] = useState(true)
  const { channel, loading, refetch } = useFullChannel(channelId || '')
  const handleTransaction = useTransaction()
  const client = useApolloClient()

  const { getAllDistributionOperatorsForBag } = useDistributionOperators()

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

    const { reward } = await getClaimableReward(
      channelId,
      channel?.cumulativeRewardClaimed,
      nodeEndpoint,
      payloadDataObjectId
    )

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

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).claimReward(
          channelId,
          memberId,
          cumulativeRewardClaimed,
          nodeEndpoint,
          payloadDataObjectId,
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
      <Text as="p" variant="h400" margin={{ bottom: 4 }}>
        Award to claim:{' '}
        {isAwardLoading || loading ? (
          <Text as="span" variant="t300">
            {' '}
            Loading...
          </Text>
        ) : (
          <NumberFormat as="span" variant="t300" value={availableAward || 0} withToken />
        )}
      </Text>
      <Button variant="primary" onClick={handleClaimReward}>
        Claim Reward
      </Button>
    </>
  )
}
