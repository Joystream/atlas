import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import {
  GetPayloadDataObjectIdByCommitmentDocument,
  GetPayloadDataObjectIdByCommitmentQuery,
  GetPayloadDataObjectIdByCommitmentQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { atlasConfig } from '@/config'
import { getClaimableReward } from '@/joystream-lib/channelPayouts'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useDistributionOperators } from '@/providers/assets/assets.provider'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { createAssetDownloadEndpoint } from '@/utils/asset'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatNumber, getRandomIntInclusive } from '@/utils/number'

const TOKEN_TICKER = atlasConfig.joystream.tokenTicker

export const useChannelPayout = (txCallback?: () => void) => {
  const {
    joystream,
    proxyCallback,
    chainState: { maxCashoutAllowed, minCashoutAllowed },
  } = useJoystream()
  const { channelId, memberId } = useUser()
  const [availableAward, setAvailableAward] = useState<BN | undefined>()
  const [isAwardLoading, setAwardLoading] = useState(true)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [txParams, setTxParams] = useState<Parameters<JoystreamLibExtrinsics['claimRewardTx']> | undefined>(undefined)
  const { channel, loading, refetch } = useFullChannel(channelId || '')
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const { displaySnackbar } = useSnackbar()

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

  const getRewardData = useCallback(
    async (channelId: string, cumulativeRewardClaimed: string | null) => {
      if (!joystream) {
        ConsoleLogger.warn('No joystream instance')
        return
      }
      try {
        const commitment = await joystream.getContentCommitment()

        const { payloadDataObjectId, nodeEndpoint } = await getPayloadDataObjectIdAndNodeEndpoint(commitment)
        if (!payloadDataObjectId || !nodeEndpoint) {
          return
        }
        const payloadUrl = createAssetDownloadEndpoint(nodeEndpoint, payloadDataObjectId)
        const { reward } = await getClaimableReward(channelId, cumulativeRewardClaimed, payloadUrl)

        if (reward.gt(maxCashoutAllowed) || reward.lt(minCashoutAllowed)) {
          setClaimError(
            reward.gt(maxCashoutAllowed)
              ? `Maximum limit on claimable amount of ${maxCashoutAllowed.toString()} ${TOKEN_TICKER} exceeded. Please contact creator support in Discord.`
              : `Minimum claimable amount must be more than ${minCashoutAllowed.toString()} ${TOKEN_TICKER}. Accumulate more rewards before claiming again.`
          )
        } else {
          setClaimError(null)
        }
        return { reward, payloadUrl, commitment }
      } catch (error) {
        SentryLogger.error("Couldn't get reward data", 'PaymentOverviewTab.hooks', error)
      }
    },
    [getPayloadDataObjectIdAndNodeEndpoint, joystream, maxCashoutAllowed, minCashoutAllowed]
  )

  const handleFetchReward = useCallback(async () => {
    setAwardLoading(true)
    if (!channelId || !memberId || channel?.cumulativeRewardClaimed === undefined) {
      return
    }
    const rewardData = await getRewardData(channelId, channel.cumulativeRewardClaimed)

    setAvailableAward(rewardData?.reward)

    if (!rewardData || rewardData?.reward?.isZero()) {
      setTxParams(undefined)
    } else {
      setTxParams([
        channelId,
        memberId,
        channel.cumulativeRewardClaimed ?? null,
        rewardData.payloadUrl,
        rewardData.commitment,
      ])
    }

    setAwardLoading(false)
  }, [channel?.cumulativeRewardClaimed, channelId, getRewardData, memberId])

  const claimReward = async () => {
    if (!channelId || !memberId || !txParams || !joystream) {
      return
    }

    if (claimError) {
      displaySnackbar({
        title: 'Something went wrong',
        description: claimError,
        iconType: 'error',
      })
      return
    }

    const [, , cumulativeRewardEarned, payloadUrl, commitment] = txParams

    handleTransaction({
      snackbarSuccessMessage: {
        title: 'Reward claimed successfully',
        description: `You have claimed ${formatNumber(hapiBnToTokenNumber(new BN(availableAward ?? 0)))} ${
          atlasConfig.joystream.tokenTicker
        }!`,
      },
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).claimReward(
          channelId,
          memberId,
          cumulativeRewardEarned,
          payloadUrl,
          commitment,
          proxyCallback(updateStatus)
        ),
      onTxSync: () => {
        txCallback?.()
        return refetch()
      },
    })
  }

  useEffect(() => {
    if (!channelId || !memberId || channel?.cumulativeRewardClaimed === undefined) {
      return
    }
    handleFetchReward()
  }, [channel?.cumulativeRewardClaimed, channelId, handleFetchReward, memberId])

  return {
    availableAward: hapiBnToTokenNumber(availableAward ?? new BN(0)),
    rawHapiAward: availableAward,
    isAwardLoading: loading || isAwardLoading,
    claimReward,
    txParams,
  }
}
