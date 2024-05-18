import styled from '@emotion/styled'
import { useState } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { useMountEffect } from '@/hooks/useMountEffect'
import { SendEmailTokenErrors, useSendEmailToken } from '@/hooks/useSendEmailToken'
import { useSnackbar } from '@/providers/snackbars'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { SetActionButtonHandlerSetter } from './types'

type CheckEmailConfirmationProps = {
  setActionButtonHandler: SetActionButtonHandlerSetter
  onSuccess?: () => void
  onFailure?: () => void
  email?: string
}

export const CheckEmailConfirmation = ({
  email,
  setActionButtonHandler,
  onSuccess,
  onFailure,
}: CheckEmailConfirmationProps) => {
  const { displaySnackbar } = useSnackbar()
  const { mutateAsync } = useSendEmailToken()
  const [error, setError] = useState('')

  useMountEffect(() => {
    setActionButtonHandler(async (setLoading) => {
      if (!email) {
        displaySnackbar({
          iconType: 'error',
          title: 'Missing email. Please start over.',
        })
        return
      }
      try {
        setError('')
        setLoading?.(true)
        await mutateAsync(email)
        onSuccess?.()
      } catch (e) {
        onFailure?.()
        displaySnackbar({
          iconType: 'error',
          title: 'Failed to resend confirmation link',
        })
        SentryLogger.error('Failed to resend confirmation link', 'CheckEmailConfirmation', error)
        const handledError = e.message
        if (handledError === SendEmailTokenErrors.TOO_MANY_REQUESTS) setError('Too many reqests, please wait.')
      } finally {
        setLoading?.(false)
      }
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
      {error ? (
        <Text variant="t300" as="p" color="colorTextError">
          {error}
        </Text>
      ) : null}
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
