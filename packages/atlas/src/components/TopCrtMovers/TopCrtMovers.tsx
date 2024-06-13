import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { CreatorTokenOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetBasicCreatorTokensQuery } from '@/api/queries/__generated__/creatorTokens.generated'
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

import { PercentageChangeIndicator } from '../PercentageChangeIndicator'
import {
  JoyAmountWrapper,
  SkeletonChannelContainer,
  StyledTable,
} from '../TopSellingChannelsTable/TopSellingChannelsTable.styles'
import { TokenInfo } from '../_crt/CrtPortfolioTable'

const COLUMNS: TableProps['columns'] = [
  {
    Header: '',
    accessor: 'index',
    width: 1,
  },
  {
    Header: 'TOKEN',
    accessor: 'token',
    width: 5,
  },
  {
    Header: () => <RightAlignedHeader>PRICE % 7D</RightAlignedHeader>,
    accessor: 'weeklyPriceChange',
    width: 4,
  },
  {
    Header: () => <RightAlignedHeader>PRICE</RightAlignedHeader>,
    accessor: 'price',
    width: 4,
  },
]

const tableEmptyState = {
  title: 'No tokens found',
  description: 'No top moves have been found.',
  icon: <SvgEmptyStateIllustration />,
}

export const TopMovingTokens = () => {
  const { data, loading } = useGetBasicCreatorTokensQuery({
    variables: {
      limit: 10,
      orderBy: [CreatorTokenOrderByInput.TotalSupplyDesc],
      where: {},
    },
  })
  const { creatorTokens } = data ?? {}

  const lgMatch = useMediaMatch('lg')
  const mappedData = useMemo(() => {
    return loading
      ? Array.from({ length: 10 }, () => ({
          index: null,
          token: (
            <SkeletonChannelContainer>
              <SkeletonLoader width={32} height={32} rounded />
              <SkeletonLoader width="30%" height={20} />
            </SkeletonChannelContainer>
          ),
          weeklyPriceChange: <SkeletonLoader width="100%" height={16} />,
          price: <SkeletonLoader width="100%" height={16} />,
          channelId: null,
        }))
      : creatorTokens?.map((data, index) => ({
          index: (
            <IndexText variant="t100" as="p" color="colorTextMuted">
              #{index + 1}{' '}
            </IndexText>
          ),
          price: (
            <JoyAmountWrapper>
              <NumberFormat
                icon={<JoyTokenIcon variant="gray" />}
                variant="t200-strong"
                as="p"
                value={new BN(data.lastPrice ?? 0)}
                margin={{ left: 1 }}
                format="short"
                withDenomination
                denominationAlign="right"
              />
            </JoyAmountWrapper>
          ),
          weeklyPriceChange: (
            <JoyAmountWrapper>
              <PercentageChangeIndicator value={100} />
            </JoyAmountWrapper>
          ),
          token: (
            <TokenInfo
              channelId={data.channel?.channel.id ?? ''}
              tokenName={data.symbol ?? ''}
              isVerified={false}
              tokenTitle={data.symbol ?? ''}
            />
          ),
          channelId: data.channel?.channel.id,
        })) ?? []
  }, [creatorTokens, loading])

  if (!loading && !creatorTokens) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: `Top moving channels`,
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
            minWidth={350}
            emptyState={tableEmptyState}
            columns={COLUMNS}
            data={mappedData}
            doubleColumn={lgMatch}
            getRowTo={(idx) => absoluteRoutes.viewer.channel(mappedData[idx].channelId ?? '', { tab: 'Token' })}
            interactive
          />,
        ],
      }}
    />
  )
}

const IndexText = styled(Text)`
  margin-left: -4px;
`
