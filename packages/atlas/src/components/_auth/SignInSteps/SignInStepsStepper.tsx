import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { StepperModal } from '@/components/_overlays/StepperModal'
import { QUERY_PARAMS } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useUser } from '@/providers/user'
import { urlParams } from '@/utils/url'

import { AccountStep } from './AccountStep'
import { CreateMemberModal } from './CreateMemberModal'
import { ExtensionStep } from './ExtensionStep'
import { TermsStep } from './TermsStep'

export const SignInStepsStepper: React.FC = () => {
  const headTags = useHeadTags('Sign in')
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<undefined | string>()
  const navigate = useNavigate()
  const step = useRouterQuery(QUERY_PARAMS.LOGIN)
  const stepNumber = Number(step)
  const { extensionConnected, signIn, isLoading } = useUser()

  const steps = [
    {
      title: 'Add Polkadot extension',
      element: <ExtensionStep nextStepPath={urlParams({ [QUERY_PARAMS.LOGIN]: 2 })} />,
    },
    {
      title: 'Connect account',
      element: (
        <AccountStep
          nextStepPath={urlParams({ [QUERY_PARAMS.LOGIN]: 3 })}
          selectedAccountAddress={selectedAccountAddress}
          setSelectedAccountAddress={setSelectedAccountAddress}
        />
      ),
    },
    {
      title: 'Accept ToS',
      element: <TermsStep />,
    },
  ]

  useEffect(() => {
    if (extensionConnected === null && stepNumber >= 1) {
      signIn()
    }
  }, [extensionConnected, signIn, stepNumber])

  const showStepper = stepNumber >= 1 && !isLoading
  const showCreateMemberModal = step === 'member'

  return (
    <>
      {(showStepper || showCreateMemberModal) && headTags}
      <StepperModal
        currentStepIdx={stepNumber <= 0 ? 0 : stepNumber - 1}
        steps={steps}
        show={showStepper}
        onExitClick={() => {
          navigate({ search: '' })
        }}
      />
      <CreateMemberModal show={showCreateMemberModal} selectedAccountAddress={selectedAccountAddress} />
    </>
  )
}
