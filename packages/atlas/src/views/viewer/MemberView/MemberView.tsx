import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useMemberships, useNftsConnection } from '@/api/hooks'
import { OwnedNftOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { SvgActionFilters } from '@/components/_icons'
import { Select } from '@/components/_inputs/Select'
import { absoluteRoutes } from '@/config/routes'
import { NFT_SORT_OPTIONS } from '@/config/sorting'
import { useMemberAvatar } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { MemberAbout } from './MemberAbout'
import { MemberActivity } from './MemberActivity'
import { MemberNFTs } from './MemberNFTs'
import {
  FilterButtonContainer,
  NotFoundMemberContainer,
  SortContainer,
  StyledMembershipInfo,
  StyledTabs,
  TabsContainer,
  TabsWrapper,
} from './MemberView.styles'

const TABS = ['NFTs owned', 'Activity', 'About'] as const

export const MemberView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>('createdAt_DESC')
  const [currentTab, setCurrentTab] = useState<typeof TABS[number] | null>(null)
  const { activeMemberId, activeMembership } = useUser()
  const { handle } = useParams()
  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    ownedNftWhereInput: { transactionalStatus_json, transactionalStatusAuction },
    canClearFilters: { canClearAllFilters },
  } = filtersBarLogic

  const { nfts, loading } = useNftsConnection(
    {
      where: {
        ownerMember: { handle_eq: handle },
        transactionalStatus_json,
        transactionalStatusAuction,
      },
      orderBy: sortBy as OwnedNftOrderByInput,
    },
    { skip: !handle }
  )

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
  const { url: avatarUrl, isLoadingAsset: avatarLoading } = useMemberAvatar(member)

  const toggleFilters = () => {
    setIsFiltersOpen((value) => !value)
  }
  const handleSorting = (value?: 'createdAt_ASC' | 'createdAt_DESC' | null) => {
    if (value) {
      setSortBy(value)
    }
  }
  const handleSetCurrentTab = async (tab: number) => {
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }

  const mappedTabs = TABS.map((tab) => ({
    name: tab,
    pillText: tab === 'NFTs owned' && nfts && nfts.length ? nfts.length : undefined,
  }))
  const tabContent = React.useMemo(() => {
    switch (currentTab) {
      case 'NFTs owned':
        return (
          <MemberNFTs
            isFiltersApplied={canClearAllFilters}
            nfts={nfts}
            loading={loading}
            owner={activeMembership?.handle === handle}
          />
        )
      case 'Activity':
        return <MemberActivity memberId={member?.id} sort={sortBy as 'createdAt_ASC' | 'createdAt_DESC'} />
      case 'About':
        return <MemberAbout />
    }
  }, [activeMembership?.handle, canClearAllFilters, currentTab, handle, loading, member?.id, nfts, sortBy])

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
      setSortBy('createdAt_DESC')
      setCurrentTab(currentTabName)
      setIsFiltersOpen(false)
    }
  }, [currentTabName, setIsFiltersOpen])

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
          avatarUrl={avatarUrl}
          avatarLoading={avatarLoading}
          handle={member?.handle}
          address={member?.controllerAccount}
          loading={loadingMember}
          isOwner={activeMemberId === member?.id}
        />
        <TabsWrapper isFiltersOpen={isFiltersOpen}>
          <TabsContainer isMemberActivityTab={currentTab === 'Activity'}>
            <StyledTabs
              selected={TABS.findIndex((x) => x === currentTab)}
              initialIndex={0}
              tabs={mappedTabs}
              onSelectTab={handleSetCurrentTab}
            />
            {currentTab && ['NFTs owned', 'Activity'].includes(currentTab) && (
              <SortContainer>
                <Select
                  size="small"
                  labelPosition="left"
                  value={sortBy}
                  items={NFT_SORT_OPTIONS}
                  onChange={handleSorting}
                />
              </SortContainer>
            )}
            {currentTab === 'NFTs owned' && (
              <FilterButtonContainer>
                <Button
                  badge={canClearAllFilters}
                  variant="secondary"
                  icon={<SvgActionFilters />}
                  onClick={toggleFilters}
                >
                  Filters
                </Button>
              </FilterButtonContainer>
            )}
          </TabsContainer>
          <FiltersBar {...filtersBarLogic} activeFilters={['nftStatus']} />
        </TabsWrapper>
        {tabContent}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
