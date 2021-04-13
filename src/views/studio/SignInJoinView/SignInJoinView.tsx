import { Multistepper } from '@/components'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { Membership } from '@joystream/types/members'
import { web3Enable } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'
import SignInProccessView from './SignInProccessView'
import SignInMainView from './SignInMainView'
import { ExtensionStep, AccountStep, TermsStep } from './Steps'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

const SignInJoinView = () => {
  const [memberships, setMemberships] = useState<Membership[]>()
  const [isProccessShown, setIsProccessShown] = useState(false)
  const { dialogVisible, openDialog, closeDialog, changeDialogStep, step } = useSteps()

  const checkIfExtensionIsIntalled = useCallback(async () => {
    const extensions = await web3Enable('Joystream Atlas')
    if (extensions.length) {
      const polkadotJs = extensions.find((e) => e.name === 'polkadot-js')
      if (polkadotJs) {
        changeDialogStep(1)
      }
    }
  }, [changeDialogStep])

  useEffect(() => {
    checkIfExtensionIsIntalled()
  }, [checkIfExtensionIsIntalled])

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep onStepChange={changeDialogStep} currentStepIdx={step} />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep onStepChange={changeDialogStep} />,
    },
  ]

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          key={isProccessShown ? 'shown' : 'not-shown'}
          classNames={transitions.names.fadeAndSlide}
          timeout={parseInt(transitions.timings.routing)}
        >
          {isProccessShown ? (
            <SignInProccessView onOpenDialog={openDialog} />
          ) : (
            <SignInMainView onButtonClick={() => setIsProccessShown(true)} />
          )}
        </CSSTransition>
      </SwitchTransition>
      <Multistepper currentStepIdx={step} steps={steps} showDialog={dialogVisible} onExitClick={closeDialog} />
    </>
  )
}

type DialogStep = {
  step: number
  isActive?: boolean
}

const getDialogState = promisify(() => readFromLocalStorage<DialogStep>('dialogStep') || { step: 0, isActive: false })

const updateDialogState = async (dialogStep: DialogStep) => {
  writeToLocalStorage('dialogStep', dialogStep)
}

const useSteps = () => {
  const [step, setCurrentStep] = useState(0)
  const [dialogVisible, setDialogVisible] = useState(false)

  const fetchDialogState = useCallback(async () => {
    const { step, isActive } = await getDialogState()
    setCurrentStep(step)
    setDialogVisible(isActive || false)
  }, [])

  useEffect(() => {
    fetchDialogState()
  }, [fetchDialogState])

  const openDialog = () => {
    setDialogVisible(true)
    updateDialogState({ step: step, isActive: true })
  }

  const closeDialog = () => {
    setDialogVisible(false)
    updateDialogState({ step: 0, isActive: false })
  }

  const changeDialogStep = useCallback((newStep: number) => {
    setCurrentStep(newStep)
    updateDialogState({ step: newStep })
  }, [])

  return {
    openDialog,
    closeDialog,
    changeDialogStep,
    dialogVisible,
    step,
  }
}

export default SignInJoinView
