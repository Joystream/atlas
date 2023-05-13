import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import {
  Container,
  StyledAppLogo,
  StyledButton,
  StyledHideSvg,
  StyledShowSvg,
  TextCointainer,
} from '@/components/_auth/LogInModal/LogInModal.styles'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useLogIn } from '@/hooks/useLogIn'

export const LogInModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordShown, setPasswordShown] = useState(false)
  const handleLogIn = useLogIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: (data, ctx, options) => {
      const resolver = zodResolver(
        z.object({
          email: z.string().email(),
          password: z.string().min(1, 'Please provide password'),
        })
      )

      return resolver(data, ctx, options)
    },
  })
  return (
    <DialogModal
      show
      primaryButton={{
        text: 'Log in',
        disabled: isLoading,
        onClick: () =>
          handleSubmit((data) => {
            setIsLoading(true)
            handleLogIn(data.email, data.password).finally(() => {
              setIsLoading(false)
            })
          })(),
      }}
      secondaryButton={{
        text: 'Sign up',
      }}
      additionalActionsNode={<Button variant="tertiary">Close</Button>}
    >
      <Container>
        <StyledAppLogo variant="short-monochrome" />
        <TextCointainer>
          <Text variant="h500" as="h5">
            Log in
          </Text>
          <Text variant="t200" as="p" color="colorText">
            Use your {atlasConfig.general.appName} account.
          </Text>
        </TextCointainer>
        <FormField error={errors.email?.message}>
          <Input {...register('email')} placeholder="Email" />
        </FormField>
        <FormField error={errors.password?.message}>
          <Input
            {...register('password')}
            placeholder="Password"
            type={isPasswordShown ? 'text' : 'password'}
            nodeEnd={
              <Tooltip text={isPasswordShown ? 'Hide' : 'Show'} placement="top">
                <StyledButton
                  icon={isPasswordShown ? <StyledHideSvg /> : <StyledShowSvg />}
                  variant="tertiary"
                  onClick={() => {
                    setPasswordShown((prev) => !prev)
                  }}
                />
              </Tooltip>
            }
          />
        </FormField>
      </Container>
    </DialogModal>
  )
}
