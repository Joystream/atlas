import MessageDialog, { MessageDialogProps } from '@/components/Dialogs/MessageDialog'
import { transitions } from '@/shared/theme'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useOverlayManager } from '../useOverlayManager'

type DialogContextValue = {
  openDialog: (id: string, dialogConfig?: MessageDialogProps) => void
  closeDialog: (id: string) => void
}

type DialogState = {
  id: string
} & MessageDialogProps

const DialogContext = React.createContext<undefined | DialogContextValue>(undefined)
DialogContext.displayName = 'DialogsContext'

export const DialogProvider: React.FC = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogState[]>([])

  const openDialog = useCallback((customId: string, dialogConfig?: MessageDialogProps) => {
    setDialogs((dialogs) => [...dialogs, { id: customId, showDialog: true, ...dialogConfig }])
  }, [])

  const closeDialog = useCallback((id: string) => {
    setDialogs((dialogs) => [...dialogs.filter((dialog) => dialog.id !== id)])
  }, [])

  const {
    openOverlayContainerForMessageDialog,
    closeOverlayContainerForMessageDialog,
    lockScroll,
    unlockScroll,
  } = useOverlayManager()

  useEffect(() => {
    if (!dialogs.length) {
      return
    }
    openOverlayContainerForMessageDialog()
    lockScroll()
    return () => {
      closeOverlayContainerForMessageDialog()
      unlockScroll()
    }
  }, [
    closeOverlayContainerForMessageDialog,
    dialogs.length,
    lockScroll,
    openOverlayContainerForMessageDialog,
    unlockScroll,
  ])

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <TransitionGroup>
        {dialogs.map(({ id, onExitClick, ...dialogProps }, idx) => {
          return (
            <CSSTransition key={idx} timeout={250} classNames={transitions.names.dialog} mountOnEnter unmountOnExit>
              <MessageDialog
                isActionDialog={false}
                key={idx}
                {...dialogProps}
                onExitClick={(e) => {
                  closeDialog(id)
                  onExitClick?.(e)
                }}
              />
            </CSSTransition>
          )
        })}
      </TransitionGroup>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const ctx = useContext(DialogContext)
  if (ctx === undefined) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return ctx
}
