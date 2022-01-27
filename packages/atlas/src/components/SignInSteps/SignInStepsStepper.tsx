import React from 'react'
import { useNavigate } from 'react-router'

import { StepperModal } from '@/components/_overlays/StepperModal'
import { useRouterQuery } from '@/hooks/useRouterQuery'

import { AccountStep } from './AccountStep'
import { ExtensionStep } from './ExtensionStep'
import { TermsStep } from './TermsStep'

export const SignInStepsStepper: React.FC = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))

  const steps = [
    {
      title: 'Add Polkadot extension',
      element: <ExtensionStep nextStepPath="?step=2" />,
    },
    {
      title: 'Connect account',
      element: <AccountStep nextStepPath="?step=3" />,
    },
    {
      title: 'Accept ToS',
      element: <TermsStep />,
    },
  ]

  return (
    <StepperModal
      currentStepIdx={step <= 0 ? 0 : step - 1}
      steps={steps}
      show={step >= 1}
      onExitClick={() => navigate('?step=0')}
    />
  )
}
