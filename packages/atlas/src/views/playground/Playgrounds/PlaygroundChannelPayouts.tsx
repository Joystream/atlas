import { useApolloClient } from '@apollo/client'
import { BN } from 'bn.js'
import { useCallback, useEffect, useState } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import {
  GetPayloadDataObjectIdByCommitmentDocument,
  GetPayloadDataObjectIdByCommitmentQuery,
  GetPayloadDataObjectIdByCommitmentQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import {
  GetStorageBucketsNodeEndpointForBagDocument,
  GetStorageBucketsNodeEndpointForBagQuery,
  GetStorageBucketsNodeEndpointForBagQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { getRandomIntInclusive } from '@/utils/number'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const [availableAward, setAvailableAward] = useState<number | undefined>()
  const [isAwardLoading, setAwardLoading] = useState(true)
  const { channel, loading, refetch } = useBasicChannel(channelId || '')
  const handleTransaction = useTransaction()
  const client = useApolloClient()

  // TODO this is probably wrong way to do it
  // we need to test the endpoint and try again with different one if it fails
  const getRandomStorageBucketOperatorMetadataNodeEndpointForBag = useCallback(
    async (bagId: string) => {
      const {
        data: { storageBuckets },
      } = await client.query<
        GetStorageBucketsNodeEndpointForBagQuery,
        GetStorageBucketsNodeEndpointForBagQueryVariables
      >({
        query: GetStorageBucketsNodeEndpointForBagDocument,
        variables: {
          bagId,
        },
        fetchPolicy: 'network-only',
      })
      if (!storageBuckets || !storageBuckets.length) {
        return null
      }
      const randomStorageBucketIdx = getRandomIntInclusive(0, storageBuckets.length - 1)

      return storageBuckets[randomStorageBucketIdx].operatorMetadata?.nodeEndpoint
    },

    [client]
  )

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

      const nodeEndpoint = await getRandomStorageBucketOperatorMetadataNodeEndpointForBag(
        channelPayoutsUpdatedEvents[0]?.payloadDataObject.storageBagId
      )

      return {
        nodeEndpoint,
        payloadDataObjectId: channelPayoutsUpdatedEvents?.[0].payloadDataObject.id,
      }
    },
    [client, getRandomStorageBucketOperatorMetadataNodeEndpointForBag]
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

    const reward = await (
      await joystream.extrinsics
    ).getClaimableReward(channelId, channel?.cumulativeRewardClaimed, nodeEndpoint, payloadDataObjectId)

    setAvailableAward(hapiBnToTokenNumber(new BN(reward)))
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
