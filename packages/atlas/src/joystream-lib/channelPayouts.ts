import { channelPayoutProof } from '@joystream/js/content'
import { BN } from 'bn.js'

import { StringifiedNumber } from './types'

export const getClaimableReward = async (
  channelId: string,
  cumulativeRewardEarned: StringifiedNumber | null,
  payloadUrl: string
) => {
  const payoutProof = await channelPayoutProof('URL', payloadUrl, Number(channelId))

  const reward = new BN(payoutProof.cumulativeRewardEarned).sub(new BN(cumulativeRewardEarned || 0))
  return {
    reward,
    payoutProof,
  }
}
