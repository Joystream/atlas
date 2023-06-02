import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useMemberships } from '@/api/hooks/membership'
import { NftActivityOrderByInput, OwnedNftOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionFilters } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { MemberTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { NFT_SORT_ACTIVITY_OPTIONS, NFT_SORT_OPTIONS } from '@/config/sorting'
import { useHeadTags } from '@/hooks/useHeadTags'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUser } from '@/providers/user/user.hooks'
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

const TABS: MemberTabs[] = ['NFTs owned', 'Activity', 'About']

export const MemberView: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MemberTabs | null
  const [sortBy, setSortBy] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const [sortByTimestamp, setSortByTimestamp] = useState<NftActivityOrderByInput>(
    NftActivityOrderByInput.EventTimestampDesc
  )
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<MemberTabs | null>(null)
  const [nftCount, setNftCount] = useState<number | undefined>()
  const { memberId, activeMembership } = useUser()
  const { handle } = useParams()
  const headTags = useHeadTags(handle)
  const filtersBarLogic = useFiltersBar()
  const {
    ownedNftWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen },
    canClearFilters: { canClearAllFilters },
  } = filtersBarLogic

  const {
    memberships,
    error,
    loading: loadingMember,
  } = useMemberships(
    { where: { handle_eq: handle } },
    {
      // We're using network-only here, because for some reason the cache is not returning results after user creates membership.
      fetchPolicy: 'network-only',
      onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
    }
  )
  const member = memberships?.find((member) => member.handle === handle)
  const { url: avatarUrl, isLoadingAsset: avatarLoading } = getMemberAvatar(member)

  const toggleFilters = () => {
    setIsFiltersOpen((value) => !value)
  }
  const handleSorting = (value?: OwnedNftOrderByInput | null) => {
    if (value) {
      setSortBy(value)
    }
  }
  const handleSortingActivity = (value?: NftActivityOrderByInput | null) => {
    if (value) {
      setSortByTimestamp(value)
    }
  }
  const handleSetCurrentTab = async (tab: number) => {
    navigate(absoluteRoutes.viewer.member(handle, { tab: TABS[tab] }))
  }

  const mappedTabs = TABS.map((tab) => ({
    name: tab,
    pillText: tab === 'NFTs owned' ? nftCount : undefined,
  }))

  const tabContent = useMemo(() => {
    switch (currentTab) {
      case 'NFTs owned':
        return (
          <MemberNFTs
            ownedNftWhereInput={ownedNftWhereInput}
            sortBy={sortBy}
            isFiltersApplied={canClearAllFilters}
            owner={activeMembership?.handle === handle}
            setNftCount={setNftCount}
          />
        )
      case 'Activity':
        return <MemberActivity memberId={member?.id} sort={sortByTimestamp} />
      case 'About':
        return <MemberAbout />
    }
  }, [
    activeMembership?.handle,
    canClearAllFilters,
    currentTab,
    handle,
    member?.id,
    ownedNftWhereInput,
    sortBy,
    sortByTimestamp,
  ])

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
      setSortBy(OwnedNftOrderByInput.CreatedAtDesc)
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
      {headTags}
      <LimitedWidthContainer>
        <StyledMembershipInfo
          avatarUrl={avatarUrl}
          avatarLoading={avatarLoading}
          handle={member?.handle}
          address={member?.controllerAccount}
          loading={loadingMember}
          isOwner={memberId === member?.id}
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
                {currentTab === 'NFTs owned' ? (
                  <Select
                    size="medium"
                    inlineLabel="Sort by"
                    value={sortBy}
                    items={NFT_SORT_OPTIONS}
                    onChange={handleSorting}
                  />
                ) : (
                  <Select
                    size="medium"
                    inlineLabel="Sort by"
                    value={sortByTimestamp}
                    items={NFT_SORT_ACTIVITY_OPTIONS}
                    onChange={handleSortingActivity}
                  />
                )}
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
