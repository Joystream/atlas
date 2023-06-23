import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useMemberships } from '@/api/hooks/membership'
import { NftActivityOrderByInput, OwnedNftOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { FallbackContainer } from '@/components/AllNftSection'
import { EmptyFallback } from '@/components/EmptyFallback'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section, SectionProps } from '@/components/Section/Section'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { MemberTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteNftsGrid } from '@/hooks/useInfiniteNftsGrid'
import { SORTING_FILTERS, useNftSectionFilters } from '@/hooks/useNftSectionFilters'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUser } from '@/providers/user/user.hooks'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'
import { SentryLogger } from '@/utils/logs'

import { MemberAbout } from './MemberAbout'
import { MemberActivity } from './MemberActivity'
import { NotFoundMemberContainer, StyledMembershipInfo } from './MemberView.styles'

const TABS: MemberTabs[] = ['NFTs', 'Activity', 'About']

const ACTIVITY_SORTING_FILTERS = [
  {
    label: 'Newest',
    value: NftActivityOrderByInput.EventTimestampDesc,
  },
  {
    label: 'Oldest',
    value: NftActivityOrderByInput.EventTimestampAsc,
  },
]

export const MemberView: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MemberTabs | null
  const [sortByTimestamp, setSortByTimestamp] = useState<NftActivityOrderByInput>(
    NftActivityOrderByInput.EventTimestampDesc
  )
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<typeof TABS[number] | null>(null)
  const { memberId } = useUser()
  const { handle } = useParams()
  const headTags = useHeadTags(handle)

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

  const {
    ownedNftWhereInput,
    order,
    hasAppliedFilters,
    rawFilters,
    actions: { onApplyFilters, setOrder, clearFilters },
  } = useNftSectionFilters()
  const { columns, fetchMore, pageInfo, tiles, totalCount } = useInfiniteNftsGrid({
    where: {
      AND: [
        ownedNftWhereInput,
        {
          OR: [
            {
              owner: {
                isTypeOf_eq: 'NftOwnerChannel',
                channel: {
                  ownerMember: {
                    handle_eq: handle,
                  },
                },
              },
            },
            {
              owner: {
                isTypeOf_eq: 'NftOwnerMember',
                member: {
                  handle_eq: handle,
                },
              },
            },
          ],
        },
      ],
    },
    orderBy: order,
  })

  const handleSetCurrentTab = async (tab: number) => {
    navigate(absoluteRoutes.viewer.member(handle, { tab: TABS[tab] }))
  }

  const mappedTabs = TABS.map((tab) => ({
    name: tab,
    pillText: tab === 'NFTs' ? totalCount : undefined,
  }))

  const tabContent = useMemo(() => {
    switch (currentTab) {
      case 'NFTs':
        return tiles?.length
          ? tiles.map((nft, idx) => <NftTileViewer key={idx} nftId={nft.id} />)
          : [
              <FallbackContainer key="fallback">
                <EmptyFallback
                  title="No NFTs found"
                  subtitle="Please, try changing your filtering criteria."
                  button={
                    hasAppliedFilters && (
                      <Button variant="secondary" onClick={() => clearFilters()}>
                        Clear all filters
                      </Button>
                    )
                  }
                />
              </FallbackContainer>,
            ]
      case 'Activity':
        return [<MemberActivity key="member-activity" memberId={member?.id} sort={sortByTimestamp} />]
      case 'About':
        return [<MemberAbout key="member-about" />]
      default:
        return [<div key="empty" />]
    }
  }, [clearFilters, currentTab, hasAppliedFilters, member?.id, sortByTimestamp, tiles])

  const gridColumns = useMemo(() => {
    switch (currentTab) {
      case 'NFTs':
        return {
          xss: {
            columns: 1,
          },
          sm: {
            columns: 2,
          },
          md: {
            columns: 3,
          },
          lg: {
            columns: 4,
          },
        }
      default:
        return {
          xss: {
            columns: 1,
          },
        }
    }
  }, [currentTab])

  const headerFilters = useMemo((): Omit<
    SectionProps<OwnedNftOrderByInput | NftActivityOrderByInput>['headerProps'],
    'start'
  > => {
    switch (currentTab) {
      case 'NFTs':
        return {
          onApplyFilters,
          filters: rawFilters,
          sort: {
            type: 'toggle-button',
            toggleButtonOptionTypeProps: {
              type: 'options',
              options: SORTING_FILTERS,
              value: order,
              onChange: setOrder,
            },
          },
        }
      case 'Activity':
        return {
          sort: {
            type: 'toggle-button',
            toggleButtonOptionTypeProps: {
              type: 'options',
              options: ACTIVITY_SORTING_FILTERS,
              value: sortByTimestamp,
              onChange: setSortByTimestamp,
            },
          },
        }
      default:
        return {}
    }
  }, [currentTab, onApplyFilters, order, rawFilters, setOrder, sortByTimestamp])

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
        <Section
          headerProps={{
            start: {
              type: 'tabs',
              tabsProps: {
                selected: TABS.findIndex((t) => t === currentTabName),
                tabs: mappedTabs,
                onSelectTab: handleSetCurrentTab,
              },
            },
            ...headerFilters,
          }}
          contentProps={{
            type: 'grid',
            grid: gridColumns,
            children: tabContent,
          }}
          footerProps={
            currentTab === 'NFTs'
              ? {
                  type: 'infinite',
                  loadingTriggerOffset: InfiniteLoadingOffsets.NftTile,
                  reachedEnd: !pageInfo?.hasNextPage ?? true,
                  fetchMore: async () => {
                    if (pageInfo?.hasNextPage) {
                      await fetchMore({
                        variables: {
                          first: columns * 4,
                          after: pageInfo?.endCursor,
                        },
                      })
                    }
                  },
                }
              : undefined
          }
        />
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
