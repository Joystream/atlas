import React, { createContext, useContext, useState } from 'react'
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

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarsState[]>([])

  const displaySnackbar = ({ ...args }: DisplaySnackbarArgs) => {
    const id = faker.datatype.uuid()
    setSnackbars([...snackbars, { id, ...args }])
  }

  const closeSnackbar = (id: string) => {
    setSnackbars(snackbars.filter((snackbar) => snackbar.id !== id))
  }

  return (
    <SnackbarContext.Provider value={{ displaySnackbar, closeSnackbar }}>
      {children}
      <SnackbarsContainer>
        <TransitionGroup>
          {!!snackbars.length &&
            snackbars.map((item, idx) => (
              <CSSTransition
                key={`transition-${idx}`}
                unmountOnExit
                mountOnEnter
                timeout={2 * parseInt(transitions.timings.regular)}
                classNames={'snackbar'}
              >
                <Snackbar
                  message={item.message}
                  subMessage={item.subMessage}
                  variant={item.variant}
                  actionText={item.actionText}
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
  bottom: 0;
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
