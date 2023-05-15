import BN from 'bn.js'
import { useMemo, useState } from 'react'

import {
  GetTopSellingChannelsQuery,
  useGetTopSellingChannelsQuery,
} from '@/api/queries/__generated__/channels.generated'
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
  SenderItem,
  SenderItemIconsWrapper,
  SkeletonChannelContainer,
  StyledLink,
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

export const TopSellingChannelsTable = () => {
  const [sort, setSort] = useState(7)
  const [emptyPeriods, setEmptyPeriods] = useState<number[]>([])
  const { data, loading } = useGetTopSellingChannelsQuery({
    variables: {
      limit: 10,
      periodDays: sort,
    },
    onCompleted: (data) => {
      if (sort !== 0 && !data.topSellingChannels.length) {
        setEmptyPeriods((prev) => [...prev, sort])
        setSort((prev) => (prev === 7 ? 30 : 0))
      }
    },
  })

  const mdMatch = useMediaMatch('md')
  const mappedData: TableProps['data'] = useMemo(
    () =>
      loading
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
        : data?.topSellingChannels.map((data, index) => ({
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
          })) ?? [],
    [data?.topSellingChannels, loading]
  )

  const sortingOptions = useMemo(
    () =>
      [
        {
          label: 'Last week',
          value: 7,
        },
        {
          label: 'Last month',
          value: 30,
        },
        {
          label: 'All time',
          value: 0,
        },
      ].map((option) => ({
        ...option,
        disabled: emptyPeriods.includes(option.value),
        tooltipText: emptyPeriods.includes(option.value) ? 'No channels available for this period' : undefined,
      })),
    [emptyPeriods]
  )

  if (!data?.topSellingChannels.length && sort === 0 && !loading) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: 'Top selling channels',
        },
        sort: {
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            value: sort,
            onChange: setSort,
            options: sortingOptions,
          },
        },
      }}
      contentProps={{
        type: 'grid',
        grid: {
          sm: {
            columns: 1,
          },
        },
        children: [
          <StyledTable
            key="single"
            emptyState={tableEmptyState}
            columns={COLUMNS}
            data={mappedData}
            doubleColumn={mdMatch}
          />,
        ],
      }}
    />
  )
}

const Channel = ({ channel }: { channel: GetTopSellingChannelsQuery['topSellingChannels'][number]['channel'] }) => {
  // todo to be implemented
  const creatorToken = false
  // todo to be implemented
  const verified = false
  return (
    <StyledLink to={absoluteRoutes.viewer.member(channel.ownerMember?.handle)}>
      <SenderItem
        nodeStart={<Avatar assetUrl={channel.avatarPhoto?.resolvedUrl ?? undefined} />}
        label={channel.ownerMember?.handle}
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
