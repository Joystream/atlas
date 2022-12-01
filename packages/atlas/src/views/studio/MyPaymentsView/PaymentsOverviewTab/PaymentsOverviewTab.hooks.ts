import { useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import {
  GetPayloadDataObjectIdByCommitmentDocument,
  GetPayloadDataObjectIdByCommitmentQuery,
  GetPayloadDataObjectIdByCommitmentQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { getClaimableReward } from '@/joystream-lib/channelPayouts'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useDistributionOperators } from '@/providers/assets/assets.provider'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { createAssetDownloadEndpoint } from '@/utils/asset'
import { getRandomIntInclusive } from '@/utils/number'

export const useChannelPayout = () => {
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
    const payloadUrl = createAssetDownloadEndpoint(nodeEndpoint, payloadDataObjectId)

    const { reward } = await getClaimableReward(channelId, channel?.cumulativeRewardClaimed, payloadUrl)

    setAvailableAward(hapiBnToTokenNumber(reward))
    setAwardLoading(false)
  }, [channel?.cumulativeRewardClaimed, channelId, getPayloadDataObjectIdAndNodeEndpoint, joystream, memberId])

  const claimReward = async () => {
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

  return {
    availableAward,
    isAwardLoading: loading || isAwardLoading,
    claimReward,
  }
}
