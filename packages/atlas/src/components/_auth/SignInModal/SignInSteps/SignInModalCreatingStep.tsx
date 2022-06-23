import { FC, useEffect } from 'react'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { SignInStepProps } from './SignInSteps.types'

export const SignInModalCreatingStep: FC<SignInStepProps> = ({ setPrimaryButtonProps, hasNavigatedBack }) => {
  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Waiting...',
      disabled: true,
    })
  }, [setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Creating membership..."
      subtitle="Please wait while your membership is being created. Our faucet server will create it for you so you don't need to worry about any fees. This should take about 15 seconds."
      loader
      hasNavigatedBack={hasNavigatedBack}
    />
  )
}
