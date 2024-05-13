import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar } from '@/styles'

import { SetActionButtonHandlerSetter } from './types'

type ProvideEmailForLinkProps = {
  onSubmit: (email: string) => void
  setActionButtonHandler: SetActionButtonHandlerSetter
  resendEmailHandler?: (email: string) => void | Promise<void>
}

export const ProvideEmailForLink = ({ setActionButtonHandler, onSubmit }: ProvideEmailForLinkProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>()
  // todo: validation
  // 1. Not an email
  // 2. Email already used (no idea how to check it?) - and allow to resend the link

  useMountEffect(() => {
    setActionButtonHandler(() => {
      handleSubmit((data) => {
        onSubmit(data.email)
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
