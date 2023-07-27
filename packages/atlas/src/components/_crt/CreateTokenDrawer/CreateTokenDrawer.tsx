import { useState } from 'react'

import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer'
import { SetupTokenStep } from '@/components/_crt/CreateTokenDrawer/steps/SetupTokenStep'

import { TokenIssuanceStep } from './steps/TokenIssuanceStep'

enum CREATE_TOKEN_STEPS {
  setup,
  issuance,
  summary,
}

const steps: string[] = ['Set up token', 'Tokens issuance', 'Token summary']

export type CommonStepProps = {
  setActionBarProps: (props: CrtDrawerProps['actionBar']) => void
}

export const CreateTokenDrawer = () => {
  const [activeStep, setActiveStep] = useState(CREATE_TOKEN_STEPS.issuance)
  const [actionBarProps, setActionBarProps] = useState<CrtDrawerProps['actionBar']>()
  return (
    <CrtDrawer steps={steps} activeStep={activeStep} isOpen={true} onClose={() => undefined} actionBar={actionBarProps}>
      {activeStep === CREATE_TOKEN_STEPS.setup && <SetupTokenStep setActionBarProps={setActionBarProps} />}
      {activeStep === CREATE_TOKEN_STEPS.issuance && <TokenIssuanceStep setActionBarProps={setActionBarProps} />}
    </CrtDrawer>
  )
}
