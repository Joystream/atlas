import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { u8aToHex } from '@polkadot/util'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { axiosInstance } from '@/api/axios'
import { useGetCurrentAccountLazyQuery } from '@/api/queries/__generated__/accounts.generated'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { EmailAndSeedStep } from '@/components/_auth/ForgotPasswordModal/steps/EmailAndSeedStep'
import { NewPasswordStep } from '@/components/_auth/ForgotPasswordModal/steps/NewPasswordStep'
import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { getAuthEpoch, loginRequest, logoutRequest, prepareEncryptionArtifacts } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { ForgotPasswordModalForm, ForgotPasswordStep } from './ForgotPasswordModal.types'

const commonPasswordValidation = z
  .string()
  .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/, { message: 'Password has to meet requirements.' })
  .min(9, { message: 'Password has to meet requirements.' })

const schema = z.object({
  [ForgotPasswordStep.EmailAndSeedStep]: z.object({
    email: z
      .string()
      .min(3, { message: 'Enter email address.' })
      .regex(/^\S+@\S+\.\S+$/, 'Enter valid email address.'),
    mnemonic: z
      .string()
      .min(1, 'Enter wallet seed phrase.')
      .regex(/^(\w+\s){11}\w+$/, { message: 'Wallet seed phrase should contain 12 words separated by spaces.' }),
  }),
  [ForgotPasswordStep.NewPasswordStep]: z
    .object({
      password: commonPasswordValidation,
      confirmPassword: commonPasswordValidation,
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword
      },
      {
        path: ['confirmPassword'],
        message: 'Password address has to match.',
      }
    ),
  [ForgotPasswordStep.LoadingStep]: z.any(),
})

export const ForgotPasswordModal = () => {
  const [currentStep, setCurrentStep] = useState(ForgotPasswordStep.EmailAndSeedStep)
  const [isLoading, setIsLoading] = useState(false)
  const [accountId, setAccountId] = useState<string>()
  const { displaySnackbar } = useSnackbar()
  const setAuthModalName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const isLastStep = currentStep === ForgotPasswordStep.NewPasswordStep
  const [lazyCurrentAccountQuery] = useGetCurrentAccountLazyQuery()

  const form = useForm<ForgotPasswordModalForm>({
    resolver: zodResolver(
      isLastStep ? schema : schema.pick({ [currentStep]: true } as Record<ForgotPasswordStep, true | never>)
    ),
  })
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const handleEmailAndSeedStepSubmit = async (data: ForgotPasswordModalForm) => {
    setIsLoading(true)

    try {
      const timestamp = (await getAuthEpoch()) - 30_000
      const keypair = keyring.addFromMnemonic(data['EmailAndSeedStep'].mnemonic)
      const address = keypair.address
      const loginPayload = {
        joystreamAccountId: address,
        gatewayName: atlasConfig.general.appName,
        timestamp,
        action: 'login' as const,
      }
      const loginSignature = await keypair.sign(JSON.stringify(loginPayload))
      const loginResponse = await loginRequest(u8aToHex(loginSignature), loginPayload)
      const accData = await lazyCurrentAccountQuery()

      if (accData.data?.accountData.email !== data['EmailAndSeedStep'].email) {
        form.setError(`${ForgotPasswordStep.EmailAndSeedStep}.email`, {
          message: 'Provided email do not match wallet seed phrase.',
        })
        logoutRequest().catch((error) => {
          SentryLogger.error('Failed to logout when recovering password', 'ForgotPasswordModal', error)
        })
        return
      }

      setAccountId(loginResponse.data.accountId)
      setCurrentStep(ForgotPasswordStep.NewPasswordStep)
    } catch (error) {
      displaySnackbar({
        title: 'Something went wrong',
        description: `We encountered unexpected error. Please try again.`,
        iconType: 'error',
      })
      SentryLogger.error('Failed to login when recovering password', 'ForgotPasswordModal', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPasswordStep = useCallback(
    async (data: ForgotPasswordModalForm) => {
      if (!accountId) {
        displaySnackbar({
          title: 'Something went wrong',
          description: `We couldn't find account associated with given credentials. Please try again.`,
          iconType: 'error',
        })
        return
      }
      setCurrentStep(ForgotPasswordStep.LoadingStep)
      const timestamp = (await getAuthEpoch()) - 30_000
      try {
        const keypair = keyring.addFromMnemonic(data['EmailAndSeedStep'].mnemonic)
        const address = keypair.address

        const newArtifacts = await prepareEncryptionArtifacts(
          data['EmailAndSeedStep'].email,
          data['NewPasswordStep'].password,
          data['EmailAndSeedStep'].mnemonic
        )
        const forgetPayload = {
          joystreamAccountId: address,
          gatewayName: atlasConfig.general.appName,
          timestamp,
          action: 'changeAccount',
          gatewayAccountId: accountId,
          newArtifacts,
        }
        const forgetPayloadSignature = await keypair.sign(JSON.stringify(forgetPayload))

        await axiosInstance.post<{ accountId: string }>(
          `${ORION_AUTH_URL}/change-account`,
          {
            signature: u8aToHex(forgetPayloadSignature),
            payload: forgetPayload,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        displaySnackbar({
          title: 'Password has been changed',
          description: 'You can now sign in to your account using the new password',
          iconType: 'success',
        })
        setAuthModalName('logIn')
      } catch (error) {
        displaySnackbar({
          title: 'Something went wrong',
          description: `We encountered unexpected error. Please try again.`,
          iconType: 'error',
        })
        SentryLogger.error('Failed to change password', 'ForgotPasswordModal', error)
      } finally {
        setCurrentStep(ForgotPasswordStep.NewPasswordStep)
      }
    },
    [accountId, displaySnackbar, setAuthModalName]
  )

  return (
    <DialogModal
      show={authModalOpenName === 'forgotPassword'}
      primaryButton={{
        disabled: isLoading,
        text: isLoading
          ? 'Checking...'
          : currentStep === ForgotPasswordStep.NewPasswordStep
          ? 'Change password'
          : 'Continue',
        onClick: () => {
          form.handleSubmit(
            currentStep === ForgotPasswordStep.EmailAndSeedStep ? handleEmailAndSeedStepSubmit : handleNewPasswordStep
          )()
        },
      }}
      secondaryButton={{
        text: 'Back',
        onClick: () =>
          currentStep === ForgotPasswordStep.EmailAndSeedStep
            ? setAuthModalName('logIn')
            : setCurrentStep(ForgotPasswordStep.EmailAndSeedStep),
      }}
      dividers={currentStep === ForgotPasswordStep.NewPasswordStep}
      additionalActionsNode={
        <Button variant="tertiary" onClick={() => setAuthModalOpenName(undefined)}>
          Close
        </Button>
      }
    >
      <FormProvider {...form}>
        {currentStep === ForgotPasswordStep.EmailAndSeedStep && <EmailAndSeedStep />}
        {currentStep === ForgotPasswordStep.NewPasswordStep && <NewPasswordStep />}
        {currentStep === ForgotPasswordStep.LoadingStep && (
          <AuthenticationModalStepTemplate
            title="Changing password"
            subtitle="Please wait while we change your password. This should take no more than 10 seconds."
            loader
            hasNavigatedBack
          />
        )}
      </FormProvider>
    </DialogModal>
  )
}
