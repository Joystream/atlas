import { useRouterQuery } from '@/hooks'
import React from 'react'
import { useNavigate } from 'react-router'
import { Multistepper } from '../Dialogs'
import AccountStep from './AccountStep'
import ExtensionStep from './ExtensionStep'
import TermsStep from './TermsStep'

type SignInStepsStepperProps = {
  path: (query: { step: string }) => string
}

const SignInStepsStepper: React.FC<SignInStepsStepperProps> = ({ path }) => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))
  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep nextStepPath={path({ step: '2' })} />,
    },
    {
      title: 'Connect accounts',
      element: <AccountStep nextStepPath={path({ step: '3' })} />,
    },
    {
      title: 'Terms & Conditions',
      element: <TermsStep />,
    },
  ]

  return (
    <Multistepper
      currentStepIdx={step <= 0 ? 0 : step - 1}
      steps={steps}
      showDialog={step >= 1}
      onExitClick={() => navigate(path({ step: '0' }))}
    />
  )
}

export default SignInStepsStepper
