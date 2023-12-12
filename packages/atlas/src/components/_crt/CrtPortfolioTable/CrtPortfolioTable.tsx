import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

import { TokenStatus } from '@/api/queries/__generated__/baseTypes.generated'
import {
  SvgActionBuyNow,
  SvgActionMarket,
  SvgActionMore,
  SvgActionNotForSale,
  SvgActionShoppingCart,
  SvgActionTransfer,
  SvgActionVerified,
} from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BuyMarketTokenModal } from '@/components/_crt/BuyMarketTokenModal'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'

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
  channelId: string
}

export type CrtPortfolioTableProps = {
  data: PortfolioToken[]
  isLoading: boolean
  emptyState?: TableProps['emptyState']
}

export const CrtPortfolioTable = ({ data, emptyState }: CrtPortfolioTableProps) => {
  const [showModal, setShowModal] = useState(false)
  const [tokenId, setTokenId] = useState<string | null>(null)

  const mappingData = useMemo(() => {
    return data.map((row) => ({
      token: <TokenInfo {...row} />,
      status: <Status status={row.status} />,
      transferable: (
        <RightAlignedCell>
          <TransferableBalance memberId={row.memberId} tokenId={row.tokenId} ticker={`${row.tokenTitle}`} />
        </RightAlignedCell>
      ),
      vested: (
        <RightAlignedCell>
          <NumberFormat value={row.vested} as="p" withToken customTicker={`$${row.tokenTitle}`} />
        </RightAlignedCell>
      ),
      total: (
        <RightAlignedCell>
          <NumberFormat value={row.total} as="p" withToken customTicker={`$${row.tokenTitle}`} />
        </RightAlignedCell>
      ),
      utils: (
        <TokenPortfolioUtils
          onTransfer={() => undefined}
          disableTransfer
          onBuy={() => {
            setTokenId(row.tokenId)
            setShowModal(true)
          }}
          disableBuy={row.status === TokenStatus.Idle}
        />
      ),
    }))
  }, [data])

  return (
    <>
      {tokenId && <BuyMarketTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />}
      <StyledTable
        minWidth={730}
        isEmpty={!mappingData.length}
        columns={COLUMNS}
        data={mappingData}
        emptyState={emptyState}
      />
    </>
  )
}

export const TokenInfo = ({
  tokenTitle,
  tokenName,
  isVerified,
}: Pick<PortfolioToken, 'tokenName' | 'tokenTitle' | 'isVerified'>) => {
  return (
    <FlexBox minWidth="100px" alignItems="center" gap={2}>
      <Avatar />
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

const Status = ({ status }: { status: TokenStatus }) => {
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
  onTransfer: () => void
  disableTransfer?: boolean
  disableBuy?: boolean
}

export const TokenPortfolioUtils = ({ onBuy, onTransfer, disableTransfer, disableBuy }: TokenPortfolioUtilsProps) => {
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
        ]}
        trigger={null}
        triggerTarget={ref}
      />
    </RightAlignedCell>
  )
}

const TransferableBalance = ({ memberId, tokenId, ticker }: { memberId: string; tokenId: string; ticker?: string }) => {
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
`

export const RightAlignedCell = styled.div`
  margin-left: auto;
`
