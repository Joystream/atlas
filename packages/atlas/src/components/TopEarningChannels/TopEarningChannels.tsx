import BN from 'bn.js'
import { useMemo } from 'react'

import { useBasicChannels } from '@/api/hooks/channel'
import { ChannelOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
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

import { Avatar } from '../Avatar'
import {
  JoyAmountWrapper,
  SenderItemIconsWrapper,
  SkeletonChannelContainer,
  StyledLink,
  StyledListItem,
  StyledTable,
} from '../TopSellingChannelsTable/TopSellingChannelsTable.styles'

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
    Header: () => <RightAlignedHeader>REVENUE</RightAlignedHeader>,
    accessor: 'salesVolume',
    width: 4,
  },
]

const tableEmptyState = {
  title: 'No channels found',
  description: 'No top earning channels with minted token have been found.',
  icon: <SvgEmptyStateIllustration />,
}

export const TopEarningChannels = ({ withCrtOnly }: { withCrtOnly?: boolean }) => {
  const { channels, loading } = useBasicChannels({
    limit: 10,
    orderBy: [ChannelOrderByInput.CumulativeRevenueDesc],
    where: {
      cumulativeRevenue_gt: '0',
      ...(withCrtOnly ? { creatorToken_isNull: false } : {}),
    },
  })

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
          salesVolume: <SkeletonLoader width="100%" height={16} />,
        }))
      : channels?.map((data, index) => ({
          index: (
            <Text variant="t100" as="p" color="colorTextMuted">
              {index + 1}
            </Text>
          ),
          salesVolume: (
            <JoyAmountWrapper>
              <NumberFormat
                icon={<JoyTokenIcon variant="gray" />}
                variant="t200-strong"
                as="p"
                value={new BN(data.cumulativeRevenue)}
                margin={{ left: 1 }}
                format="short"
                withDenomination
                denominationAlign="right"
              />
            </JoyAmountWrapper>
          ),
          channel: <Channel channel={data} />,
        })) ?? []
  }, [channels, loading])

  if (!loading && !channels) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: `Top earning channels`,
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
            minWidth={400}
            emptyState={tableEmptyState}
            columns={COLUMNS}
            data={mappedData}
            doubleColumn={lgMatch}
          />,
        ],
      }}
    />
  )
}

const Channel = ({ channel }: { channel: BasicChannelFieldsFragment }) => {
  const hasCreatorToken = !!channel.creatorToken?.token.id
  // todo to be implemented
  const verified = false
  return (
    <StyledLink to={absoluteRoutes.viewer.channel(channel.id)} title={channel.title || ''}>
      <StyledListItem
        nodeStart={<Avatar assetUrls={channel.avatarPhoto?.resolvedUrls ?? undefined} />}
        label={channel.title}
        isInteractive={false}
        nodeEnd={
          <SenderItemIconsWrapper>
            {hasCreatorToken && (
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
