import { Multistepper } from '@/components/Dialogs'
import routes from '@/config/routes'
import { useActiveUser, useCheckBrowser } from '@/hooks'
import { StudioCard, StudioHeader } from '@/shared/components'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import React, { useCallback, useEffect, useState } from 'react'
import { checkPolkadot, getAccountMemberships } from '../SignInView/fakeUtils'
import { Membership } from '../SignInView/SignInView'
import { MemberChannelGrid, Wrapper } from './SelectMembershipView.style'
import { AccountStep, ExtensionStep, TermsStep } from './Steps'

type DialogStep = {
  step: number
  isActive?: boolean
}

const SelectMembershipView = () => {
  const [memberships, setMemberships] = useState<Membership[]>()

  const browser = useCheckBrowser()
  const { activeUser } = useActiveUser()
  const { dialogVisible, openDialog, closeDialog, changeDialogStep, step } = useSteps()

  // temporary
  const getMemberShips = useCallback(async () => {
    if (!activeUser?.accountId) {
      return
    }
    const memberships = await getAccountMemberships(activeUser.accountId)
    setMemberships(memberships)
  }, [activeUser?.accountId])

  // temporary
  const checkIfExtensionIsIntalled = useCallback(async () => {
    const isInstalled = await checkPolkadot()
    if (isInstalled && step < 1) {
      changeDialogStep(1)
    }
  }, [changeDialogStep, step])

  useEffect(() => {
    checkIfExtensionIsIntalled()
    getMemberShips()
  }, [checkIfExtensionIsIntalled, getMemberShips])

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep browser={browser} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep onStepChange={changeDialogStep} currentStepIdx={step} />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep onStepChange={changeDialogStep} currentStepIdx={step} />,
    },
  ]

  const hasMemberships = memberships?.length

  return (
    <Wrapper>
      <StudioHeader
        title="Select Membership"
        subtitle={
          hasMemberships
            ? 'Select a membership from the list of your memberships. Click create a membership to create and publish a brand new membership.'
            : 'You have no memberships yet. Click Create a membership to become a member'
        }
      />
      <MemberChannelGrid>
        {memberships?.map((membership) => (
          <StudioCard
            to={routes.studio.selectChannel(true)}
            variant="membership"
            key={membership.id}
            avatarPhotoUrl={membership.avatarUri}
            handle={membership.handle}
          />
        ))}
        <StudioCard variant="membership" blank handle="Create a membership" onClick={openDialog} />
      </MemberChannelGrid>
      <Multistepper currentStepIdx={step} steps={steps} showDialog={dialogVisible} onExitClick={closeDialog} />
    </Wrapper>
  )
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

export default SelectMembershipView
