import React, { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import { Snackbar } from '@/shared/components'
import { transitions, sizes } from '@/shared/theme'
import { SvgAlertError, SvgAlertInfo, SvgAlertSuccess, SvgAlertWarning } from '@/shared/icons'
import { SnackbarIconType } from '@/models/SnackbarStore'
import { useMST } from '../useStore'

const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertInfo />,
  success: <SvgAlertSuccess />,
  error: <SvgAlertError />,
  warning: <SvgAlertWarning />,
}

export const Snackbars = observer(() => {
  const { snackbarStore } = useMST()
  return (
    <SnackbarsContainer>
      <TransitionGroup>
        {[...snackbarStore.snackbars].map((snackbar) => {
          const { id, iconType, onActionClick, ...snackbarProps } = snackbar
          return (
            <CSSTransition key={id} timeout={2 * parseInt(transitions.timings.regular)} classNames={'snackbar'}>
              <Snackbar
                {...snackbarProps}
                onActionClick={() => {
                  onActionClick?.()
                  snackbarStore.closeSnackbar(snackbar)
                }}
                icon={iconType && ICON_TYPE_TO_ICON[iconType]}
                onClick={() => snackbarStore.closeSnackbar(snackbar)}
              />
            </CSSTransition>
          )
        })}
      </TransitionGroup>
    </SnackbarsContainer>
  )
})

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
  const { snackbarStore } = useMST()
  return snackbarStore
}
