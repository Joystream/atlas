import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useBasicChannel } from '@/api/hooks/channel'
import { TokenStatus } from '@/api/queries/__generated__/baseTypes.generated'
import {
  SvgActionBuyNow,
  SvgActionLock,
  SvgActionMarket,
  SvgActionMore,
  SvgActionNotForSale,
  SvgActionSell,
  SvgActionShoppingCart,
  SvgActionTransfer,
  SvgActionVerified,
} from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { ColumnBox } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BuyMarketTokenModal } from '@/components/_crt/BuyMarketTokenModal'
import { SellTokenModal } from '@/components/_crt/SellTokenModal'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { absoluteRoutes } from '@/config/routes'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { usePagination } from '@/views/viewer/ChannelView/ChannelView.hooks'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  token: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  status: <SkeletonLoader height={20} width="40%" />,
  transferable: <SkeletonLoader height={20} width="40%" />,
  vested: <SkeletonLoader height={20} width="40%" />,
  total: <SkeletonLoader height={20} width="40%" />,
  utils: null,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Token', accessor: 'token', width: 150 },
  { Header: 'Status', accessor: 'status', width: 200 },
  { Header: 'Transferable', accessor: 'transferable', width: 100 },
  { Header: 'Vested', accessor: 'vested', width: 100 },
  { Header: 'Total', accessor: 'total', width: 100 },
  { Header: '', accessor: 'utils', width: 70 },
]

export type PortfolioToken = {
  tokenTitle: string
  tokenName: string
  isVerified: boolean
  status: TokenStatus
  vested: number
  total: number
  tokenId: string
  memberId: string
  channelId?: string
  hasStaked: boolean
}

export type CrtPortfolioTableProps = {
  data: PortfolioToken[]
  isLoading: boolean
  emptyState?: TableProps['emptyState']
}

export const CrtPortfolioTable = ({ data, emptyState, isLoading }: CrtPortfolioTableProps) => {
  const { currentPage, setCurrentPage } = usePagination(0)
  const [perPage, setPerPage] = useState(10)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [tokenId, setTokenId] = useState<string | null>(null)

  const mappingData = useMemo(() => {
    return [...data].slice(currentPage * perPage, currentPage * perPage + perPage).map((row) => ({
      token: <TokenInfo {...row} />,
      status: <CrtStatus status={row.status} />,
      transferable: (
        <FlexBox width="auto" alignItems="center" gap={1}>
          {row.hasStaked && <SvgActionLock />}
          <TransferableBalance memberId={row.memberId} tokenId={row.tokenId} ticker={`${row.tokenTitle}`} />
        </FlexBox>
      ),
      vested: (
        <FlexBox width="auto" alignItems="center" gap={1}>
          {row.hasStaked && <SvgActionLock />}
          <NumberFormat value={row.vested} as="p" withToken customTicker={`$${row.tokenTitle}`} />
        </FlexBox>
      ),
      total: (
        <FlexBox width="auto" alignItems="center" gap={1}>
          {row.hasStaked && <SvgActionLock />}
          <NumberFormat value={row.total} as="p" withToken customTicker={`$${row.tokenTitle}`} />
        </FlexBox>
      ),
      utils: (
        <TokenPortfolioUtils
          onTransfer={() => undefined}
          disableTransfer
          onBuy={() => {
            setTokenId(row.tokenId)
            setShowBuyModal(true)
          }}
          onSell={() => {
            setTokenId(row.tokenId)
            setShowSellModal(true)
          }}
          disableBuy={row.status !== TokenStatus.Market}
          disableSell={row.status !== TokenStatus.Market}
        />
      ),
    }))
  }, [currentPage, data, perPage])

  return (
    <>
      {tokenId && <BuyMarketTokenModal tokenId={tokenId} show={showBuyModal} onClose={() => setShowBuyModal(false)} />}
      {tokenId && <SellTokenModal tokenId={tokenId} show={showSellModal} onClose={() => setShowSellModal(false)} />}
      <StyledTable
        minWidth={730}
        isEmpty={!data.length}
        /*todo add pagination*/
        pageSize={data.length || undefined}
        columns={COLUMNS}
        data={isLoading ? tableLoadingData : mappingData}
        emptyState={emptyState}
        pagination={{
          setPerPage,
          totalCount: data.length,
          itemsPerPage: perPage,
          page: currentPage,
          onChangePage: setCurrentPage,
        }}
      />
    </>
  )
}

