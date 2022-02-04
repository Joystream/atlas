import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { StepperModal } from '@/components/_overlays/StepperModal'
import { QUERY_PARAMS } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useUser } from '@/providers/user'
import { urlParams } from '@/utils/url'

import { AccountStep } from './AccountStep'
import { CreateMemberModal } from './CreateMemberModal'
import { ExtensionStep } from './ExtensionStep'
import { TermsStep } from './TermsStep'

export const SignInStepsStepper: React.FC = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery(QUERY_PARAMS.LOGIN))
  const { extensionConnected, signIn, isLoading } = useUser()
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

  useEffect(() => {
    if (extensionConnected === null && step >= 1) {
      signIn()
    }
  }, [extensionConnected, signIn, step])

  return (
    <>
      <StepperModal
        currentStepIdx={step <= 0 ? 0 : step - 1}
        steps={steps}
        show={step >= 1 && !isLoading}
        onExitClick={() => navigate({ search: '' })}
      />
      <CreateMemberModal />
    </>
  )
}
