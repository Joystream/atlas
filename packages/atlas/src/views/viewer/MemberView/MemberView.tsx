import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useMemberships } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { absoluteRoutes } from '@/config/routes'
import { SORT_OPTIONS } from '@/config/sorting'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { MemberAbout } from './MemberAbout'
import {
  NotFoundMemberContainer,
  SortContainer,
  StyledMembershipInfo,
  StyledTabs,
  TabsContainer,
} from './MemberView.styles'

const TABS = [
  // 'NFTs',
  'Activity',
  'About',
] as const

export const MemberView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortActivityBy, setSortActivityBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null
  const [currentTab, setCurrentTab] = useState<typeof TABS[number] | null>(null)
  const { activeMemberId } = useUser()
  const { handle } = useParams()
  const {
    memberships,
    error,
    loading: loadingMember,
  } = useMemberships(
    { where: { handle_eq: handle } },
    {
      onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
    }
  )
  const member = memberships?.find((member) => member.handle === handle)

  const handleSetCurrentTab = async (tab: number) => {
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }
  const handleSorting = (value?: unknown) => {
    if (value) {
      setSortActivityBy(value as VideoOrderByInput)
    }
  }
  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))
  const tabContent = React.useMemo(() => {
    switch (currentTab) {
      case 'Activity':
        return 'Activity'
      case 'About':
        return <MemberAbout />
    }
  }, [currentTab])

  // At mount set the tab from the search params
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ 'tab': TABS[0] }, { replace: true })
      initialRender.current = false
    }
  })

  useEffect(() => {
    if (currentTabName) {
      setCurrentTab(currentTabName)
    }
  }, [currentTabName])

  if (!loadingMember && !member) {
    return (
      <NotFoundMemberContainer>
        <EmptyFallback
          title="Member not found"
          button={
            <Button variant="secondary" size="large" to={absoluteRoutes.viewer.index()}>
              Go back to home page
            </Button>
          }
        />
      </NotFoundMemberContainer>
    )
  }
  if (error) {
    return <ViewErrorFallback />
  }
  return (
    <ViewWrapper>
      <LimitedWidthContainer>
        <StyledMembershipInfo
          avatarUrl={member?.avatarUri ?? undefined}
          handle={member?.handle}
          address={member?.controllerAccount}
          loading={loadingMember}
          isOwner={activeMemberId === member?.id}
        />
        <TabsContainer>
          <StyledTabs
            selected={TABS.findIndex((x) => x === currentTab)}
            initialIndex={0}
            tabs={mappedTabs}
            onSelectTab={handleSetCurrentTab}
          />

          {currentTab === 'Activity' && (
            <SortContainer>
              <Select
                size="small"
                labelPosition="left"
                value={sortActivityBy}
                items={SORT_OPTIONS}
                onChange={handleSorting}
              />
            </SortContainer>
          )}
        </TabsContainer>
        {tabContent}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
