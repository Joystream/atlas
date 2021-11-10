import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { DialogModal, DialogModalProps } from '@/components/_overlays/DialogModal'
import { createId } from '@/utils/createId'

type ConfirmationModalContextValue = {
  openModal: (key: string, modal: React.FunctionComponent<{ in?: boolean }>) => void
  closeModal: (key: string) => void
}
const ConfirmationModalContext = React.createContext<undefined | ConfirmationModalContextValue>(undefined)
ConfirmationModalContext.displayName = 'ConfirmationModalContext'

export const ConfirmationModalProvider: React.FC = ({ children }) => {
  const [modals, setModals] = useState<Record<string, React.FC>>({})

  const openModal = useCallback(
    (key: string, modal: React.FC) =>
      setModals((modals) => ({
        ...modals,
        [key]: modal,
      })),
    []
  )

  const closeModal = useCallback(
    (key: string) =>
      setModals((modals) => {
        const { [key]: _, ...filteredModals } = modals
        return filteredModals
      }),
    []
  )

  const contextValue = useMemo(() => ({ openModal, closeModal }), [closeModal, openModal])

  return (
    <ConfirmationModalContext.Provider value={contextValue}>
      {children}
      <TransitionGroup>
        {Object.keys(modals).map((key) => {
          const Component = modals[key]
          return <Component key={key} />
        })}
      </TransitionGroup>
    </ConfirmationModalContext.Provider>
  )
}

export const useConfirmationModal = (modalProps?: DialogModalProps) => {
  const ctx = useContext(ConfirmationModalContext)
  if (ctx === undefined) {
    throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider')
  }

  const { openModal, closeModal } = ctx

  const modalId = useRef(createId()).current

  const _openModal = useCallback(
    (args?: DialogModalProps) =>
      openModal(modalId, ({ in: inAnimation }) => <DialogModal {...(args || modalProps)} show={inAnimation} />),
    [modalProps, modalId, openModal]
  )

  const _closeModal = useCallback(() => {
    closeModal(modalId)
  }, [closeModal, modalId])

  return [_openModal, _closeModal]
}
