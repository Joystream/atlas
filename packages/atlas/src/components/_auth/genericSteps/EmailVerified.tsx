import { SvgAlertsSuccess32 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'

export const EmailVerified = () => {
  return (
    <FlexBox flow="column" gap={2}>
      <SvgAlertsSuccess32 />
      <Text variant="h500" as="h3">
        Email verified
      </Text>
      <Text variant="t300" as="span" color="colorText">
        Your email has been successfully verified.
      </Text>
    </FlexBox>
  )
}
