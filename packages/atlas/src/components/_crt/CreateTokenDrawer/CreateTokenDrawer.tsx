import { useRef, useState } from 'react'

import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer'

import { CreateTokenForm } from './CreateTokenDrawer.types'
import { SetupTokenStep, TokenIssuanceStep, TokenSummaryStep } from './steps'

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
  const formData = useRef<CreateTokenForm>(CREATOR_TOKEN_INITIAL_DATA)
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
            formData.current = { ...formData.current, ...data }
            setActiveStep(CREATE_TOKEN_STEPS.issuance)
          }}
          setPrimaryButtonProps={setPrimaryButtonProps}
        />
      )}
      {activeStep === CREATE_TOKEN_STEPS.issuance && (
        <TokenIssuanceStep
          tokenName={formData.current.name}
          onSubmit={(data) => {
            formData.current = { ...formData.current, ...data }
            setActiveStep(CREATE_TOKEN_STEPS.summary)
          }}
          setPrimaryButtonProps={setPrimaryButtonProps}
        />
      )}
      {activeStep === CREATE_TOKEN_STEPS.summary && (
        <TokenSummaryStep form={formData.current} setPrimaryButtonProps={setPrimaryButtonProps} />
      )}
    </CrtDrawer>
  )
}
