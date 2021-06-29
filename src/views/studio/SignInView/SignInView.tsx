import React from 'react'
import { useNavigate } from 'react-router'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { SignInStepsStepper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { useConnectionStatusStore, useUser } from '@/providers'
import { SvgGlyphNewChannel } from '@/shared/icons'

import {
  CardWrapper,
  HandleText,
  Header,
  Hero,
  MemberGrid,
  StyledAvatar,
  StyledButton,
  SubTitle,
  Wrapper,
} from './SignInView.style'

export const SignInView = () => {
  const navigate = useNavigate()
  const { activeChannelId, setActiveUser, memberships } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

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
              disabled={nodeConnectionStatus !== 'connected'}
            />
          ))}
        </MemberGrid>
        <StyledButton
          disabled={nodeConnectionStatus !== 'connected'}
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
  disabled?: boolean
}

export const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, onClick, disabled }) => {
  return (
    <CardWrapper onClick={onClick} disabled={disabled}>
      <StyledAvatar assetUrl={avatarUri} />
      <HandleText variant="h4">{handle}</HandleText>
    </CardWrapper>
  )
}
