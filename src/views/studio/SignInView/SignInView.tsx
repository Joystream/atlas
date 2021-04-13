import { absoluteRoutes } from '@/config/routes'
import { useActiveUser } from '@/hooks'
import React, { useState } from 'react'
import {
  Header,
  Hero,
  MemberChannelGrid,
  SubTitle,
  Wrapper,
  StyledButton,
  CardWrapper,
  HandleText,
  StyledAvatar,
  IconWrapper,
} from './SignInView.style'
import { Link } from 'react-router-dom'
import Icon from '@/shared/components/Icon'

const SignInView = () => {
  const [memberships, setMemberships] = useState()

  const { activeUser } = useActiveUser()

  return (
    <Wrapper>
      <Header>
        <Hero variant="hero">Sign in</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <MemberChannelGrid>
        <StudioCard to={absoluteRoutes.studio.newChannel()} empty />
        <StudioCard to={absoluteRoutes.studio.newChannel()} empty />
        <StudioCard to={absoluteRoutes.studio.newChannel()} empty />
      </MemberChannelGrid>
      <StyledButton icon="new-channel" size="large" variant="secondary">
        New Member
      </StyledButton>
    </Wrapper>
  )
}

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  empty?: boolean
  onClick?: () => void
  to?: string
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarPhotoUrl, empty, onClick, to }) => {
  return (
    <CardWrapper empty={empty} onClick={onClick} as={to ? Link : 'div'} to={to}>
      {empty ? (
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
      ) : (
        <StyledAvatar imageUrl={avatarPhotoUrl} />
      )}
      <HandleText variant={empty ? 'h5' : 'h4'}>{handle}</HandleText>
    </CardWrapper>
  )
}

export default SignInView
