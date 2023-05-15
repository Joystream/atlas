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
import { SignInModalStepTemplate } from '@/components/_auth/SignInModal/SignInSteps/SignInModalStepTemplate'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { LogInErrors, useLogIn } from '@/hooks/useLogIn'
import { useSnackbar } from '@/providers/snackbars'

export const LogInModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordShown, setPasswordShown] = useState(false)
  const handleLogIn = useLogIn()
  const { displaySnackbar } = useSnackbar()
  const {
    register,
    handleSubmit,
    setError,
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

  const onLogin = async (email: string, password: string) => {
    setIsLoading(true)
    const res = await handleLogIn(email, password)

    if (res.error === LogInErrors.ArtifactsNotFound) {
      displaySnackbar({
        title: `We can’t find ${atlasConfig.general.appName} membership associated with this email`,
        description: `Make sure that you are using the same email that tou used to create your membership on ${atlasConfig.general.appName}.`,
        iconType: 'error',
      })
      setError('email', { type: 'custom', message: 'Incorrect email or password.' })
      setError('password', { type: 'custom', message: 'Incorrect email or password.' })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }

  return (
    <DialogModal
      show
      primaryButton={
        !isLoading
          ? {
              text: 'Log in',
              disabled: isLoading,
              onClick: () =>
                handleSubmit((data) => {
                  onLogin(data.email, data.password)
                })(),
            }
          : {
              text: 'Waiting...',
              disabled: true,
            }
      }
      secondaryButton={
        !isLoading
          ? {
              text: 'Sign up',
            }
          : undefined
      }
      additionalActionsNode={!isLoading && <Button variant="tertiary">Close</Button>}
    >
      {!isLoading ? (
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
          <FormField label="Email" error={errors.email?.message}>
            <Input {...register('email')} placeholder="Email" />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
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
      ) : (
        <SignInModalStepTemplate
          title="Logginng in"
          subtitle="Please wait while we log you in. This should take about 10 seconds."
          loader
          hasNavigatedBack
        />
      )}
    </DialogModal>
  )
}
