import { FC } from 'react'
import { useNavigate } from 'react-router'

import { NftActivityOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { createPlaceholderData } from '@/utils/data'

import { ActivityItem } from './ActivityItem'
import { ActivitiesRecord, useActivities } from './MemberActivity.hooks'
import {
  GridRowWrapper,
  InfoListItem,
  OverviewContainer,
  OverviewTextContainer,
  StyledIconWrapper,
  StyledLink,
} from './MemberActivity.styles'

const getFromHandle = (activity: ActivitiesRecord) => {
  if (activity.type === 'Bid' || activity.type === 'Withdrawal') {
    return activity.from.handle
  } else {
    return activity.from?.__typename === 'NftOwnerChannel'
      ? activity.from.channel.ownerMember?.handle
      : activity.from?.member.handle
  }
}

const getDescription = (activity: ActivitiesRecord) => {
  const fromHandle = getFromHandle(activity)

  switch (activity.type) {
    case 'Bid':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          placed a bid for{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.bidAmount} withToken />
        </>
      )
    case 'Sale':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          sold NFT to{' '}
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)} onClick={(e) => e.stopPropagation()}>
            {activity.to?.handle}
          </StyledLink>{' '}
          NFT for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
        </>
      )
    case 'Purchase':
      return (
        <>
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)} onClick={(e) => e.stopPropagation()}>
            {activity.to?.handle}{' '}
          </StyledLink>{' '}
          purchased NFT for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />{' '}
          from{' '}
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
        </>
      )
    case 'Listing':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          listed NFT{' '}
          {activity.typeName === 'NftSellOrderMadeEventData' && activity.price && (
            <>
              for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
            </>
          )}
        </>
      )
    case 'Removal':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          removed NFT from sale
        </>
      )
    case 'Mint':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          minted new NFT
        </>
      )
    case 'Withdrawal':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          withdrew a bid
        </>
      )
    case 'Price change':
      return (
        <>
          <StyledLink
            to={absoluteRoutes.viewer.member(fromHandle, { tab: 'NFTs' })}
            onClick={(e) => e.stopPropagation()}
          >
            {fromHandle}
          </StyledLink>{' '}
          changed price to <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
        </>
      )
  }
}

type MemberActivityProps = {
  memberId?: string
  sort?: NftActivityOrderByInput
}

const PLACEHOLDERS_COUNT = 8

export const MemberActivity: FC<MemberActivityProps> = ({
  memberId,
  sort = NftActivityOrderByInput.EventTimestampDesc,
}) => {
  const { activities, loading, activitiesTotalCounts, pageInfo, fetchMore } = useActivities(memberId, sort, {
    notifyOnNetworkStatusChange: true,
  })
  const navigate = useNavigate()
  const placeholderItems = createPlaceholderData(PLACEHOLDERS_COUNT)

  const items = [...(activities || []), ...(loading ? placeholderItems : [])] ?? []

  return (
    <section>
      {!loading && items.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="This member hasn’t done anything yet." variant="large" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <Section
              contentProps={{
                type: 'grid',
                grid: {
                  sm: {
                    columns: 1,
                  },
                },
                children: items.map((activity, i) =>
                  activity.id === undefined ? (
                    <ActivityItem key={i} loading={loading} thumbnailUri="" />
                  ) : (
                    <ActivityItem
                      key={i}
                      thumbnailUri={activity.video?.thumbnailPhoto?.resolvedUrl || ''}
                      onItemClick={() => navigate(absoluteRoutes.viewer.video(activity.video?.id))}
                      date={activity?.date}
                      type={activity?.type}
                      title={activity?.video?.title || ''}
                      description={getDescription(activity)}
                    />
                  )
                ),
              }}
              footerProps={{
                type: 'load',
                label: 'Load more activities',
                reachedEnd: !pageInfo?.hasNextPage ?? true,
                fetchMore: async () => {
                  await fetchMore({
                    variables: {
                      after: pageInfo?.endCursor,
                      first: 10,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      fetchMoreResult.nftActivitiesConnection.edges = [
                        ...(prev.nftActivitiesConnection?.edges ?? []),
                        ...fetchMoreResult.nftActivitiesConnection.edges,
                      ]
                      return fetchMoreResult
                    },
                  })
                },
              }}
            />
          </GridItem>
          {!loading && activitiesTotalCounts && (
            <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
              <Text as="span" variant="h500">
                Overview
              </Text>
              <OverviewContainer>
                <InfoListItem>
                  <StyledIconWrapper icon={<SvgActionBuyNow />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs bought
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsBoughts}
                    </Text>
                  </OverviewTextContainer>
                </InfoListItem>
                <InfoListItem>
                  <StyledIconWrapper icon={<SvgActionSell />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs sold
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsSold}
                    </Text>
                  </OverviewTextContainer>
                </InfoListItem>
                <GridRowWrapper>
                  <InfoListItem>
                    <StyledIconWrapper icon={<SvgActionMint />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        NFTs created
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsIssued}
                      </Text>
                    </OverviewTextContainer>
                  </InfoListItem>
                  <InfoListItem>
                    <StyledIconWrapper icon={<SvgActionBid />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        Bid placed
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsBidded}
                      </Text>
                    </OverviewTextContainer>
                  </InfoListItem>
                </GridRowWrapper>
              </OverviewContainer>
            </GridItem>
          )}
        </LayoutGrid>
      )}
    </section>
  )
}
