import { channelPayoutProof } from '@joystreamjs/content'

import { Button } from '@/components/_buttons/Button'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const handleClick = async () => {
    const nodeEndpoint = 'http://192.168.1.31:3333'
    const payloadDataObjectId = '0'
    const payoutProof = await channelPayoutProof('URL', `${nodeEndpoint}/api/v1/files/${payloadDataObjectId}`, 1)
    console.log(payoutProof)
  }
  return (
    <Button variant="primary" onClick={handleClick}>
      Claim Reward
    </Button>
  )
}
