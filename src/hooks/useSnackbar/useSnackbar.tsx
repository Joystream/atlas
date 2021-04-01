import Snackbar from '@/shared/components/Snackbar/Snackbar'
import { transitions } from '@/shared/theme'
import React, { createContext, useContext, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'

export type DisplaySnackbarArgs = {
  time?: number
  icon?: 'success' | 'error' | 'info'
  buttonText?: string
  message: string
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
  id?: number
  isVisible?: boolean
  message?: string
  icon?: 'success' | 'error' | 'info'
  closeSnackbar?: () => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)
SnackbarContext.displayName = 'SnackbarContext'

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarProps[]>([])

  const displaySnackbar = ({ time, icon, message, buttonText }: DisplaySnackbarArgs) => {
    setSnackbars([...snackbars, { isVisible: true, message, icon }])
  }

  const handleRemoveSnackbar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
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
                timeout={2 * parseInt(transitions.timings.loading)}
                classNames={'snackbar'}
              >
                <Snackbar message={item.message || ''} icon={item.icon} onClick={(e) => handleRemoveSnackbar(e, idx)} />
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
