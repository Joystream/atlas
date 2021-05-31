import MessageDialog, { MessageDialogProps } from '@/components/Dialogs/MessageDialog'
import { createId } from '@/utils/createId'
import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react'
import { TransitionGroup } from 'react-transition-group'

type DialogRendererProps = {
  component: React.FunctionComponent
}

interface DialogsContainerProps {
  dialogs: Record<string, React.FunctionComponent>
  component?: React.ComponentType
  container?: Element
}

const DialogsRenderer = ({ component, ...rest }: DialogRendererProps) => component(rest)

export const DialogsContainer = ({ dialogs }: DialogsContainerProps) => {
  return (
    <TransitionGroup>
      {Object.keys(dialogs).map((key) => (
        <DialogsRenderer key={key} component={dialogs[key]} />
      ))}
    </TransitionGroup>
  )
}

type DialogContextValue = {
  openDialog: (key: string, dialog: React.FunctionComponent<{ in?: boolean }>) => void
  closeDialog: (key: string) => void
}
const DialogContext = React.createContext<undefined | DialogContextValue>(undefined)
DialogContext.displayName = 'DialogsContext'

type DialogsProviderProps = {
  container?: Element
}

export const DialogProvider: React.FC<DialogsProviderProps> = ({ container, children }) => {
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
        if (!dialogs[key]) {
          return dialogs
        }
        const newDialogs = { ...dialogs }
        delete newDialogs[key]
        return newDialogs
      }),
    []
  )

  const contextValue = useMemo(() => ({ openDialog, closeDialog }), [closeDialog, openDialog])

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <DialogsContainer dialogs={dialogs} container={container} />
    </DialogContext.Provider>
  )
}

type ComponentOrDialogProps = React.FunctionComponent<{ in?: boolean }> | MessageDialogProps

export const useDialog = (componentOrDialogProps?: ComponentOrDialogProps) => {
  const ctx = useContext(DialogContext)
  if (ctx === undefined) {
    throw new Error('useDialog must be used within a DialogProvider')
  }

  const { openDialog, closeDialog } = ctx

  const [isShown, setShown] = useState(false)
  const showModal = useCallback(() => setShown(true), [])
  const hideModal = useCallback(() => setShown(false), [])
  const dialogId = useMemo(() => createId(), [])

  const openDialogCb: ComponentOrDialogProps = useMemo(
    () =>
      typeof componentOrDialogProps === 'function'
        ? componentOrDialogProps
        : ({ in: inAnimation }) => <MessageDialog {...componentOrDialogProps} showDialog={inAnimation} />,
    [componentOrDialogProps]
  )

  useEffect(() => {
    if (isShown) {
      openDialog(dialogId, openDialogCb)
    } else {
      closeDialog(dialogId)
    }
    return () => {
      closeDialog(dialogId)
    }
  }, [closeDialog, componentOrDialogProps, dialogId, isShown, openDialog, openDialogCb])

  const _openDialog = useCallback(
    (args?: MessageDialogProps) =>
      componentOrDialogProps === undefined
        ? openDialog(dialogId, ({ in: inAnimation }) => <MessageDialog {...args} showDialog={inAnimation} />)
        : showModal(),
    [componentOrDialogProps, dialogId, openDialog, showModal]
  )

  const _closeDialog = useCallback(() => {
    return componentOrDialogProps === undefined ? closeDialog(dialogId) : hideModal()
  }, [closeDialog, componentOrDialogProps, dialogId, hideModal])

  return [_openDialog, _closeDialog]
}
