import { useRouterQuery } from '@/hooks'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import SignInMainView from './SignInMainView'
import SignInProccessView from './SignInProccessView'

const SignInJoinView = () => {
  const currentStep = useRouterQuery('step')
  return (
    <SwitchTransition>
      <CSSTransition
        key={currentStep ? 'shown' : 'not-shown'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {currentStep ? <SignInProccessView /> : <SignInMainView />}
      </CSSTransition>
    </SwitchTransition>
  )
}

export default SignInJoinView
