import React from 'react'
import { useNavigate } from 'react-router'

import { StepperModal } from '@/components/_overlays/StepperModal'
import { QUERY_PARAMS } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { urlParams } from '@/utils/url'

import { AccountStep } from './AccountStep'
import { ExtensionStep } from './ExtensionStep'
import { TermsStep } from './TermsStep'

export const SignInStepsStepper: React.FC = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery(QUERY_PARAMS.LOGIN))
  const steps = [
    {
      title: 'Add Polkadot extension',
      element: <ExtensionStep nextStepPath={urlParams({ [QUERY_PARAMS.LOGIN]: 2 })} />,
    },
    {
      title: 'Connect account',
      element: <AccountStep nextStepPath={urlParams({ [QUERY_PARAMS.LOGIN]: 3 })} />,
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
      onExitClick={() => navigate({ search: '' })}
    />
  )
}
