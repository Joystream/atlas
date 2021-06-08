import styled from '@emotion/styled'
import produce, { Draft } from 'immer'
import React, { ReactNode, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import create, { State, StateCreator } from 'zustand'

import { Snackbar } from '@/shared/components'
import { SvgAlertError, SvgAlertInfo, SvgAlertSuccess, SvgAlertWarning } from '@/shared/icons'
import { sizes, transitions } from '@/shared/theme'
import { createId } from '@/utils/createId'

type SnackbarIconType = 'success' | 'error' | 'info' | 'warning'

export type DisplaySnackbarArgs = {
  customId?: string
  timeout?: number
  variant?: 'primary' | 'secondary'
  iconType?: SnackbarIconType
  title: string
  description?: string
  actionText?: string
  onExit?: () => void
  onActionClick?: () => void
}
const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertInfo />,
  success: <SvgAlertSuccess />,
  error: <SvgAlertError />,
  warning: <SvgAlertWarning />,
}

const immer = <T extends State>(config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>): StateCreator<T> => (
  set,
  get,
  api
) => config((fn) => set(produce<T>(fn)), get, api)

type Snackbar = {
  id: string
} & Omit<DisplaySnackbarArgs, 'time'>

type SnackbarState = {
  snackbars: Snackbar[]
  displaySnackbar: (args: DisplaySnackbarArgs) => string
  updateSnackbar: (id: string, opts: Omit<DisplaySnackbarArgs, 'id'>) => void
  closeSnackbar: (id: string) => void
}

  const displaySnackbar = useCallback(({ customId, timeout, onExit, ...args }: DisplaySnackbarArgs) => {
    const id = customId ?? createId()
    setSnackbars((currentSnackbars) => {
      return [...currentSnackbars, { id, ...args }]
    })

    if (timeout) {
      setTimeout(() => {
        onExit?.()
        setSnackbars((currentSnackbars) => currentSnackbars.filter((snackbar) => snackbar.id !== id))
      }, timeout)
    }
    return id
  },
}))

const SNACKBARS_LIMIT = 3

export const Snackbars: React.FC = () => {
  const closeSnackbar = useSnackbar((state) => state.closeSnackbar)
  const snackbars = useSnackbar((state) => state.snackbars)

  useEffect(() => {
    if (snackbars.length > SNACKBARS_LIMIT) {
      setTimeout(() => {
        closeSnackbar(snackbars[0].id)
      }, 500)
    }
  }, [closeSnackbar, snackbars])

  return (
    <SnackbarContext.Provider value={{ snackbars, displaySnackbar, updateSnackbar, closeSnackbar }}>
      {children}
      <SnackbarsContainer>
        <TransitionGroup>
          {snackbars.map(({ id, iconType, onExit, onActionClick, ...snackbarProps }) => (
            <CSSTransition key={id} timeout={2 * parseInt(transitions.timings.regular)} classNames={'snackbar'}>
              <Snackbar
                {...snackbarProps}
                onActionClick={() => {
                  onActionClick?.()
                  closeSnackbar(id)
                }}
                icon={iconType && ICON_TYPE_TO_ICON[iconType]}
                onClick={() => {
                  onExit?.()
                  closeSnackbar(id)
                }}
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
