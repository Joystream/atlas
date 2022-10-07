import { Button } from '@/components/_buttons/Button'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'

export const PlaygroundChannelPayouts = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const handleClick = async () => {
    console.log('bam')
    if (!joystream) {
      return
    }
    ;(await joystream.extrinsics).claimReward('2')
    console.log('bam2')
  }
  return (
    <Button variant="primary" onClick={handleClick}>
      Claim Reward
    </Button>
  )
}
