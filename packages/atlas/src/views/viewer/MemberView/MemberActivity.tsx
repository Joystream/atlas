import React from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionBid, SvgActionBuyNow, SvgActionSell, SvgControlsPlaceholder } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { formatNumberShort } from '@/utils/number'

import { ActivityItem, ActivityItemProps } from './ActivityItem'
import { ActivitiesRecord, useActivities } from './MemberActivity.hooks'
import {
  GridRowWrapper,
  OverviewContainer,
  OverviewItem,
  OverviewTextContainer,
  PriceText,
  StyledLink,
} from './MemberActivity.styles'

const getDescription = (activity: ActivitiesRecord) => {
  switch (activity.type) {
    case 'Bid':
      return (
        <>
          {activity.from.handle} placed a bid for <PriceText>ツ {formatNumberShort(activity.bidAmount)} </PriceText>
        </>
      )
    case 'Sale':
      return (
        <>
          {activity.from?.handle} sold NFT to{' '}
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)}>{activity.to?.handle}</StyledLink> NFT for{' '}
          <PriceText>ツ {formatNumberShort(activity.price)} </PriceText>
        </>
      )
    case 'Purchase':
      return (
        <>
          {activity.from?.handle} purchased NFT for <PriceText>ツ {formatNumberShort(activity.price)} </PriceText> from{' '}
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)}>{activity.to?.handle} </StyledLink>
        </>
      )
    case 'Listing':
      return (
        <>
          {activity.from?.handle} listed NFT{' '}
          {activity.typeName === 'NftSellOrderMadeEvent' && activity.price && (
            <>
              for <PriceText>ツ {formatNumberShort(activity.price)} </PriceText>
            </>
          )}
        </>
      )
    case 'Removal':
      return <>{activity.from?.handle} removed NFT from sale</>
    case 'Mint':
      return <>{activity.from?.handle} minted new NFT</>
    case 'Withdrawal':
      return <>{activity.from.handle} withdrew a bid</>
    case 'Price change':
      return <>{activity.from?.handle} changed price to </>
  }
}

type MemberActivityProps = {
  memberId?: string
}

export const MemberActivity: React.FC<MemberActivityProps> = ({ memberId }) => {
  const { activities } = useActivities(memberId)

  return (
    <section>
      {activities.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="Go out there and explore!" variant="small" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <LayoutGrid>
              {activities?.map((activity, i) => (
                <GridItem key={i} colSpan={{ base: 12 }}>
                  <ActivityItemWithResolvedAsset
                    date={activity.date}
                    type={activity.type}
                    videoUrl={absoluteRoutes.viewer.video(activity.video.id)}
                    title={activity.video.title}
                    description={getDescription(activity)}
                    thumbnailPhoto={activity.video.thumbnailPhoto}
                  />
                </GridItem>
              ))}
            </LayoutGrid>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
            <Text variant="h500">Overview</Text>

            <OverviewContainer>
              <OverviewItem>
                <IconWrapper icon={<SvgActionBuyNow />} size="large" />
                <OverviewTextContainer>
                  <Text variant="t100" secondary>
                    Bought
                  </Text>
                  <Text variant="t300">120</Text>
                </OverviewTextContainer>
              </OverviewItem>
              <OverviewItem>
                <IconWrapper icon={<SvgActionSell />} size="large" />
                <OverviewTextContainer>
                  <Text variant="t100" secondary>
                    Sold
                  </Text>
                  <Text variant="t300">80</Text>
                </OverviewTextContainer>
              </OverviewItem>
              <GridRowWrapper>
                <OverviewItem>
                  <IconWrapper icon={<SvgControlsPlaceholder />} size="large" />
                  <OverviewTextContainer>
                    <Text variant="t100" secondary>
                      Created
                    </Text>
                    <Text variant="t300">5</Text>
                  </OverviewTextContainer>
                </OverviewItem>
                <OverviewItem>
                  <IconWrapper icon={<SvgActionBid />} size="large" />
                  <OverviewTextContainer>
                    <Text variant="t100" secondary>
                      Bidding
                    </Text>
                    <Text variant="t300">10</Text>
                  </OverviewTextContainer>
                </OverviewItem>
              </GridRowWrapper>
            </OverviewContainer>
          </GridItem>
        </LayoutGrid>
      )}
    </section>
  )
}

type ActivityItemWithResolvedAssetProps = {
  thumbnailPhoto: StorageDataObjectFieldsFragment | null
} & Omit<ActivityItemProps, 'thumnailUri'>

export const ActivityItemWithResolvedAsset: React.FC<ActivityItemWithResolvedAssetProps> = ({
  thumbnailPhoto,
  ...restProps
}) => {
  const { url } = useAsset(thumbnailPhoto)
  return <ActivityItem {...restProps} thumnailUri={url || ''} />
}
