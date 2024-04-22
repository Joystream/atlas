import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'

import { TransactionData } from './SummaryStep'
import { CommonProps } from './types'

export type FailedStepProps = {
  transactionData: TransactionData
} & CommonProps

export const FailedStep = ({ transactionData }: FailedStepProps) => {
  return (
    <FlexBox flow="column">
      <Text variant="h500" as="h3">
        Swap failed
      </Text>
      <Text variant="t200" as="p" color="colorText">
        Your swap was marked as failed by ChangeNow. You can try again or cancel.
      </Text>
      <Text variant="t200" as="p" color="colorText">
        For more information click on the ID button below.
      </Text>
      <FlexBox marginTop={2} />
      <TextButton
        variant="secondary"
        onClick={() => window.open(`https://changenow.io/exchange/txs/${transactionData.id}`, '_blank')}
      >
        {transactionData.id}
      </TextButton>
    </FlexBox>
  )
}
