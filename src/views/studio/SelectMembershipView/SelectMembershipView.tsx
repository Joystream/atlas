import { Multistepper } from '@/components/Dialogs'
import { useCheckBrowser } from '@/hooks'
import { StudioCard, StudioHeader } from '@/shared/components'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import React, { useEffect, useState } from 'react'
import { Membership } from '../StudioView'
import { MemberChannelGrid, Wrapper } from './SelectMembershipView.style'
import { AccountStep, ExtensionStep, TermsStep } from './Steps'

type DialogStep = number

export const getDialogStep = promisify(() => readFromLocalStorage<DialogStep>('dialogStep') || 0)

export const updateStep = async (dialogStep: DialogStep) => {
  writeToLocalStorage('dialogStep', dialogStep)
}

const SelectMembershipView = () => {
  const [memberships, setMemberships] = useState<Membership[] | null>(null)

  const [selectedAccount, setSelectedAccount] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [currentStepIdx, setCurrentStep] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const browser = useCheckBrowser()

  const fetchDialogStep = async () => {
    const dialogStep = await getDialogStep()
    setCurrentStep(dialogStep)
  }

  useEffect(() => {
    // TODO check if polkadot is installed
    fetchDialogStep()
    if (currentStepIdx) {
      setModalVisible(true)
    }
  }, [currentStepIdx])

  const handleStepChange = async (idx: number) => {
    if (idx < 0 || idx > steps.length - 1) {
      return
    }
    await updateStep(idx)
    setCurrentStep(idx)
  }

  const handleCloseDialog = () => {
    setModalVisible(false)
    handleStepChange(0)
  }

  const handleSelectAccount = (idx: number) => {
    // TODO some localstorage function here
    handleStepChange(idx)
    setSelectedAccount('dummy account')
  }

  const handleAcceptTerms = (idx: number) => {
    // TODO some async function here
    handleStepChange(idx)
    setTermsAccepted(true)
    handleCloseDialog()
  }

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep browser={browser} onStepChange={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep onStepChange={handleSelectAccount} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep onStepChange={handleAcceptTerms} currentStepIdx={currentStepIdx} />,
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
          <StudioCard key={membership.id} avatarPhotoUrl={membership.avatarUri} handle={membership.handle} />
        ))}
        <StudioCard blank handle="Create a membership" onClick={() => setModalVisible(true)} />
      </MemberChannelGrid>
      <Multistepper
        currentStepIdx={currentStepIdx}
        steps={steps}
        showDialog={modalVisible}
        onExitClick={handleCloseDialog}
      />
    </Wrapper>
  )
}

export default SelectMembershipView
