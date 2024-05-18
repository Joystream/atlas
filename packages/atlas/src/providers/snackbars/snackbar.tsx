import styled from '@emotion/styled'
import { FC, ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import {
  SvgActionUpload,
  SvgAlertsError24,
  SvgAlertsInformative24,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
  SvgJoyTokenMonochrome24,
} from '@/assets/icons'
import { Snackbar } from '@/components/Snackbar'
import { Spinner } from '@/components/_loaders/Spinner'
import { useBottomNavStore } from '@/providers/bottomNav'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

import { SnackbarIconType, useSnackbarStore } from './store'

const StyledSpinner = styled(Spinner)`
  margin-bottom: 0;
  margin-top: ${sizes(1)};
`

const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertsInformative24 />,
  token: <SvgJoyTokenMonochrome24 />,
  success: <SvgAlertsSuccess24 />,
  error: <SvgAlertsError24 />,
  warning: <SvgAlertsWarning24 />,
  uploading: <SvgActionUpload />,
  loading: <StyledSpinner size="small" />,
}

const SNACKBARS_LIMIT = 3

export const useSnackbar = () => useSnackbarStore((state) => state.actions)

export const Snackbars: FC = () => {
  const { closeSnackbar, cancelSnackbarTimeout, restartSnackbarTimeout } = useSnackbar()
  const snackbars = useSnackbarStore((state) => state.snackbars)
  const bottomNavOpen = useBottomNavStore((state) => state.open)
  const [hasActionBar, setHasActionBar] = useState(false)
  const nonStickedSnackbars = snackbars.filter((snackbar) => !snackbar.sticked)

  useEffect(() => {
    if (nonStickedSnackbars.length > SNACKBARS_LIMIT) {
      setTimeout(() => {
        closeSnackbar(nonStickedSnackbars[0].id)
      }, 500)
    }
  }, [nonStickedSnackbars, closeSnackbar])

  useLayoutEffect(() => {
    if (snackbars.length) {
      const _hasActionBar = !!document.getElementsByClassName('action-bar').length
      setHasActionBar(_hasActionBar)
    }
  }, [snackbars.length])

  return (
    <SnackbarsContainer bottomNavType={hasActionBar ? 'action' : bottomNavOpen ? 'nav' : undefined}>
      <TransitionGroup>
        {snackbars.map(({ id, iconType, onActionClick, onExit, ...snackbarProps }) => (
          <CSSTransition key={id} timeout={parseInt(cVar('animationTimingMedium', true)) * 2} classNames="snackbar">
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

export const SnackbarsContainer = styled.div<{ bottomNavType?: 'action' | 'nav' }>`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  bottom: ${({ bottomNavType }) => sizes(bottomNavType ? (bottomNavType === 'nav' ? 20 : 32) : 4)};
  margin-left: ${sizes(4)};
  display: grid;
  z-index: ${zIndex.snackbars};
  min-width: calc(100% - ${sizes(8)});
  transition: bottom ${cVar('animationTransitionMedium')}
    ${({ bottomNavType }) => (bottomNavType ? transitions.timings.routing : '0ms')};

  ${media.xs} {
    width: 100%;
    max-width: 360px;
  }

  ${media.sm} {
    min-width: 0;
    bottom: ${({ bottomNavType }) => sizes(bottomNavType ? 20 : 4)};
  }
`
