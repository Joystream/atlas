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
import Icon from '@/shared/components/Icon'
import { To } from 'history'

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
  return (
    <Wrapper>
      <Header>
        <Hero variant="hero">Sign in</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <MemberGrid>
        {fakeMemberShips.map((membership) => (
          <StudioCard
            key={membership.id}
            handle={membership.handle}
            avatarUri={membership.avatarUri}
            to={absoluteRoutes.studio.newChannel()}
          />
        ))}
      </MemberGrid>
      <StyledButton icon="new-channel" size="large" variant="secondary" to={absoluteRoutes.studio.newMembership()}>
        New Member
      </StyledButton>
    </Wrapper>
  )
}

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarUri?: string
  to: To
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, to }) => {
  return (
    <CardWrapper to={to}>
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
