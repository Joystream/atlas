import { FC, useEffect } from 'react'

import { TermsOfServiceWithoutPreamble } from '@/components/TermsOfService'
import { APP_NAME } from '@/config/env'

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
    <SignInModalStepTemplate
      title="Accept Terms of Service"
      subtitle={`Last updated on the 4th of May 2021. This Terms of Service ("Agreement") is a binding obligation between you ("User") and Jsgenesis AS ("Company", "We", "Us", "Our") for use of our Joystream Player interface ("${APP_NAME}") hosted at play.joystream.org and all other products (collectively "Software") developed and published by Us.`}
      hasNavigatedBack={hasNavigatedBack}
    >
      <TermsOfServiceWithoutPreamble standalone />
    </SignInModalStepTemplate>
  )
}
