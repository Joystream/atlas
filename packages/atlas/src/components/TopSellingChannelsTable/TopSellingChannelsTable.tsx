import BN from 'bn.js'
import { useMemo, useRef, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

import {
  GetTopSellingChannelsFromThreePeriodsQuery,
  useGetTopSellingChannelsFromThreePeriodsQuery,
} from '@/api/queries/__generated__/channels.generated'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionCreatorToken, SvgActionVerified } from '@/assets/icons'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { TableProps } from '@/components/Table'
import { RightAlignedHeader } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  JoyAmountWrapper,
  NftSoldText,
  ScrollWrapper,
  SenderItemIconsWrapper,
  SkeletonChannelContainer,
  StyledLink,
  StyledListItem,
  StyledTable,
} from './TopSellingChannelsTable.styles'

import { Avatar } from '../Avatar'

const COLUMNS: TableProps['columns'] = [
  {
    Header: '',
    accessor: 'index',
    width: 1,
  },
  {
    Header: 'CHANNEL',
    accessor: 'channel',
    width: 9,
  },
  {
    Header: () => <RightAlignedHeader>NFTS SOLD</RightAlignedHeader>,
    accessor: 'nftsSold',
    width: 4,
  },
  {
    Header: () => <RightAlignedHeader>SALES VOLUME</RightAlignedHeader>,
    accessor: 'salesVolume',
    width: 4,
  },
]

const tableEmptyState = {
  title: 'No top selling channels found',
  description:
    'There are no top selling channels to display for the selected period. You can try selecting a different period to see if there were any sales during that time.',
  icon: <SvgEmptyStateIllustration />,
}

type TopSellingChannelsQueryPropKey = Exclude<keyof GetTopSellingChannelsFromThreePeriodsQuery, '__typename'>

const MIN_TOP_SELLING_ITEMS = 4

export const TopSellingChannelsTable = () => {
  const [sort, setSort] = useState<TopSellingChannelsQueryPropKey>('topAllTimeSellingChannels')

  const { data, loading } = useGetTopSellingChannelsFromThreePeriodsQuery({
    variables: {
      limit: 10,
    },
  })

  const ref = useRef<HTMLDivElement>(null)
  const { onMouseDown } = useDraggableScroll(ref, { direction: 'horizontal' })

  const lgMatch = useMediaMatch('lg')
  const mappedData: TableProps['data'] = useMemo(() => {
    return loading
      ? Array.from({ length: 10 }, () => ({
          index: null,
          channel: (
            <SkeletonChannelContainer>
              <SkeletonLoader width={32} height={32} rounded />
              <SkeletonLoader width="30%" height={20} />
            </SkeletonChannelContainer>
          ),
          nftsSold: <SkeletonLoader width="50%" height={16} />,
          salesVolume: <SkeletonLoader width="100%" height={16} />,
        }))
      : data?.[sort].map((data, index) => ({
          index: (
            <Text variant="t100" as="p" color="colorTextMuted">
              {index + 1}
            </Text>
          ),
          salesVolume: (
            <JoyAmountWrapper>
              <JoyTokenIcon variant="gray" />
              <NumberFormat
                variant="t200-strong"
                as="p"
                value={new BN(data.amount)}
                margin={{ left: 1 }}
                format="short"
              />
            </JoyAmountWrapper>
          ),
          nftsSold: (
            <NftSoldText variant="t100" as="p">
              {data.nftSold}
            </NftSoldText>
          ),
          channel: <Channel channel={data.channel} />,
        })) ?? []
  }, [data, loading, sort])

  const sortingOptions = useMemo(
    () => [
      ...((data?.topWeekSellingChannels.length || 0) >= MIN_TOP_SELLING_ITEMS
        ? [
            {
              label: 'Last week',
              value: 'topWeekSellingChannels' as const,
            },
          ]
        : []),
      ...((data?.topMonthSellingChannels.length || 0) >= MIN_TOP_SELLING_ITEMS
        ? [
            {
              label: 'Last month',
              value: 'topMonthSellingChannels' as const,
            },
          ]
        : []),
      ...((data?.topAllTimeSellingChannels.length || 0) >= MIN_TOP_SELLING_ITEMS
        ? [
            {
              label: 'All time',
              value: 'topAllTimeSellingChannels' as const,
            },
          ]
        : []),
    ],
    [data]
  )

  if (!data?.topAllTimeSellingChannels.length && sort === 'topAllTimeSellingChannels' && !loading) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: 'Top selling channels',
        },
        ...(sortingOptions.length > 1
          ? {
              sort: {
                type: 'toggle-button',
                toggleButtonOptionTypeProps: {
                  type: 'options',
                  value: sort,
                  onChange: setSort,
                  options: sortingOptions,
                },
              },
            }
          : {}),
      }}
      contentProps={{
        type: 'grid',
        grid: {
          sm: {
            columns: 1,
          },
        },
        children: [
          <ScrollWrapper key="single" ref={ref} onMouseDown={onMouseDown}>
            <StyledTable emptyState={tableEmptyState} columns={COLUMNS} data={mappedData} doubleColumn={lgMatch} />
          </ScrollWrapper>,
        ],
      }}
    />
  )
}

const Channel = ({ channel }: { channel: BasicChannelFieldsFragment }) => {
  // todo to be implemented
  const creatorToken = false
  // todo to be implemented
  const verified = false
  return (
    <StyledLink to={absoluteRoutes.viewer.channel(channel.id)} title={channel.title || ''}>
      <StyledListItem
        nodeStart={<Avatar assetUrl={channel.avatarPhoto?.resolvedUrl ?? undefined} />}
        label={channel.title}
        isInteractive={false}
        nodeEnd={
          <SenderItemIconsWrapper>
            {creatorToken && (
              <span title="Creator token">
                <SvgActionCreatorToken />
              </span>
            )}
            {verified && (
              <span title="Verified">
                <SvgActionVerified />
              </span>
            )}
          </SenderItemIconsWrapper>
        }
      />
    </StyledLink>
  )
}
