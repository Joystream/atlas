import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useRouterQuery } from '@/hooks/useRouterQuery'
import { transitions } from '@/theme'

import { SignInMainView } from './SignInMainView'
import { SignInProcessView } from './SignInProcessView'

export const SignInJoinView = () => {
  const currentStep = useRouterQuery('step')
  return (
    <SwitchTransition>
      <CSSTransition
        key={currentStep ? 'shown' : 'not-shown'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {currentStep ? <SignInProcessView /> : <SignInMainView />}
      </CSSTransition>
    </SwitchTransition>
  )
}
