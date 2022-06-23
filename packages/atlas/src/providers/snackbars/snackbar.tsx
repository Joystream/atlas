import styled from '@emotion/styled'
import { FC, ReactNode, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Snackbar } from '@/components/Snackbar'
import {
  SvgActionUpload,
  SvgAlertsError24,
  SvgAlertsInformative24,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
} from '@/components/_icons'
import { Spinner } from '@/components/_loaders/Spinner'
import { useBottomNavStore } from '@/providers/bottomNav'
import { usePersonalDataStore } from '@/providers/personalData'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

import { SnackbarIconType, useSnackbarStore } from './store'

const StyledSpinner = styled(Spinner)`
  margin-bottom: 0;
  margin-top: ${sizes(1)};
`

const ICON_TYPE_TO_ICON: Record<SnackbarIconType, ReactNode> = {
  info: <SvgAlertsInformative24 />,
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
  const { cookiesAccepted } = usePersonalDataStore((state) => ({
    cookiesAccepted: state.cookiesAccepted,
  }))
  const bottomNavOpen = useBottomNavStore((state) => state.open)
  const nonStickedSnackbars = snackbars.filter((snackbar) => !snackbar.sticked)

  useEffect(() => {
    if (nonStickedSnackbars.length > SNACKBARS_LIMIT) {
      setTimeout(() => {
        closeSnackbar(nonStickedSnackbars[0].id)
      }, 500)
    }
  }, [nonStickedSnackbars, closeSnackbar])

  return (
    <SnackbarsContainer cookiesBannerOpen={cookiesAccepted === undefined} bottomNavOpen={bottomNavOpen}>
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

export const SnackbarsContainer = styled.div<{ cookiesBannerOpen: boolean; bottomNavOpen: boolean }>`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  bottom: ${({ cookiesBannerOpen, bottomNavOpen }) => sizes(cookiesBannerOpen ? (bottomNavOpen ? 89 : 73) : 18)};
  margin-left: ${sizes(4)};
  display: grid;
  z-index: ${zIndex.snackbars};
  width: calc(100% - ${sizes(8)});
  transition: bottom ${cVar('animationTransitionMedium')}
    ${({ bottomNavOpen }) => (bottomNavOpen ? transitions.timings.routing : '0ms')};

  ${media.xs} {
    width: 100%;
    max-width: 360px;
  }
`
