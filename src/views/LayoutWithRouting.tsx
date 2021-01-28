import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { BrowserRouter, Routes, useNavigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@sentry/react'
import { GlobalStyle } from '@/shared/components'
import { TopNavbar, ViewErrorFallback, SideNavbar } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { globalStyles } from '@/styles/global'
import { breakpoints } from '@/shared/theme'
import { NavItemType, SIDENAVBAR_WIDTH } from '@/components/SideNavbar'

const SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'home-fill',
    name: 'Home',
    to: routes.index(),
  },
  {
    icon: 'videos',
    name: 'Videos',
    to: routes.videos(),
  },
  {
    icon: 'channels',
    name: 'Channels',
    to: routes.channels(),
  },
]

export type RouteComponentProps = {
  caseSensitive?: boolean
  children?: React.ReactNode
  element?: React.ReactElement | null
  path?: string
}

type RouteProps = {
  Component: React.ComponentType
} & RouteComponentProps
const Route: React.FC<RouteProps> = ({ Component, ...pathProps }) => {
  const navigate = useNavigate()
  return (
    <ErrorBoundary
      fallback={ViewErrorFallback}
      onReset={() => {
        navigate('/')
      }}
    >
      <Component {...pathProps} />
    </ErrorBoundary>
  )
}

const LayoutWithRouting: React.FC = () => {
  const pathname = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <GlobalStyle additionalStyles={globalStyles} />
      <TopNavbar />
      <SideNavbar items={SIDENAVBAR_ITEMS} />
      <MainContainer>
        <Routes>
          <Route path="*" Component={HomeView} />
          <Route path={routes.video()} Component={VideoView} />
          <Route path={routes.search()} Component={SearchView} />
          <Route path={routes.videos()} Component={VideosView} />
          <Route path={routes.channels()} Component={ChannelsView} />
          <Route path={routes.channel()} Component={ChannelView} />
        </Routes>
      </MainContainer>
    </>
  )
}

const RouterWrapper = () => {
  return (
    <BrowserRouter>
      <LayoutWithRouting />
    </BrowserRouter>
  )
}

const MainContainer = styled.main`
  padding: 0 var(--global-horizontal-padding);

  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${SIDENAVBAR_WIDTH}px;
  }
`
export default RouterWrapper
