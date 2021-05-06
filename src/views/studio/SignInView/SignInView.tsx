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
} from './SignInView.style'
import { SvgGlyphNewChannel } from '@/shared/icons'
import { SignInStepsStepper } from '@/components'
import { useJoystream, useUser } from '@/hooks'
import { useNavigate } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { BasicMembershipFieldsFragment } from '@/api/queries'

const SignInView = () => {
  const navigate = useNavigate()
  const { activeChannelId, setActiveUser } = useUser()

  const { accounts, extensionConnected } = useJoystream()

  const { memberships } = useMemberships(
    {
      where: {
        controllerAccount_in: accounts.map((a) => a.id),
      },
    },
    {
      skip: extensionConnected !== true || !accounts.length,
    }
  )

  const handlePickMembership = async (membership: BasicMembershipFieldsFragment) => {
    const newActiveUser = {
      accountId: membership.controllerAccount,
      memberId: membership.id,
      channelId: activeChannelId,
    }

    if (membership.channels.length) {
      if (!activeChannelId) {
        newActiveUser.channelId = membership.channels[0].id
      }
      setActiveUser(newActiveUser)
      navigate(absoluteRoutes.studio.videos())
    } else {
      setActiveUser(newActiveUser)
      navigate(absoluteRoutes.studio.newChannel())
    }
  }

  return (
    <>
      <Wrapper>
        <Header>
          <Hero variant="hero">Sign in</Hero>
          <SubTitle variant="body1" secondary>
            Select the membership you want to use. Each membership can have an unlimited number of channels and is
            independent of other memberships you control.
          </SubTitle>
        </Header>

        <MemberGrid>
          {memberships?.map((membership) => (
            <StudioCard
              onClick={() => handlePickMembership(membership)}
              key={membership.id}
              handle={membership.handle}
              avatarUri={membership.avatarUri}
            />
          ))}
        </MemberGrid>
        <StyledButton
          icon={<SvgGlyphNewChannel />}
          size="large"
          variant="secondary"
          to={absoluteRoutes.studio.signIn({ step: '1' })}
        >
          New membership
        </StyledButton>
      </Wrapper>
      <SignInStepsStepper />
    </>
  )
}

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarUri?: string | null
  onClick: () => void
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, onClick }) => {
  return (
    <CardWrapper onClick={onClick}>
      <StyledAvatar imageUrl={avatarUri} />
      <HandleText variant="h4">{handle}</HandleText>
    </CardWrapper>
  )
}

export default SignInView
