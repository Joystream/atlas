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

const fakeMemberShips = [
  {
    id: '1',
    avatarUri: 'https://thispersondoesnotexist.com/image',
    handle: 'Jane Doe',
    about:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias obcaecati distinctio enim in similique totam non necessitatibus minus aliquam qui?',
  },
  {
    id: '2',
    avatarUri: 'https://thispersondoesnotexist.com/image',
    handle: 'Jane Doe',
    about:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias obcaecati distinctio enim in similique totam non necessitatibus minus aliquam qui?',
  },
  {
    id: '3',
    avatarUri: 'https://thispersondoesnotexist.com/image',
    handle: 'Jane Doe',
    about:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias obcaecati distinctio enim in similique totam non necessitatibus minus aliquam qui?',
  },
]

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
        {fakeMemberShips.map((membership) => (
          <StudioCard
            key={membership.id}
            handle={membership.handle}
            avatarUri={membership.avatarUri}
            to={absoluteRoutes.studio.newChannel()}
          />
        ))}
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
  avatarUri?: string
  to?: string
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, to }) => {
  return (
    <CardWrapper as={to ? Link : 'div'} to={to}>
      {avatarUri ? (
        <StyledAvatar imageUrl={avatarUri} />
      ) : (
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
      )}
      <HandleText variant="h4">{handle}</HandleText>
    </CardWrapper>
  )
}

export default SignInView
