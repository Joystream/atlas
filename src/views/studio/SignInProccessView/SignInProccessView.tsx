import { Membership } from '@/api/queries'
import { Multistepper } from '@/components'
import { useCheckBrowser, useActiveUser } from '@/hooks'
import { Text } from '@/shared/components'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { web3Enable } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'
import {
  HeroContainer,
  ListContainer,
  OrderedItem,
  OrderedList,
  StyledButton,
  StyledCoinsIllustrations,
  StyledStudioContainer,
  UnOrderedItem,
  UnOrderedList,
} from './SignInProccessView.style'
import { ExtensionStep, AccountStep, TermsStep } from './Steps'

const SignInProccessView = () => {
  const [memberships, setMemberships] = useState<Membership[]>()
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

  const hasMemberships = memberships?.length
  return (
    <>
      <StyledStudioContainer>
        <HeroContainer>
          <Text variant="h2">How to start your publisher journey?</Text>
        </HeroContainer>
        <ListContainer>
          <OrderedList>
            <OrderedItem variant="h4" as="li">
              Install Polkadot extension
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Create a polkadot account
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Make your first transaction & join the blockchain
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Connect it to your joystream membership
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create joystream membership account
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  One Joystream membership allows you to create multiple channels
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Creating a membership is free!
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Membership never expires & there are no fees!
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create your first channel
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Add unlimited content
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Gather your own audience & be heard!
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Publish your content on Joystream
            </OrderedItem>
          </OrderedList>
          <StyledButton size="large" icon="chevron-right" onClick={openDialog}>
            Join now
          </StyledButton>
        </ListContainer>
      </StyledStudioContainer>
      <StyledCoinsIllustrations />
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

export default SignInProccessView
