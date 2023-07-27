import { useState } from 'react'

import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer'
import { CreateTokenForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'
import { SetupTokenStep } from '@/components/_crt/CreateTokenDrawer/steps/SetupTokenStep'
import { TokenSummaryStep } from '@/components/_crt/CreateTokenDrawer/steps/TokenSummaryStep'

import { TokenIssuanceStep } from './steps/TokenIssuanceStep'

enum CREATE_TOKEN_STEPS {
  setup,
  issuance,
  summary,
}

const steps: string[] = ['Set up token', 'Tokens issuance', 'Token summary']

const CREATOR_TOKEN_INITIAL_DATA: CreateTokenForm = {
  name: '',
  isOpen: true,
  revenueShare: 0,
  creatorReward: 0,
  creatorIssueAmount: 0,
  assuranceType: 'default',
  cliff: null,
  vesting: null,
  firstPayout: 0,
}

export const CreateTokenDrawer = () => {
  const [activeStep, setActiveStep] = useState(CREATE_TOKEN_STEPS.setup)
  const [formData, setFormData] = useState<CreateTokenForm>(CREATOR_TOKEN_INITIAL_DATA)
  const [primaryButtonProps, setPrimaryButtonProps] =
    useState<NonNullable<CrtDrawerProps['actionBar']>['primaryButton']>()

  return (
    <CrtDrawer
      steps={steps}
      activeStep={activeStep}
      isOpen={true}
      onClose={() => undefined}
      actionBar={{
        isNoneCrypto: true,
        primaryButton: primaryButtonProps ?? {},
      }}
    >
      {activeStep === CREATE_TOKEN_STEPS.setup && (
        <SetupTokenStep
          onSubmit={(data) => {
            setFormData((prev) => ({ ...prev, ...data }))
            setActiveStep(CREATE_TOKEN_STEPS.issuance)
          }}
          setPrimaryButtonProps={setPrimaryButtonProps}
        />
      )}
      {activeStep === CREATE_TOKEN_STEPS.issuance && (
        <TokenIssuanceStep
          onSubmit={(data) => {
            setFormData((prev) => ({ ...prev, ...data }))
            setActiveStep(CREATE_TOKEN_STEPS.summary)
          }}
          setPrimaryButtonProps={setPrimaryButtonProps}
        />
      )}
      {activeStep === CREATE_TOKEN_STEPS.summary && (
        <TokenSummaryStep form={formData} setPrimaryButtonProps={setPrimaryButtonProps} />
      )}
    </CrtDrawer>
  )
}
