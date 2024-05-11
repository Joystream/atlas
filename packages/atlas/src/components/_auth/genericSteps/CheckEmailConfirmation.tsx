import styled from '@emotion/styled'
import { useMutation } from 'react-query'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'

type CheckEmailConfirmationProps = {
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
  onSuccess?: () => void
  onFailure?: () => void
}

export const CheckEmailConfirmation = ({
  setActionButtonHandler,
  onSuccess,
  onFailure,
}: CheckEmailConfirmationProps) => {
  const { displaySnackbar } = useSnackbar()
  const { mutateAsync } = useMutation({
    mutationKey: 'single',
    mutationFn: async () => console.log('resending email confimation'),
  })

  useMountEffect(() => {
    const handleMutation = () =>
      mutateAsync()
        .then(onSuccess)
        .catch((error) => {
          onFailure?.()
          displaySnackbar({
            iconType: 'error',
            title: 'Failed to resend confirmation link',
          })
          SentryLogger.error('Failed to resend confirmation link', 'CheckEmailConfirmation', error)
        })
    setActionButtonHandler(() => handleMutation())
  })

  return (
    <FlexBox flow="column" gap={3}>
      <StyledAppLogo variant="short-monochrome" />
      <Text variant="h500" as="h3">
        We sent you a confirmation link
      </Text>
      <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
        Check your email and click the link we sent you to complete the process.
      </Text>
    </FlexBox>
  )
}

const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`
