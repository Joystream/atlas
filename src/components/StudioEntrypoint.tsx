import React from 'react'
import styled from '@emotion/styled'
import { Spinner, Text } from '@/shared/components'
import { TOP_NAVBAR_HEIGHT } from '@/components'
import { useMembership, useMemberships } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useActiveUser, useJoystream } from '@/hooks'
import { Navigate } from 'react-router-dom'

const DEFAULT_ROUTE = absoluteRoutes.studio.videos()

type StudioEntrypointProps = {
  enterLocation: string
}

export const StudioEntrypoint: React.FC<StudioEntrypointProps> = ({ enterLocation }) => {
  const {
    activeUser: { accountId, memberId, channelId },
    setActiveChannel,
  } = useActiveUser()

  const { membership, loading: membershipLoading } = useMembership(
    {
      where: { id: memberId },
    },
    {
      skip: !memberId,
    }
  )
  const { memberships, loading: membershipsLoading } = useMemberships(
    {
      where: { controllerAccount_eq: accountId },
    },
    { skip: !accountId }
  )

  const { extensionConnected: extensionStatus } = useJoystream()

  const extensionConnected = extensionStatus === true

  const accountSet = !!accountId && extensionConnected
  const memberSet = accountSet && !!memberId
  const channelSet = memberSet && !!channelId

  if (!accountSet) {
    return <Navigate to={absoluteRoutes.studio.signInJoin()} />
  }

  if (accountSet && !memberSet && !membershipsLoading) {
    return (
      <Navigate to={memberships?.length ? absoluteRoutes.studio.signIn() : absoluteRoutes.studio.newMembership()} />
    )
  }

  if (!membershipLoading && membership?.channels.length && memberSet && !channelSet) {
    if (!membership?.channels.length) {
      return <Navigate to={absoluteRoutes.studio.newChannel()} />
    }
    setActiveChannel(membership.channels[0].id)
    return <Navigate to={enterLocation} />
  }

  if (channelSet) {
    return <Navigate to={DEFAULT_ROUTE} />
  }

  return <StudioLoading />
}

const LoadingStudioContainer = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    margin-top: 24px;
  }
`

export const StudioLoading: React.FC = () => {
  return (
    <LoadingStudioContainer>
      <Text variant="h1">Loading Studio View</Text>
      <Spinner />
    </LoadingStudioContainer>
  )
}
