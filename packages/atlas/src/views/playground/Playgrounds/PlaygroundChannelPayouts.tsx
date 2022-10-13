import { Button } from '@/components/_buttons/Button'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const handleClick = async () => {
    if (!joystream) {
      return
    }
    ;(await joystream.extrinsics).claimReward('1')
  }
  return (
    <Button variant="primary" onClick={handleClick}>
      Claim Reward
    </Button>
  )
}
