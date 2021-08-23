import styled from '@emotion/styled'
import React, { ReactNode, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Snackbar } from '@/shared/components/Snackbar'
import { SvgAlertError, SvgAlertInfo, SvgAlertSuccess, SvgAlertWarning } from '@/shared/icons'
import { sizes, transitions } from '@/shared/theme'

import { useSnackbarStore } from './store'

type SnackbarIconType = 'success' | 'error' | 'info' | 'warning'

const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertInfo />,
  success: <SvgAlertSuccess />,
  error: <SvgAlertError />,
  warning: <SvgAlertWarning />,
}

const SNACKBARS_LIMIT = 3

export const useSnackbar = () => useSnackbarStore((state) => state.actions)

export const Snackbars: React.FC = () => {
  const { closeSnackbar } = useSnackbar()
  const snackbars = useSnackbarStore((state) => state.snackbars)

  useEffect(() => {
    if (snackbars.length > SNACKBARS_LIMIT) {
      setTimeout(() => {
        closeSnackbar(snackbars[0].id)
      }, 500)
    }
  }, [snackbars, closeSnackbar])

  return (
    <SnackbarsContainer>
      <TransitionGroup>
        {snackbars.map(({ id, iconType, onActionClick, onExit, ...snackbarProps }) => (
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
