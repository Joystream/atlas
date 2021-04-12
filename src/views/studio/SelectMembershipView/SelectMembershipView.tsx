import { absoluteRoutes } from '@/config/routes'
import { useActiveUser } from '@/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { getAccountMemberships } from '../fakeUtils'
import { Membership } from '../InitialStudioView/InitialStudioView'
import { Header, Hero, MemberChannelGrid, SubTitle, Wrapper, StyledButton } from './SelectMembershipView.style'
import StudioCard from './StudioCard'

const SelectMembershipView = () => {
  const [memberships, setMemberships] = useState<Membership[]>()

  const { activeUser } = useActiveUser()

  // temporary
  const getMemberShips = useCallback(async () => {
    if (!activeUser?.accountId) {
      return
    }
    const memberships = await getAccountMemberships(activeUser.accountId)
    setMemberships(memberships)
  }, [activeUser?.accountId])

  useEffect(() => {
    getMemberShips()
  }, [getMemberShips])

  const hasMemberships = memberships?.length

  return (
    <Wrapper>
      <Header>
        <Hero variant="hero">Sign in</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <MemberChannelGrid>
        {memberships?.map((membership) => (
          <StudioCard
            to={absoluteRoutes.studio.newChannel()}
            key={membership.id}
            avatarPhotoUrl={membership.avatarUri}
            handle={membership.handle}
          />
        ))}
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

export default SelectMembershipView
