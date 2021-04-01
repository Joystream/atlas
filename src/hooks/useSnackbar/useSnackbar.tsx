import React, { createContext, useContext, useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import faker from 'faker'
import Snackbar from '@/shared/components/Snackbar/Snackbar'
import { transitions } from '@/shared/theme'

export type DisplaySnackbarArgs = {
  time?: number
  variant?: 'primary' | 'secondary'
  icon?: 'success' | 'error' | 'info'
  message: string
  subMessage?: string
  actionText?: string
}

type SnackbarsState = {
  isVisible: boolean
  id: string
} & Omit<DisplaySnackbarArgs, 'time'>

type SnackbarContextValue = {
  displaySnackbar: (args: DisplaySnackbarArgs) => void
  closeSnackbar: (id: string) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)
SnackbarContext.displayName = 'SnackbarContext'

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarsState[]>([])
  const displaySnackbar = ({ time, icon, message, subMessage, variant, actionText }: DisplaySnackbarArgs) => {
    const id = faker.random.uuid()
    setSnackbars([...snackbars, { id, isVisible: true, message, icon, subMessage, variant, actionText }])
  }

  const closeSnackbar = (id: string) => {
    const newSnackbars = snackbars.map((snackbar) => {
      if (id === snackbar.id) {
        snackbar.isVisible = false
      }
      return snackbar
    })
    setSnackbars(newSnackbars)
  }

  return (
    <SnackbarContext.Provider value={{ displaySnackbar, closeSnackbar }}>
      {children}
      <TransitionGroup>
        <SnackbarsContainer>
          {!!snackbars.length &&
            snackbars.map((item, idx) => (
              <CSSTransition
                key={`transition-${idx}`}
                in={item.isVisible}
                unmountOnExit
                mountOnEnter
                timeout={2 * parseInt(transitions.timings.regular)}
                classNames={'snackbar'}
              >
                <Snackbar
                  message={item.message || ''}
                  subMessage={item.subMessage}
                  variant={item.variant}
                  actionText={item.actionText}
                  icon={item.icon}
                  onClick={() => closeSnackbar(item.id)}
                />
              </CSSTransition>
            ))}
        </SnackbarsContainer>
      </TransitionGroup>
    </SnackbarContext.Provider>
  )
}

const SnackbarsContainer = styled.div`
  position: fixed;
  bottom: 35px;
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
