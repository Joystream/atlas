import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useMountEffect } from '@/hooks/useMountEffect'
import { SendEmailTokenErrors, useSendEmailToken } from '@/hooks/useSendEmailToken'
import { cVar } from '@/styles'

import { SetActionButtonHandlerSetter } from './types'

type ProvideEmailForLinkProps = {
  onSubmit: (email: string) => void
  setActionButtonHandler: SetActionButtonHandlerSetter
  defaultEmail?: string
  isExternal?: boolean
  yppVideoUrl?: string
}

export const ProvideEmailForLink = ({
  setActionButtonHandler,
  onSubmit,
  defaultEmail,
  isExternal,
  yppVideoUrl,
}: ProvideEmailForLinkProps) => {
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<{ email: string }>({
    defaultValues: {
      email: defaultEmail,
    },
    resolver: zodResolver(
      z.object({
        email: z.string().regex(/^\S+@\S+\.\S+$/, 'Enter valid email address.'),
      })
    ),
  })
  const { mutateAsync } = useSendEmailToken()
  // todo: validation
  // 1. Not an email
  // 2. Email already used (no idea how to check it?) - and allow to resend the link

  useMountEffect(() => {
    setActionButtonHandler((setLoading) => {
      handleSubmit(async (data) => {
        try {
          setLoading?.(true)
          await mutateAsync({ email: data.email, isExternal, yppVideoUrl })
          onSubmit(data.email)
        } catch (e) {
          const handledError = e.message
          if (handledError === SendEmailTokenErrors.INVALID_EMAIL) setError('email', { message: 'Invalid email.' })
          if (handledError === SendEmailTokenErrors.TOO_MANY_REQUESTS)
            setError('email', { message: 'Too many reqests, please wait.' })
        } finally {
          setLoading?.(false)
        }
      })()
    })
  })

  return (
    <FlexBox flow="column" gap={6}>
      <StyledAppLogo variant="short-monochrome" />
      <FlexBox flow="column" gap={2}>
        <Text variant="h500" as="h3">
          Enter email address
        </Text>
        <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
          Please enter your email address. We'll send you a link to complete the process.
        </Text>
      </FlexBox>

      <FormField error={errors.email?.message}>
        <Input
          {...register('email', {
            required: 'Please provide an email.',
          })}
          placeholder="Enter your email"
        />
      </FormField>
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
