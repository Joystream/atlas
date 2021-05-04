import { useRouterQuery } from '@/hooks'
import React from 'react'
import { useNavigate } from 'react-router'
import { Multistepper } from '../Dialogs'
import AccountStep from './AccountStep'
import ExtensionStep from './ExtensionStep'
import TermsStep from './TermsStep'

const SignInStepsStepper: React.FC = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep nextStepPath="?step=2" />,
    },
    {
      title: 'Connect account',
      element: <AccountStep nextStepPath="?step=3" />,
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
      onExitClick={() => navigate('?step=0')}
    />
  )
}

export default SignInStepsStepper
