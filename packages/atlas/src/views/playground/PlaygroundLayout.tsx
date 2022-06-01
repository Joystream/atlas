import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Route, Routes } from 'react-router'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { TopbarBase } from '@/components/_navigation/TopbarBase'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { ConnectionStatusManager } from '@/providers/connectionStatus'
import { ActiveUserProvider, useUser } from '@/providers/user'
import { cVar } from '@/styles'

import {
  PlaygroundEstimatingBlockTime,
  PlaygroundImageDownsizing,
  PlaygroundIndirectSignInDialog,
  PlaygroundMinimizedTransaction,
  PlaygroundNftExtrinsics,
  PlaygroundNftPurchase,
  PlaygroundNftSettleAuction,
  PlaygroundNftWhitelistMembers,
  PlaygroundReactionsComments,
  PlaygroundTokenPrice,
} from './Playgrounds'

const playgroundRoutes = [
  { path: 'nft-extrinsics', element: <PlaygroundNftExtrinsics />, name: 'NFT extrinsics' },
  { path: 'nft-purchase', element: <PlaygroundNftPurchase />, name: 'NFT Purchase' },
  { path: 'settling-auction', element: <PlaygroundNftSettleAuction />, name: 'NFT Settling an auction' },
  { path: 'whitelisting-members', element: <PlaygroundNftWhitelistMembers />, name: 'NFT Whitelisting members' },
  { path: 'block-time', element: <PlaygroundEstimatingBlockTime />, name: 'Estimating block time' },
  { path: 'tjoy-price', element: <PlaygroundTokenPrice />, name: 'Token price' },
  { path: 'indirect-signin-dialog', element: <PlaygroundIndirectSignInDialog />, name: 'Indirect sign in dialog' },
  { path: 'image-downsizing', element: <PlaygroundImageDownsizing />, name: 'Image downsizing' },
  {
    path: 'minimized-transaction',
    element: <PlaygroundMinimizedTransaction />,
    name: 'Minimized transaction snackbar',
  },
  { path: 'reactions-comments', element: <PlaygroundReactionsComments />, name: 'Reactions & comments' },
]

const PlaygroundLayout = () => {
  const [isMemberDropdownActive, setIsMemberDropdownActive] = useState(false)
  const { activeMembership, activeAccountId, activeMemberId, extensionConnected, signIn } = useUser()
  const isLoggedIn = activeAccountId && !!activeMemberId && !!extensionConnected
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(activeMembership)
  return (
    <ActiveUserProvider>
      <TopbarBase
        fullLogoNode={
          <LogoWrapper>
            <SvgJoystreamLogoShort />
            <Text variant="h500" margin={{ left: 2 }}>
              Playground
            </Text>
          </LogoWrapper>
        }
        logoLinkUrl={absoluteRoutes.playground.index()}
      >
        <ButtonContainer>
          <Button variant="secondary" to={absoluteRoutes.viewer.index()}>
            Go to viewer
          </Button>
          <Button variant="secondary" to={absoluteRoutes.studio.index()}>
            Go to studio
          </Button>
          {isLoggedIn ? (
            <Avatar
              size="small"
              assetUrl={memberAvatarUrl}
              loading={memberAvatarLoading}
              onClick={() => setIsMemberDropdownActive(true)}
            />
          ) : (
            <Button onClick={signIn}>Sign in</Button>
          )}
        </ButtonContainer>
      </TopbarBase>
      <MemberDropdown isActive={isMemberDropdownActive} closeDropdown={() => setIsMemberDropdownActive(false)} />
      <ConfirmationModalProvider>
        <Container>
          <NavContainer>
            {playgroundRoutes.map((route) => (
              <Link key={route.path} to={`/playground/${route.path}`}>
                {route.name}
              </Link>
            ))}
          </NavContainer>
          <ContentContainer>
            <Routes>
              {playgroundRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </ContentContainer>
        </Container>
        <ConnectionStatusManager />
      </ConfirmationModalProvider>
    </ActiveUserProvider>
  )
}

const LogoWrapper = styled.div`
  display: flex;
`

const ButtonContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(3, max-content);
  justify-content: end;
  grid-column: 3;
`

const Container = styled.div`
  margin-top: 80px;
  padding: 40px;
  display: flex;
`

const NavContainer = styled.div`
  max-width: 240px;
  display: flex;
  flex-direction: column;
  font-size: 20px;

  a {
    color: ${cVar('colorCoreNeutral50')};
    margin-bottom: 20px;
  }
`

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  overflow: hidden;
`

export default PlaygroundLayout
