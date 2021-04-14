import { Multistepper } from '@/components'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import React, { useCallback, useEffect, useState } from 'react'
import SignInProccessView from './SignInProccessView'
import SignInMainView from './SignInMainView'
import { ExtensionStep, AccountStep, TermsStep } from './Steps'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { useRouterQuery } from '@/hooks'

const SignInJoinView = () => {
  const currentStep = useRouterQuery('step')
  const { dialogVisible, openDialog, closeDialog } = useSteps()

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep onAcceptTerms={closeDialog} />,
    },
  ]

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          key={currentStep ? 'shown' : 'not-shown'}
          classNames={transitions.names.fadeAndSlide}
          timeout={parseInt(transitions.timings.routing)}
        >
          {currentStep ? <SignInProccessView onOpenDialog={openDialog} /> : <SignInMainView />}
        </CSSTransition>
      </SwitchTransition>
      <Multistepper
        currentStepIdx={Number(currentStep)}
        steps={steps}
        showDialog={dialogVisible}
        onExitClick={closeDialog}
      />
    </>
  )
}

type DialogStep = {
  isActive?: boolean
}

const getDialogState = promisify(() => readFromLocalStorage<DialogStep>('dialogStep') || { isActive: false })

const updateDialogState = async (dialogStep: DialogStep) => {
  writeToLocalStorage('dialogStep', dialogStep)
}

const useSteps = () => {
  const [dialogVisible, setDialogVisible] = useState(false)

  const fetchDialogState = useCallback(async () => {
    const { isActive } = await getDialogState()
    setDialogVisible(isActive || false)
  }, [])

  useEffect(() => {
    fetchDialogState()
  }, [fetchDialogState])

  const openDialog = () => {
    setDialogVisible(true)
    updateDialogState({ isActive: true })
  }

  const closeDialog = () => {
    setDialogVisible(false)
    updateDialogState({ isActive: false })
  }

  return {
    openDialog,
    closeDialog,
    dialogVisible,
  }
}

export default SignInJoinView