export const TokenInfo = ({
  tokenTitle,
  tokenName,
  isVerified,
  channelId,
}: Pick<PortfolioToken, 'tokenName' | 'tokenTitle' | 'isVerified' | 'channelId'>) => {
  const { channel } = useBasicChannel(channelId ?? '')
  const navigate = useNavigate()
  return (
    <FlexBox minWidth="100px" alignItems="center" gap={2}>
      <Avatar
        assetUrls={channel?.avatarPhoto?.resolvedUrls}
        onClick={() => (channelId ? navigate(absoluteRoutes.viewer.channel(channelId, { tab: 'Token' })) : undefined)}
      />
      <FlexBox flow="column" gap={0}>
        <Text variant="h200" as="h1">
          {tokenTitle}
        </Text>
        <FlexBox alignItems="center" gap={1}>
          <Text variant="t100" as="span" color="colorText">
            {tokenName}
          </Text>
          {isVerified && <SvgActionVerified />}
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export const CrtStatus = ({ status }: { status: TokenStatus }) => {
  const [icon, text] = useMemo(() => {
    switch (status) {
      case TokenStatus.Market:
        return [<SvgActionMarket key={1} />, 'On market']
      case TokenStatus.Sale:
        return [<SvgActionBuyNow key={1} />, 'On sale']
      case TokenStatus.Idle:
      default:
        return [<SvgActionNotForSale key={1} />, 'No active sale']
    }
  }, [status])
  return (
    <FlexBox alignItems="center" gap={2}>
      {icon}
      <Text variant="t100" as="p">
        {text}
      </Text>
    </FlexBox>
  )
}

type TokenPortfolioUtilsProps = {
  onBuy?: () => void
  onSell?: () => void
  onTransfer: () => void
  disableTransfer?: boolean
  disableBuy?: boolean
  disableSell?: boolean
}

export const TokenPortfolioUtils = ({
  onBuy,
  onTransfer,
  disableTransfer,
  disableBuy,
  disableSell,
  onSell,
}: TokenPortfolioUtilsProps) => {
  const [ref, setRef] = useState<HTMLButtonElement | null>(null)

  return (
    <RightAlignedCell>
      <Button ref={setRef} icon={<SvgActionMore />} variant="tertiary" size="small" />
      <ContextMenu
        appendTo={document.body}
        placement="bottom-end"
        items={[
          {
            asButton: true,
            label: 'Buy',
            onClick: onBuy,
            nodeStart: <SvgActionShoppingCart />,
            disabled: disableBuy,
          },
          {
            asButton: true,
            label: 'Transfer',
            onClick: onTransfer,
            nodeStart: <SvgActionTransfer />,
            disabled: disableTransfer,
          },
          {
            asButton: true,
            label: 'Sell',
            onClick: onSell,
            nodeStart: <SvgActionSell />,
            disabled: disableSell,
          },
        ]}
        trigger={null}
        triggerTarget={ref}
      />
    </RightAlignedCell>
  )
}

export const TransferableBalance = ({
  memberId,
  tokenId,
  ticker,
}: {
  memberId: string
  tokenId: string
  ticker?: string
}) => {
  const { tokenBalance } = useGetTokenBalance(tokenId, memberId)
  return <NumberFormat value={tokenBalance} as="p" withToken customTicker={`$${ticker}`} />
}

const StyledTable = styled(Table)<{ isEmpty?: boolean }>`
  width: 100%;
  background-color: ${({ isEmpty }) => (isEmpty ? 'transparent' : '')};

  th:nth-child(n + 3),
  th:nth-child(n + 4),
  th:nth-child(n + 5) {
    align-items: end;
    justify-content: end;

    > div {
      align-items: end;
    }
  }

  td:nth-child(n + 3),
  td:nth-child(n + 4),
  td:nth-child(n + 5) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`

export const RightAlignedCell = styled.div`
  margin-left: auto;
`
