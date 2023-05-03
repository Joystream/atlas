import BN from 'bn.js'
import { useMemo } from 'react'

import {
  GetTopSellingChannelsQuery,
  useGetTopSellingChannelsQuery,
} from '@/api/queries/__generated__/channels.generated'
import { SvgActionCreatorToken, SvgActionVerified } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  JoyAmountWrapper,
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
    width: 20,
  },
  {
    Header: 'CHANNEL',
    accessor: 'channel',
    width: 200,
  },
  {
    Header: 'NFTS SOLD',
    accessor: 'nftsSold',
    width: 70,
  },
  {
    Header: 'SALES VOLUME',
    accessor: 'salesVolume',
    width: 70,
  },
]

export const TopSellingChannelsTable = () => {
  const { data, loading } = useGetTopSellingChannelsQuery({
    variables: {
      limit: 10,
      periodDays: 7,
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
                <NumberFormat variant="t200-strong" as="p" value={new BN(data.amount)} margin={{ left: 1 }} />
              </JoyAmountWrapper>
            ),
            nftsSold: (
              <Text variant="t100" as="p">
                {data.nftSold}
              </Text>
            ),
            channel: <Channel channel={data.channel} />,
          })) ?? [],
    [data?.topSellingChannels, loading]
  )
  return <StyledTable columns={COLUMNS} data={mappedData} doubleColumn={mdMatch} />
}

const Channel = ({ channel }: { channel: GetTopSellingChannelsQuery['topSellingChannels'][number]['channel'] }) => {
  return (
    <StyledLink to={absoluteRoutes.viewer.member(channel.ownerMember?.handle)}>
      <SenderItem
        nodeStart={<Avatar assetUrl={channel.avatarPhoto?.resolvedUrl ?? undefined} />}
        label={channel.ownerMember?.handle}
        isInteractive={false}
        nodeEnd={
          <SenderItemIconsWrapper>
            <SvgActionCreatorToken />
            <SvgActionVerified />
          </SenderItemIconsWrapper>
        }
      />
    </StyledLink>
  )
}
