import {
  FC,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TransitionGroup } from 'react-transition-group'

import { AlertDialogModal, AlertDialogModalProps } from '@/components/_overlays/AlertDialogModal'
import { AlertDialogModalWithFee } from '@/components/_overlays/AlertDialogModalWithFee'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { TxMethodName } from '@/joystream-lib/types'
import { createId } from '@/utils/createId'

type ConfirmationModalContextValue = {
  openModal: (key: string, modal: FunctionComponent<{ in?: boolean }>) => void
  closeModal: (key: string) => void
}
const ConfirmationModalContext = createContext<undefined | ConfirmationModalContextValue>(undefined)
ConfirmationModalContext.displayName = 'ConfirmationModalContext'

type FeeProps = {
  fee?: {
    methodName: TxMethodName
    args?: Parameters<JoystreamLibExtrinsics[TxMethodName]>
  }
}

export const ConfirmationModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modals, setModals] = useState<Record<string, FC>>({})

  const openModal = useCallback(
    (key: string, modal: FC) =>
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

export const useConfirmationModal = (modalProps?: AlertDialogModalProps & FeeProps) => {
  const ctx = useContext(ConfirmationModalContext)
  if (ctx === undefined) {
    throw new Error('useConfirmationModal must be used within a ConfirmationModalProvider')
  }

  const { openModal, closeModal } = ctx

  const modalId = useRef(createId()).current

  const _closeModal = useCallback(() => {
    closeModal(modalId)
  }, [closeModal, modalId])

  const _openModal = useCallback(
    (args?: AlertDialogModalProps & FeeProps) =>
      openModal(modalId, ({ in: inAnimation }) => {
        const _args = args || modalProps
        const handleClick = _args?.onExitClick
          ? () => {
              _args?.onExitClick?.()
              _closeModal()
            }
          : undefined
        const commonProps = {
          show: inAnimation,
          onExitClick: handleClick,
          ..._args,
        }
        return _args?.fee ? (
          <AlertDialogModalWithFee {...commonProps} fee={_args.fee} />
        ) : (
          <AlertDialogModal {...commonProps} />
        )
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openModal, modalId, JSON.stringify(modalProps), _closeModal]
  )

  return [_openModal, _closeModal]
}
