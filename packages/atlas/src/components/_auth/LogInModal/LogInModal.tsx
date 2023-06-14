import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { LogInErrors } from '@/providers/auth/auth.types'
import { useSnackbar } from '@/providers/snackbars'

import { Container } from './LogInModal.styles'

import { AuthenticationModalStepTemplate } from '../AuthenticationModalStepTemplate'

export const LogInModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordShown, setPasswordShown] = useState(false)
  const { handleLogin, refetchCurrentUser } = useAuth()
  const { displaySnackbar } = useSnackbar()
  const {
    register,
    handleSubmit: _handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().min(3, { message: 'Enter email address.' }).email({ message: 'Enter valid email address.' }),
        password: z.string().min(1, 'Enter password.'),
      })
    ),
  })
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )

  const handleLoginClick = async (email: string, password: string) => {
    setIsLoading(true)
    handleLogin({ type: 'internal', email, password })
      .then(() => {
        setAuthModalOpenName(undefined)
        refetchCurrentUser()
      })
      .catch((error) => {
        if (error.message === LogInErrors.ArtifactsNotFound) {
          displaySnackbar({
            title: `We can't find ${atlasConfig.general.appName} membership associated with this email`,
            description: `Make sure that you are using the same email that you used to create your membership on ${atlasConfig.general.appName}.`,
            iconType: 'error',
          })
          setError('email', { type: 'custom', message: 'Incorrect email or password.' })
          setError('password', { type: 'custom', message: 'Incorrect email or password.' })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSubmit = () =>
    _handleSubmit((data) => {
      handleLoginClick(data.email, data.password)
    })()

  return (
    <DialogModal
      disableBackdropAnimation
      show={authModalOpenName === 'logIn'}
      primaryButton={{
        text: isLoading ? 'Waiting...' : 'Log in',
        disabled: isLoading,
        onClick: handleSubmit,
      }}
      secondaryButton={
        !isLoading
          ? {
              text: 'Sign up',
              onClick: () => setAuthModalOpenName('signUp'),
            }
          : undefined
      }
      additionalActionsNode={
        !isLoading && (
          <Button variant="tertiary" onClick={() => setAuthModalOpenName(undefined)}>
            Close
          </Button>
        )
      }
    >
      {!isLoading ? (
        <AuthenticationModalStepTemplate
          title="Log in"
          subtitle={`Use your ${atlasConfig.general.appName} account.`}
          hasNavigatedBack
        >
          <Container>
            <FormField label="Email" error={errors.email?.message}>
              <Input {...register('email')} placeholder="Email" />
            </FormField>
            <FormField label="Password" error={errors.password?.message}>
              <Input
                {...register('password')}
                placeholder="Password"
                type={isPasswordShown ? 'text' : 'password'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
                actionButton={{
                  tooltipText: isPasswordShown ? 'Hide' : 'Show',
                  dontFocusOnClick: true,
                  icon: isPasswordShown ? <SvgActionHide /> : <SvgActionShow />,
                  onClick: () => {
                    setPasswordShown((prev) => !prev)
                  },
                }}
              />
            </FormField>
          </Container>
        </AuthenticationModalStepTemplate>
      ) : (
        <AuthenticationModalStepTemplate
          title="Logginng in"
          subtitle="Please wait while we log you in. This should take about 10 seconds."
          loader
          hasNavigatedBack
        />
      )}
    </DialogModal>
  )
}
