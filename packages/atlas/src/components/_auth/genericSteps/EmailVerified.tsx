import { useQuery } from 'react-query'

import { SvgAlertsSuccess32 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'

type EmailVerifiedProps = {
  code: string
  onVerified: () => void
}

export const EmailVerified = ({ code, onVerified }: EmailVerifiedProps) => {
  const { isLoading } = useQuery({
    queryKey: code,
    queryFn: () => new Promise((res) => setTimeout(res, 5000)),
    onSuccess: () => {
      onVerified()
    },
  })

  return (
    <FlexBox flow="column" gap={2}>
      {isLoading ? <Loader variant="medium" /> : <SvgAlertsSuccess32 />}
      <Text margin={{ top: 4 }} variant="h500" as="h3">
        Email {isLoading ? 'verification' : 'verified'}
      </Text>
      <Text variant="t300" as="span" color="colorText">
        {isLoading ? 'Your email is being verified...' : 'Your email has been successfully verified.'}
      </Text>
    </FlexBox>
  )
}
