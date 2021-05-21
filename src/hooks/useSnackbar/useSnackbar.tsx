import { snackbarTransitions } from '@/shared/components/Snackbar'
import Snackbar from '@/shared/components/Snackbar/Snackbar'
import { transitions } from '@/shared/theme'
import { Global } from '@emotion/react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

export type DisplaySnackbarArgs = {
  time?: number
  variant?: 'success' | 'error' | 'info'
  buttonText?: string
  message: string
}

type SnackbarContextValue = {
  displaySnackbar: (args: DisplaySnackbarArgs) => void
  closeSnackbar: () => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)
SnackbarContext.displayName = 'SnackbarContext'

export const SnackbarProvider: React.FC = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [snackbarOpts, setSnackbarOpts] = useState<DisplaySnackbarArgs | null>(null)

  const displaySnackbar = ({ time, variant, message, buttonText }: DisplaySnackbarArgs) => {
    setIsVisible(true)
    setSnackbarOpts({
      time,
      variant,
      message,
      buttonText,
    })
  }

  const closeSnackbar = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!snackbarOpts?.time) {
      return
    }
    const timeout = setTimeout(() => closeSnackbar(), snackbarOpts.time)
    return () => {
      clearTimeout(timeout)
    }
  }, [snackbarOpts?.time])

  return (
    <SnackbarContext.Provider value={{ displaySnackbar, closeSnackbar }}>
      {children}
      <Global styles={snackbarTransitions}></Global>
      <CSSTransition
        in={isVisible && !!snackbarOpts}
        unmountOnExit
        mountOnEnter
        timeout={parseInt(transitions.timings.loading)}
        classNames={'snackbar'}
        onExited={() => setSnackbarOpts(null)}
      >
        <Snackbar
          message={snackbarOpts?.message || ''}
          variant={snackbarOpts?.variant}
          onClick={closeSnackbar}
          buttonText={snackbarOpts?.buttonText}
        />
      </CSSTransition>
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
