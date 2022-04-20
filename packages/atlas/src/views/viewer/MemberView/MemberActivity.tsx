import React from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionBid, SvgActionBuyNow, SvgActionSell, SvgControlsPlaceholder } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { useActivities } from '@/providers/notifications'
import { ActivitiesRecord } from '@/providers/notifications/notifications.types'

import { ActivityItem, ActivityItemProps } from './ActivityItem'
import { GridRowWrapper, OverviewContainer, OverviewItem, OverviewTextContainer } from './MemberActivity.styles'

const getAmount = (notification: ActivitiesRecord) => {
  switch (notification.type) {
    case 'bid':
      return notification.bidAmount
    case 'purchase':
    case 'listing':
    case 'price-change':
    case 'sale':
      return notification.price
  }
}

//TODO: Fetch activity from member
//TODO: infinite scrolling
//TODO: Sorting activity by newest oldest
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
                    description={activity.text}
                    thumbnailPhoto={activity.video.thumbnailPhoto}
                    joy={getAmount(activity)}
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
