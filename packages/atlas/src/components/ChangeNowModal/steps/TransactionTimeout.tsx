import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'

type TransactionTimeoutProps = {
  transactionId: string
}
export const TransactionTimeout = ({ transactionId }: TransactionTimeoutProps) => {
  return (
    <FlexBox flow="column">
      <Text variant="h500" as="h3" color="colorTextError">
        Transaction timed out
      </Text>
      <Text variant="t200" as="p" color="colorText">
        {atlasConfig.general.appName} did not receive any transaction status update from ChangeNOW for 25 minutes.
        Transaction might have succeeded and we just don't know about it. Double check transaction status on ChangeNOW
        site by clicking <TextButton to={`https://changenow.io/exchange/txs/${transactionId}`}>this button</TextButton>.
      </Text>
    </FlexBox>
  )
}
