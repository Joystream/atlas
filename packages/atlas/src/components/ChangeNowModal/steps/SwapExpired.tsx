import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'

export const SwapExpired = () => {
  return (
    <FlexBox flow="column">
      <Text variant="h500" as="h3">
        Swap time expired
      </Text>
      <Text variant="t200" as="p" color="colorText">
        Your swap could not be completed because the session timed out. You can try again or cancel
      </Text>
    </FlexBox>
  )
}
