import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useRouterQuery } from '@/hooks'

import { AccountStep } from './AccountStep'
import { ExtensionStep } from './ExtensionStep'
import { TermsStep } from './TermsStep'

import { Multistepper } from '../Dialogs'

export const SignInStepsStepper: React.FC = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))
  const [isStepperOpen, setIsStepperOpen] = useState(false)

  useEffect(() => {
    if (step >= 1 || step > 3) {
      setIsStepperOpen(true)
    } else {
      setIsStepperOpen(false)
    }
  }, [step])

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
    <Multistepper
      currentStepIdx={step <= 0 ? 0 : step - 1}
      steps={steps}
      showDialog={isStepperOpen}
      onExitClick={() => navigate('?step=0')}
    />
  )
}
