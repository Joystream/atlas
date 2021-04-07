import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import { Snackbar } from '@/shared/components'
import { transitions, sizes } from '@/shared/theme'
import { createId } from '@/utils/createId'

export type DisplaySnackbarArgs = {
  timeout?: number
  variant?: 'primary' | 'secondary'
  icon?: 'success' | 'error' | 'info'
  title: string
  description?: string
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

  const displaySnackbar = ({ timeout, ...args }: DisplaySnackbarArgs) => {
    const id = createId()
    setSnackbars([...snackbars, { id, ...args }])

    if (timeout) {
      setTimeout(() => {
        setSnackbars(snackbarsRef.current.filter((snackbar) => snackbar.id !== id))
      }, timeout)
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
          {snackbars.map(({ id, ...snackbarProps }) => (
            <CSSTransition key={id} timeout={2 * parseInt(transitions.timings.regular)} classNames={'snackbar'}>
              <Snackbar {...snackbarProps} onClick={() => closeSnackbar(id)} />
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
