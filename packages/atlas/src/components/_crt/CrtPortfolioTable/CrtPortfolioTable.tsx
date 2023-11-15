import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

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
import { ContextMenu } from '@/components/_overlays/ContextMenu'

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
  status: 'market' | 'sale' | 'idle'
  vested: number
  total: number
  transferable: number
}

export type CrtPortfolioTableProps = {
  data: PortfolioToken[]
  isLoading: boolean
}

export const CrtPortfolioTable = ({ data }: CrtPortfolioTableProps) => {
  const mappingData = useMemo(() => {
    return data.map((row) => ({
      token: <TokenInfo {...row} />,
      status: <Status status={row.status} />,
      transferable: (
        <RightAlignedCell>
          <NumberFormat value={row.transferable} as="p" withToken customTicker="$JBC" />
        </RightAlignedCell>
      ),
      vested: (
        <RightAlignedCell>
          <NumberFormat value={row.vested} as="p" withToken customTicker="$JBC" />
        </RightAlignedCell>
      ),
      total: (
        <RightAlignedCell>
          <NumberFormat value={row.total} as="p" withToken customTicker="$JBC" />
        </RightAlignedCell>
      ),
      utils: <TokenPortfolioUtils onTransfer={() => undefined} onBuy={() => undefined} />,
    }))
  }, [data])

  return <StyledTable columns={COLUMNS} data={mappingData} />
}

export const TokenInfo = ({
  tokenTitle,
  tokenName,
  isVerified,
}: Pick<PortfolioToken, 'tokenName' | 'tokenTitle' | 'isVerified'>) => {
  return (
    <FlexBox alignItems="center" gap={2}>
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

const Status = ({ status }: { status: 'market' | 'sale' | 'idle' }) => {
  const [icon, text] = useMemo(() => {
    switch (status) {
      case 'market':
        return [<SvgActionMarket key={1} />, 'On market']
      case 'sale':
        return [<SvgActionBuyNow key={1} />, 'On sale']
      case 'idle':
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
}

export const TokenPortfolioUtils = ({ onBuy, onTransfer }: TokenPortfolioUtilsProps) => {
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
          },
          {
            asButton: true,
            label: 'Transfer',
            onClick: onTransfer,
            nodeStart: <SvgActionTransfer />,
          },
        ]}
        trigger={null}
        triggerTarget={ref}
      />
    </RightAlignedCell>
  )
}

const StyledTable = styled(Table)`
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
