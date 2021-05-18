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
  shouldCloseOnClick?: boolean
} & MessageDialogProps

const DialogContext = React.createContext<undefined | DialogContextValue>(undefined)
DialogContext.displayName = 'DialogsContext'

export const DialogProvider: React.FC = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogState[]>([])

  const openDialog = useCallback((customId: string, dialogConfig?: MessageDialogProps) => {
    setDialogs((dialogs) => {
      if (dialogs.find((dialog) => dialog.id === customId)) {
        console.warn(`Couldn't create dialog. Dialog with id '${customId}' already exists`)
        return dialogs
      }
      return [...dialogs, { id: customId, showDialog: true, ...dialogConfig }]
    })
  }, [])

  const closeDialog = useCallback((id: string) => {
    setDialogs((dialogs) => {
      if (!dialogs.find((dialog) => dialog.id === id)) {
        console.warn(`Couldn't close dialog. Dialog with id '${id}' doesn't exists`)
        return dialogs
      }
      return [...dialogs.filter((dialog) => dialog.id !== id)]
    })
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

  const handleCloseDialog = (id: string, shouldCloseOnClick = true) => {
    shouldCloseOnClick && closeDialog(id)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <TransitionGroup>
        {dialogs.map(
          ({ id, onExitClick, onPrimaryButtonClick, onSecondaryButtonClick, shouldCloseOnClick, ...dialogProps }) => {
            return (
              <CSSTransition key={id} timeout={250} classNames={transitions.names.dialog} mountOnEnter unmountOnExit>
                <MessageDialog
                  isActionDialog={false}
                  key={id}
                  {...dialogProps}
                  onExitClick={(e) => {
                    handleCloseDialog(id, shouldCloseOnClick)
                    onExitClick?.(e)
                  }}
                  onPrimaryButtonClick={(e) => {
                    handleCloseDialog(id, shouldCloseOnClick)
                    onPrimaryButtonClick?.(e)
                  }}
                  onSecondaryButtonClick={(e) => {
                    handleCloseDialog(id, shouldCloseOnClick)
                    onSecondaryButtonClick?.(e)
                  }}
                />
              </CSSTransition>
            )
          }
        )}
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
