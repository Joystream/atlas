import Snackbar from '@/shared/components/Snackbar/Snackbar'
import { transitions } from '@/shared/theme'
import React, { createContext, useContext, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'

export type DisplaySnackbarArgs = {
  time?: number
  variant?: 'primary' | 'secondary'
  icon?: 'success' | 'error' | 'info'
  buttonText?: string
  message: string
  subMessage?: string
  actionText?: string
}

type SnackbarContextValue = {
  displaySnackbar: (args: DisplaySnackbarArgs) => void
  // closeSnackbar: () => void
}

const SnackbarsContainer = styled.div`
  position: fixed;
  bottom: 35px;
  max-width: 360px;
  width: 100%;
  display: grid;
`
type SnackbarProps = {
  isVisible?: boolean
  message?: string
  subMessage?: string
  actionText?: string
  variant?: 'primary' | 'secondary'
  icon?: 'success' | 'error' | 'info'
  closeSnackbar?: () => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)
SnackbarContext.displayName = 'SnackbarContext'

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarProps[]>([])

  const displaySnackbar = ({ time, icon, message, subMessage, variant, actionText }: DisplaySnackbarArgs) => {
    setSnackbars([...snackbars, { isVisible: true, message, icon, subMessage, variant, actionText }])
  }

  const handleRemoveSnackbar = (index: number) => {
    const newSnackbars = snackbars.map((snackbar, idx) => {
      if (index === idx) {
        snackbar.isVisible = false
      }
      return snackbar
    })
    setSnackbars(newSnackbars)
  }

  return (
    <SnackbarContext.Provider value={{ displaySnackbar }}>
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
                  onClick={() => handleRemoveSnackbar(idx)}
                />
              </CSSTransition>
            ))}
        </SnackbarsContainer>
      </TransitionGroup>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext)
  if (ctx === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return ctx
}
