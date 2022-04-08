import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Route, Routes } from 'react-router'
import { Link } from 'react-router-dom'

import { Button } from '@/components/_buttons/Button'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { TopbarBase } from '@/components/_navigation/TopbarBase'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { ConnectionStatusManager } from '@/providers/connectionStatus'
import { ActiveUserProvider } from '@/providers/user'
import { oldColors } from '@/styles'

import {
  PlaygroundEstimatingBlockTime,
  PlaygroundImageDownsizing,
  PlaygroundIndirectSignInDialog,
  PlaygroundNftExtrinsics,
  PlaygroundNftPurchase,
  PlaygroundNftSettleAuction,
  PlaygroundNftWhitelistMembers,
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
]

const PlaygroundLayout = () => {
  const [isMemberDropdownActive, setIsMemberDropdownActive] = useState(false)
  return (
    <ActiveUserProvider>
      <TopbarBase fullLogoNode={<SvgJoystreamLogoShort />} logoLinkUrl={absoluteRoutes.viewer.index()}>
        <ButtonContainer>
          <Button variant="secondary" to={absoluteRoutes.viewer.index()}>
            Go to viewer
          </Button>
          <Button variant="secondary" to={absoluteRoutes.studio.index()}>
            Go to studio
          </Button>
          <Button onClick={() => setIsMemberDropdownActive(true)}>Open member dropdown</Button>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
    color: ${oldColors.gray[50]};
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
