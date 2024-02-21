import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { FlexBox } from '@/components/FlexBox'
import { Button, TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { LogInErrors } from '@/providers/auth/auth.types'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { Container, ForgotPasswordButton } from './LogInModal.styles'

import { AuthenticationModalStepTemplate } from '../AuthenticationModalStepTemplate'

export const LogInModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleLogin, refetchCurrentUser } = useAuth()
  const { displaySnackbar } = useSnackbar()
  const [hidePasswordProps] = useHidePasswordInInput(false)
  const { trackPageView } = useSegmentAnalytics()

  const setYppModalOpenName = useYppStore((state) => state.actions.setYppModalOpenName)

  const shouldContinueYppFlowAfterLogin = useYppStore((store) => store.shouldContinueYppFlowAfterLogin)

  useEffect(() => {
    trackPageView('Log In')
  }, [trackPageView])

  const {
    register,
    handleSubmit: _handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .min(3, { message: 'Enter email address.' })
          .regex(/^\S+@\S+\.\S+$/, 'Enter valid email address.'),
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
    try {
      setIsLoading(true)
      await handleLogin({ type: 'internal', email, password })
      setAuthModalOpenName(undefined)
      await refetchCurrentUser()
      if (shouldContinueYppFlowAfterLogin) {
        setYppModalOpenName('ypp-requirements')
      }
    } catch (error) {
      if (error.message === LogInErrors.ArtifactsNotFound) {
        displaySnackbar({
          title: `We can't find ${atlasConfig.general.appName} membership associated with this email`,
          description: `Make sure that you are using the same email that you used to create your membership on ${atlasConfig.general.appName}.`,
          iconType: 'error',
        })
        setError('email', { type: 'custom', message: 'Incorrect email or password.' })
        setError('password', { type: 'custom', message: 'Incorrect email or password.' })
      }
    } finally {
      setIsLoading(false)
    }
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
        text: isLoading ? 'Waiting...' : 'Sign in',
        disabled: isLoading,
        onClick: handleSubmit,
      }}
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
          title="Sign in"
          subtitle={
            <FlexBox flow="column" alignItems="flex-start">
              <span>
                Use your {atlasConfig.general.appName} account.{' '}
                <TextButton onClick={() => setAuthModalOpenName('signUp')}>Create account</TextButton>
              </span>
              <div>
                <TextButton onClick={() => setAuthModalOpenName('externalLogIn')}>Use local wallet</TextButton>
              </div>
            </FlexBox>
          }
          hasNavigatedBack
        >
          <Container>
            <FormField label="Email" error={errors.email?.message}>
              <Input
                {...register('email')}
                placeholder="Email"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
            </FormField>
            <FormField label="Password" error={errors.password?.message}>
              <Input
                data-ls-disabled
                {...register('password')}
                placeholder="Password"
                {...hidePasswordProps}
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
            </FormField>
            <ForgotPasswordButton onClick={() => setAuthModalOpenName('forgotPassword')}>
              Forgot password?
            </ForgotPasswordButton>
          </Container>
        </AuthenticationModalStepTemplate>
      ) : (
        <AuthenticationModalStepTemplate
          title="Logging in"
          subtitle="Please wait while we log you in. This should take about 10 seconds."
          loader
          hasNavigatedBack
        />
      )}
    </DialogModal>
  )
}
