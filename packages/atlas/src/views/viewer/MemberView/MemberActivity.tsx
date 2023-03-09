import { FC } from 'react'
import { useNavigate } from 'react-router'

import { NftActivityOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'

import { ActivityItem } from './ActivityItem'
import { ActivitiesRecord, useActivities } from './MemberActivity.hooks'
import {
  GridRowWrapper,
  OverviewContainer,
  OverviewItem,
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
          {fromHandle} placed a bid for{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.bidAmount} withToken />
        </>
      )
    case 'Sale':
      return (
        <>
          {fromHandle} sold NFT to{' '}
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
          from {fromHandle}
        </>
      )
    case 'Listing':
      return (
        <>
          {fromHandle} listed NFT{' '}
          {activity.typeName === 'NftSellOrderMadeEventData' && activity.price && (
            <>
              for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
            </>
          )}
        </>
      )
    case 'Removal':
      return <>{fromHandle} removed NFT from sale</>
    case 'Mint':
      return <>{fromHandle} minted new NFT</>
    case 'Withdrawal':
      return <>{fromHandle} withdrew a bid</>
    case 'Price change':
      return (
        <>
          {fromHandle} changed price to{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
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
  const { activities, loading, activitiesTotalCounts } = useActivities(memberId, sort)
  const navigate = useNavigate()
  const placeholderItems = Array.from({ length: PLACEHOLDERS_COUNT }, () => ({ id: undefined }))
  const items = activities && !loading ? activities : (placeholderItems as ActivitiesRecord[])
  return (
    <section>
      {activities?.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="Go out there and explore!" variant="small" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <LayoutGrid>
              {items?.map((activity, i) => (
                <GridItem key={i} colSpan={{ base: 12 }}>
                  <ActivityItem
                    thumbnailUri={activity.video?.thumbnailPhoto?.resolvedUrl || ''}
                    loading={!activities || loading}
                    onItemClick={() => navigate(absoluteRoutes.viewer.video(activity.video?.id))}
                    date={activity?.date}
                    type={activity?.type}
                    title={activity?.video?.title || ''}
                    description={getDescription(activity)}
                  />
                </GridItem>
              ))}
            </LayoutGrid>
          </GridItem>
          {!loading && activitiesTotalCounts && (
            <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
              <Text as="span" variant="h500">
                Overview
              </Text>
              <OverviewContainer>
                <OverviewItem>
                  <StyledIconWrapper icon={<SvgActionBuyNow />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs bought
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsBoughts}
                    </Text>
                  </OverviewTextContainer>
                </OverviewItem>
                <OverviewItem>
                  <StyledIconWrapper icon={<SvgActionSell />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs sold
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsSold}
                    </Text>
                  </OverviewTextContainer>
                </OverviewItem>
                <GridRowWrapper>
                  <OverviewItem>
                    <StyledIconWrapper icon={<SvgActionMint />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        NFTs created
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsIssued}
                      </Text>
                    </OverviewTextContainer>
                  </OverviewItem>
                  <OverviewItem>
                    <StyledIconWrapper icon={<SvgActionBid />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        Bid placed
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsBidded}
                      </Text>
                    </OverviewTextContainer>
                  </OverviewItem>
                </GridRowWrapper>
              </OverviewContainer>
            </GridItem>
          )}
        </LayoutGrid>
      )}
    </section>
  )
}
