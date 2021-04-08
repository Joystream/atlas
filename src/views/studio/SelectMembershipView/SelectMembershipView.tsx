import { absoluteRoutes } from '@/config/routes'
import { useActiveUser, useCheckBrowser } from '@/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { getAccountMemberships } from '../fakeUtils'
import { Membership } from '../InitialStudioView/InitialStudioView'
import { Header, Hero, MemberChannelGrid, SubTitle, Wrapper } from './SelectMembershipView.style'
import StudioCard from './StudioCard'

const SelectMembershipView = () => {
  const [memberships, setMemberships] = useState<Membership[]>()

  const browser = useCheckBrowser()
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
        <Hero variant="hero">Select Membership</Hero>
        <SubTitle variant="body2">
          {hasMemberships
            ? 'Select a membership from the list of your memberships. Click create a membership to create and publish a brand new membership.'
            : 'You have no memberships yet. Click Create a membership to become a member'}
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
      </MemberChannelGrid>
    </Wrapper>
  )
}
