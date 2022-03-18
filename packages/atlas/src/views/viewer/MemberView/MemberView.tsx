import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useMemberships, useNfts } from '@/api/hooks'
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
  const [sortNftsBy, setSortNftsBy] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const [currentTab, setCurrentTab] = useState<typeof TABS[number] | null>(null)
  const { activeMemberId, activeMembership } = useUser()
  const { handle } = useParams()
  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    videoWhereInput: { category },
    ownedNftWhereInput: { transactionalStatus_json },
    canClearFilters: { canClearAllFilters },
  } = filtersBarLogic
  const { nfts, loading } = useNfts(
    {
      where: {
        ownerMember: { handle_eq: handle },
        video: { category },
        transactionalStatus_json,
      },
      orderBy: sortNftsBy,
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
  const handleSorting = (value?: unknown) => {
    if (value) {
      setSortNftsBy(value as OwnedNftOrderByInput)
    }
  }
  const handleSetCurrentTab = async (tab: number) => {
    setSearchParams({ 'tab': TABS[tab] }, { replace: true })
  }

  const mappedTabs = TABS.map((tab) => ({
    name: tab,
    pillText: tab === 'NFTs owned' && nfts ? nfts.length : undefined,
  }))
  const tabContent = React.useMemo(() => {
    switch (currentTab) {
      case 'NFTs owned':
        return <MemberNFTs nfts={nfts} loading={loading} owner={activeMembership?.handle === handle} />
      case 'Activity':
        return <MemberActivity />
      case 'About':
        return <MemberAbout />
    }
  }, [activeMembership?.handle, currentTab, handle, loading, nfts])

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
          <TabsContainer>
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
                  value={sortNftsBy}
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
          <FiltersBar {...filtersBarLogic} activeFilters={['nftStatus', 'categories']} />
        </TabsWrapper>
        {tabContent}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
