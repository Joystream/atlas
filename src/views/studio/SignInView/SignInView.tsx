import { absoluteRoutes } from '@/config/routes'
import React from 'react'
import {
  Header,
  Hero,
  MemberGrid,
  SubTitle,
  Wrapper,
  StyledButton,
  CardWrapper,
  HandleText,
  StyledAvatar,
  IconWrapper,
} from './SignInView.style'
import { To } from 'history'
import regularMockMemberships from '@/mocking/data/mockMemberships'
import { SvgGlyphNewChannel } from '@/shared/icons'

const SignInView = () => {
  // temporary
  const fakememberships = regularMockMemberships
  return (
    <Wrapper>
      <Header>
        <Hero variant="hero">Sign in</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <MemberGrid>
        {fakememberships.map((membership) => (
          <StudioCard
            key={membership.id}
            handle={membership.handle}
            avatarUri={membership.avatarUri}
            to={absoluteRoutes.studio.newChannel()}
          />
        ))}
      </MemberGrid>
      <StyledButton
        icon={<SvgGlyphNewChannel />}
        size="large"
        variant="secondary"
        to={absoluteRoutes.studio.newMembership()}
      >
        New Member
      </StyledButton>
    </Wrapper>
  )
}

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarUri?: string | null
  to: To
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, to }) => {
  return (
    <CardWrapper to={to}>
      {avatarUri ? (
        <StyledAvatar imageUrl={avatarUri} />
      ) : (
        <IconWrapper>
          <SvgGlyphNewChannel />
        </IconWrapper>
      )}
      <HandleText variant="h4">{handle}</HandleText>
    </CardWrapper>
  )
}

export default SignInView
