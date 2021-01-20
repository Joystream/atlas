import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps, Router, navigate, globalHistory } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'

import { GlobalStyle, SideNavbar } from '@/shared/components'
import { TopNavbar, ViewErrorFallback } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { globalStyles } from '@/styles/global'
import { breakpoints, sizes } from '@/shared/theme'
import { NavItemType } from '../shared/components/SideNavbar'

const SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'home-fill',
    name: 'Home',
    to: routes.index(),
  },
  {
    icon: 'binocular-fill',
    name: 'Discover',
    to: routes.browse(),
  },
  {
    icon: 'channels',
    name: 'Channels',
    to: routes.channels(),
  },
]

const CHANNEL_IDS = [
  'bf163a58-daf0-41a9-b805-c16ad0ef480c',
  '0d75be46-9e81-4d79-a38f-753fbec0adf6',
  'af8e1acc-cec4-4b3f-962f-22899f9bb617',
  '7770f5a6-2313-4a46-a562-c5b708ea20ba',
  '0c9a00b9-960b-4d48-89a9-67a6c87e66a6',
  '3314712a-554c-4a3c-a2bf-467db1a91f38',
  'accdd79f-ac9b-4bb7-9537-4035e5d62b80',
  'b4c0435e-f01b-41a8-884f-09568047e5cf',
  '2a7398f8-745f-44e1-976b-de9a018a940f',
]

type RouteProps = {
  Component: React.ComponentType
} & RouteComponentProps
const Route: React.FC<RouteProps> = ({ Component, ...pathProps }) => {
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
  useEffect(() => {
    const unsubscribeFromHistory = globalHistory.listen(({ action }) => {
      if (action === 'PUSH') {
        window.scrollTo(0, 0)
      }
    })
    return unsubscribeFromHistory
  }, [])
  return (
    <>
      <GlobalStyle additionalStyles={globalStyles} />
      <TopNavbar default />
      <SideNavbar items={SIDENAVBAR_ITEMS} channelIDs={CHANNEL_IDS} />
      <MainContainer>
        <Router primary={false}>
          <Route default Component={HomeView} />
          <Route path={routes.video()} Component={VideoView} />
          <Route path={routes.search()} Component={SearchView} />
          <Route path={routes.videos()} Component={VideosView} />
          <Route path={routes.channels()} Component={ChannelsView} />
          <Route path={routes.channel()} Component={ChannelView} />
        </Router>
      </MainContainer>
    </>
  )
}

const MainContainer = styled.main`
  padding: 0 var(--global-horizontal-padding);

  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${sizes(14)};
  }
`
export default LayoutWithRouting
