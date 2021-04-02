import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import faker from 'faker'
import Snackbar from '@/shared/components/Snackbar/Snackbar'
import { transitions, sizes } from '@/shared/theme'

export type DisplaySnackbarArgs = {
  time?: number
  variant?: 'primary' | 'secondary'
  icon?: 'success' | 'error' | 'info'
  message: string
  subMessage?: string
  actionText?: string
  onActionClick?: () => void
}

type SnackbarsState = {
  id: string
} & Omit<DisplaySnackbarArgs, 'time'>

type SnackbarContextValue = {
  displaySnackbar: (args: DisplaySnackbarArgs) => void
  closeSnackbar: (id: string) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)
SnackbarContext.displayName = 'SnackbarContext'

const SNACKBARS_LIMIT = 3

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarsState[]>([])

  // Snackbars state reference is needed for setTimeout to read
  const snackbarsRef = useRef(snackbars)
  snackbarsRef.current = snackbars

  const displaySnackbar = ({ time, ...args }: DisplaySnackbarArgs) => {
    const id = faker.datatype.uuid()
    setSnackbars([...snackbars, { id, ...args }])

    if (time) {
      setTimeout(() => {
        setSnackbars(snackbarsRef.current.filter((snackbar) => snackbar.id !== id))
      }, time)
    }
  }

  const closeSnackbar = (id: string) => {
    setSnackbars(snackbars.filter((snackbar) => snackbar.id !== id))
  }

  useEffect(() => {
    if (snackbars.length > SNACKBARS_LIMIT) {
      setTimeout(() => {
        setSnackbars(snackbarsRef.current.slice(1))
      }, 500)
    }
  }, [snackbars])

  return (
    <SnackbarContext.Provider value={{ displaySnackbar, closeSnackbar }}>
      {children}
      <SnackbarsContainer>
        <TransitionGroup>
          {snackbars.map((item) => (
            <CSSTransition key={item.id} timeout={2 * parseInt(transitions.timings.regular)} classNames={'snackbar'}>
              <Snackbar
                message={item.message}
                subMessage={item.subMessage}
                variant={item.variant}
                actionText={item.actionText}
                onActionClick={item.onActionClick}
                icon={item.icon}
                onClick={() => closeSnackbar(item.id)}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </SnackbarsContainer>
    </SnackbarContext.Provider>
  )
}

const SnackbarsContainer = styled.div`
  position: fixed;
  left: var(--sidenav-collapsed-width);
  bottom: ${sizes(18)};
  margin-left: ${sizes(4)};
  max-width: 360px;
  width: 100%;
  display: grid;
`

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext)
  if (ctx === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return ctx
}
