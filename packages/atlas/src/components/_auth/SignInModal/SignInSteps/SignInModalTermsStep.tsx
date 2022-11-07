import { FC, useEffect } from 'react'

import { TermsOfService } from '@/components/TermsOfService'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { SignInStepProps } from './SignInSteps.types'

export const SignInModalTermsStep: FC<SignInStepProps> = ({
  setPrimaryButtonProps,
  goToNextStep,
  hasNavigatedBack,
}) => {
  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Accept terms',
      onClick: goToNextStep,
    })
  }, [goToNextStep, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate title="Accept Terms of Service" hasNavigatedBack={hasNavigatedBack}>
      <TermsOfService />
    </SignInModalStepTemplate>
  )
}
