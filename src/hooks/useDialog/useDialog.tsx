import MessageDialog, { MessageDialogProps } from '@/components/Dialogs/MessageDialog'
import { createId } from '@/utils/createId'
import React, { useCallback, useState, useContext, useMemo, useRef } from 'react'
import { TransitionGroup } from 'react-transition-group'

type DialogRendererProps = {
  component: React.FunctionComponent
}

type DialogContextValue = {
  openDialog: (key: string, dialog: React.FunctionComponent<{ in?: boolean }>) => void
  closeDialog: (key: string) => void
}
const DialogContext = React.createContext<undefined | DialogContextValue>(undefined)
DialogContext.displayName = 'DialogsContext'

export const DialogProvider: React.FC = ({ children }) => {
  const [dialogs, setDialogs] = useState<Record<string, React.FC>>({})

  const openDialog = useCallback(
    (key: string, dialog: React.FC) =>
      setDialogs((dialogs) => ({
        ...dialogs,
        [key]: dialog,
      })),
    []
  )

  const closeDialog = useCallback(
    (key: string) =>
      setDialogs((dialogs) => {
        const { [key]: _, ...filteredDialogs } = dialogs
        return filteredDialogs
      }),
    []
  )

  const contextValue = useMemo(() => ({ openDialog, closeDialog }), [closeDialog, openDialog])

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <TransitionGroup>
        {Object.keys(dialogs).map((key) => {
          const Component = dialogs[key]
          return <Component key={key} />
        })}
      </TransitionGroup>
    </DialogContext.Provider>
  )
}

export const useDialog = (dialogProps?: MessageDialogProps) => {
  const ctx = useContext(DialogContext)
  if (ctx === undefined) {
    throw new Error('useDialog must be used within a DialogProvider')
  }

  const { openDialog, closeDialog } = ctx

  const dialogId = useRef(createId()).current

  const _openDialog = useCallback(
    (args?: MessageDialogProps) =>
      openDialog(dialogId, ({ in: inAnimation }) => (
        <MessageDialog {...(args || dialogProps)} showDialog={inAnimation} />
      )),
    [dialogProps, dialogId, openDialog]
  )

  const _closeDialog = useCallback(() => {
    closeDialog(dialogId)
  }, [closeDialog, dialogId])

  return [_openDialog, _closeDialog]
}
