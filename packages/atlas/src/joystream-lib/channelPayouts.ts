import { channelPayoutProof } from '@joystream/js/content'
import { BN } from 'bn.js'

import { StringifiedNumber } from './types'

export const getClaimableReward = async (
  channelId: string,
  cumulativeRewardEarned: StringifiedNumber | null,
  nodeEndpoint: string,
  payloadDataObjectId: string
) => {
  const payoutProof = await channelPayoutProof(
    'URL',
    `${nodeEndpoint}/api/v1/files/${payloadDataObjectId}`,
    Number(channelId)
  )

  const reward = new BN(payoutProof.cumulativeRewardEarned).sub(new BN(cumulativeRewardEarned || 0))
  return {
    reward,
    payoutProof,
  }
}
