import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { EmailAndSeedStep } from '@/components/_auth/ForgotPasswordModal/steps/EmailAndSeedStep'
import { NewPasswordStep } from '@/components/_auth/ForgotPasswordModal/steps/NewPasswordStep'
import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useAuthStore } from '@/providers/auth/auth.store'

import { ForgotPasswordModalForm, ForgotPasswordStep } from './ForgotPasswordModal.types'

const commonPasswordValidation = z
  .string()
  .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/, { message: 'Password has to meet requirements.' })
  .min(9, { message: 'Password has to meet requirements.' })

const schema = z.object({
  [ForgotPasswordStep.EmailAndSeedStep]: z.object({
    email: z.string().min(3, { message: 'Enter email address.' }).email({ message: 'Enter valid email address.' }),
    seed: z
      .string()
      .min(1, 'Enter mnemonic.')
      .regex(/^(\w+\s){11}\w+$/, { message: 'Mnemonic should contain 12 words separated by spaces.' }),
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
})

export const ForgotPasswordModal = () => {
  const [currentStep, setCurrentStep] = useState(ForgotPasswordStep.EmailAndSeedStep)
  const setAuthModalName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const isLastStep = currentStep === ForgotPasswordStep.NewPasswordStep
  const form = useForm<ForgotPasswordModalForm>({
    resolver: zodResolver(isLastStep ? schema : schema.pick({ [currentStep]: true })),
  })
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const handleEmailAndSeedStepSubmit = () => setCurrentStep(ForgotPasswordStep.NewPasswordStep)

  const handleNewPasswordStep = useCallback((data: ForgotPasswordModalForm) => {
    console.log('data', data)
  }, [])

  return (
    <DialogModal
      show={true}
      primaryButton={{
        text: currentStep === ForgotPasswordStep.NewPasswordStep ? 'Change password' : 'Continue',
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
      </FormProvider>
    </DialogModal>
  )
}
