import styled from '@emotion/styled'
import React, { ReactNode, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Snackbar } from '@/components/Snackbar'
import {
  SvgActionUpload,
  SvgAlertsError24,
  SvgAlertsInformative24,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
} from '@/components/_icons'
import { sizes, transitions, zIndex } from '@/styles'

import { SnackbarIconType, useSnackbarStore } from './store'

const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertsInformative24 />,
  success: <SvgAlertsSuccess24 />,
  error: <SvgAlertsError24 />,
  warning: <SvgAlertsWarning24 />,
  uploading: <SvgActionUpload />,
}

const SNACKBARS_LIMIT = 3

export const useSnackbar = () => useSnackbarStore((state) => state.actions)

export const Snackbars: React.FC = () => {
  const { closeSnackbar, cancelSnackbarTimeout, restartSnackbarTimeout } = useSnackbar()
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
          <CSSTransition key={id} timeout={2 * parseInt(transitions.timings.regular)} classNames="snackbar">
            <Snackbar
              {...snackbarProps}
              onActionClick={() => {
                onActionClick?.()
                closeSnackbar(id)
              }}
              onMouseEnter={() => {
                cancelSnackbarTimeout(id)
              }}
              onMouseLeave={() => {
                restartSnackbarTimeout(id)
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

export const SnackbarsContainer = styled.div`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  bottom: ${sizes(18)};
  margin-left: ${sizes(4)};
  max-width: 360px;
  width: 100%;
  display: grid;
  z-index: ${zIndex.nearVideoWorkspaceOverlay};
`
