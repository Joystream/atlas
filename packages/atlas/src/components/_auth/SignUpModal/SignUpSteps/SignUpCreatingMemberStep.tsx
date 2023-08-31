import { FC, useEffect } from 'react'

import { SignUpStepsCommonProps } from './SignUpSteps.types'

import { AuthenticationModalStepTemplate } from '../../AuthenticationModalStepTemplate'

export const SignUpCreatingMemberStep: FC<SignUpStepsCommonProps> = ({ setPrimaryButtonProps, hasNavigatedBack }) => {
  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Waiting...',
      disabled: true,
    })
  }, [setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      title="Creating membership..."
      subtitle="Please wait while your membership is being created. Our faucet server will create it for you so you don't need to worry about any fees. This may take up to 1 minute on a slow network."
      loader
      hasNavigatedBack={hasNavigatedBack}
    />
  )
}
