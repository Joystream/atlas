import { useState } from 'react'

import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer'
import { SetupTokenStep } from '@/components/_crt/CreateTokenDrawer/steps/SetupTokenStep'
import { TokenSummaryStep } from '@/components/_crt/CreateTokenDrawer/steps/TokenSummaryStep'

import { TokenIssuanceStep } from './steps/TokenIssuanceStep'

enum CREATE_TOKEN_STEPS {
  setup,
  issuance,
  summary,
}

const steps: string[] = ['Set up token', 'Tokens issuance', 'Token summary']

export const CreateTokenDrawer = () => {
  const [activeStep, setActiveStep] = useState(CREATE_TOKEN_STEPS.summary)
  const [primaryButtonProps, setPrimaryButtonProps] =
    useState<NonNullable<CrtDrawerProps['actionBar']>['primaryButton']>()
  return (
    <CrtDrawer
      steps={steps}
      activeStep={activeStep}
      isOpen={true}
      onClose={() => undefined}
      actionBar={{
        primaryButton: primaryButtonProps ?? {},
      }}
    >
      {activeStep === CREATE_TOKEN_STEPS.setup && <SetupTokenStep setPrimaryButtonProps={setPrimaryButtonProps} />}
      {activeStep === CREATE_TOKEN_STEPS.summary && <TokenSummaryStep setPrimaryButtonProps={setPrimaryButtonProps} />}
      {activeStep === CREATE_TOKEN_STEPS.issuance && (
        <TokenIssuanceStep setPrimaryButtonProps={setPrimaryButtonProps} />
      )}
    </CrtDrawer>
  )
}
