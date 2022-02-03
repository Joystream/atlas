import React, { useEffect, useState } from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { imageUrlValidation } from '@/utils/asset'
import { formatDateTime } from '@/utils/time'

import {
  ActivityItemContainer,
  DateText,
  DescriptionSkeletonLoader,
  GridRowWrapper,
  OverviewContainer,
  OverviewItem,
  OverviewTextContainer,
  PillAndDateContainer,
  PillSkeletonLoader,
  Thumbnail,
  ThumbnailSkeletonLoader,
  Title,
  TitleAndDescriptionContainer,
  TitleSkeletonLoader,
} from './MemberActivity.styles'

//TODO: Fetch activity from member
//TODO: infinite scrolling
//TODO: Sorting activity by newest oldest
export const MemberActivity = () => {
  const activity: Array<ActivityItemProps> = [
    {
      date: '11 Nov 2021, 20:25',
      type: 'Bid',
      title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
      description: 'Bedeho placed a bid for ツ 32K ',
      thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
    },
    {
      date: '11 Nov 2021, 20:25',
      type: 'Withdrawl',
      title: 'AMSTERDAM LIGHT FESTIVAL - TRAVEL VLOG 220ENTERP...',
      description: 'Bedeho purchased NFT for ツ 32,5M ',
      thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
    },
    {
      date: '11 Nov 2021, 20:25',
      type: 'Purchase',
      title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
      description: 'Bedeho won auction with ツ 11,2K  ',
      thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
    },
    {
      date: '11 Nov 2021, 20:25',
      type: 'Purchase',
      title: 'EVERYTHING YOU LOVE & EXPERIENCE ABOUT TRAVEL',
      description: 'Bedeho placed a bid for ツ 32K ',
      thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
    },
    {
      date: '11 Nov 2021, 20:25',
      type: 'Sale',
      title: 'closer',
      description: 'Bedeho sold NFT for ツ 98,6K to Lenorette ',
      thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
    },
  ]

  return (
    <section>
      {activity.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="Go out there and explore!" variant="small" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <LayoutGrid>
              {activity?.map((activity, i) => (
                <GridItem key={i} colSpan={{ base: 12 }}>
                  <ActivityItem
                    date={activity.date}
                    type={activity.type}
                    title={activity.title}
                    description={activity.description}
                    thumnailUri={activity.thumnailUri}
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
                  <IconWrapper icon={<SvgActionMint />} size="large" />
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

export type ActivityItemProps = {
  date: string
  type: string
  title: string
  description: string
  thumnailUri: string
}
export const ActivityItem: React.FC<ActivityItemProps> = ({ date, type, title, description, thumnailUri }) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  useEffect(() => {
    const validateImg = async () => {
      const res = await imageUrlValidation(thumnailUri)
      setThumbnailLoaded(res)
    }
    validateImg()
  }, [thumnailUri])

  const getTitleTextVariant = () => {
    if (smMatch) {
      return 'h300'
    } else if (lgMatch) {
      return 'h400'
    } else {
      return 'h200'
    }
  }

  const isLoading = !date || !type || !title || !thumbnailLoaded
  return (
    <ActivityItemContainer loading={isLoading}>
      {isLoading ? <ThumbnailSkeletonLoader /> : <Thumbnail src={thumnailUri} />}
      <TitleAndDescriptionContainer>
        {isLoading ? (
          <TitleSkeletonLoader />
        ) : (
          <div>
            <Title variant={getTitleTextVariant()} clampAfterLine={smMatch ? 2 : 1}>
              {title}
            </Title>
          </div>
        )}
        {isLoading ? (
          <DescriptionSkeletonLoader />
        ) : (
          <Text variant={lgMatch ? 't300' : 't200'} secondary>
            {description}
          </Text>
        )}
      </TitleAndDescriptionContainer>
      {isLoading ? (
        <PillSkeletonLoader />
      ) : (
        <PillAndDateContainer>
          <div>
            <Pill label={type} size="small" />
          </div>
          <DateText variant="t100" secondary>
            {formatDateTime(new Date(date))}
          </DateText>
        </PillAndDateContainer>
      )}
    </ActivityItemContainer>
  )
}
