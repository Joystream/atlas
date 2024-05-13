import styled from '@emotion/styled'
import { useMutation } from 'react-query'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { SetActionButtonHandlerSetter } from './types'

type CheckEmailConfirmationProps = {
  setActionButtonHandler: SetActionButtonHandlerSetter
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
    mutationFn: async () => new Promise((res) => setTimeout(res, 5000)),
  })

  useMountEffect(() => {
    setActionButtonHandler((setter) => {
      setter?.(true)
      return mutateAsync()
        .then(onSuccess)
        .catch((error) => {
          onFailure?.()
          displaySnackbar({
            iconType: 'error',
            title: 'Failed to resend confirmation link',
          })
          SentryLogger.error('Failed to resend confirmation link', 'CheckEmailConfirmation', error)
        })
        .finally(() => setter?.(false))
    })
  })

  return (
    <FlexBox flow="column" gap={2}>
      <StyledAppLogo variant="short-monochrome" />
      <Text margin={{ top: 4 }} variant="h500" as="h3">
        We sent you a confirmation link
      </Text>
      <Text variant="t300" as="span" color="colorText">
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
