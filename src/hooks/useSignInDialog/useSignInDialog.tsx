import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouterQuery } from '../useRouterQuery'
import { ExtensionStep, AccountStep, TermsStep } from './Steps'

type DialogStep = {
  isActive?: boolean
}

const getDialogState = promisify(() => readFromLocalStorage<DialogStep>('dialogStep') || { isActive: false })

const updateDialogState = async (dialogStep: DialogStep) => {
  writeToLocalStorage('dialogStep', dialogStep)
}

export const useSignInDialog = () => {
  const [dialogVisible, setDialogVisible] = useState(false)
  const currentStep = useRouterQuery('step')

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

  return {
    openDialog,
    closeDialog,
    dialogVisible,
    steps,
    currentStep,
  }
}
