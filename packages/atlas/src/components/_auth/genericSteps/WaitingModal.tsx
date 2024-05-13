import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'

export type WaitingModalProps = {
  title?: string
  description?: string
}

export const WaitingModal = ({ title, description }: WaitingModalProps) => {
  return (
    <FlexBox flow="column" gap={6}>
      <Loader variant="medium" />
      <FlexBox flow="column" gap={2}>
        <Text variant="h500" as="h3">
          {title}
        </Text>
        <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
          {description}
        </Text>
      </FlexBox>
    </FlexBox>
  )
}
