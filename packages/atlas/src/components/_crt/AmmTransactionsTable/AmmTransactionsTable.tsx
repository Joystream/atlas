import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { FullAmmCurveFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, LoadingMemberRow, TokenAmount } from '@/components/Table/Table.cells'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Date', accessor: 'date' },
  { Header: 'Member', accessor: 'member' },
  { Header: 'Action', accessor: 'action' },
  { Header: 'Price per unit', accessor: 'pricePerUnit' },
  { Header: 'Quantity', accessor: 'quantity' },
  { Header: 'Amount', accessor: 'amount' },
]

type AmmTransactionsTableProps = {
  data: FullAmmCurveFragment['transactions']
}

export const AmmTransactionsTable = ({ data }: AmmTransactionsTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        date: <DateBlockCell type="block" block={row.createdIn} />,
        member: <LoadingMemberRow memberId={row.account.member.id} />,
        action: (
          <Pill
            label={row.transactionType === 'BUY' ? 'Bought' : 'Sold'}
            icon={row.transactionType === 'BUY' ? <SvgActionArrowTop /> : <SvgActionArrowBottom />}
          />
        ),
        pricePerUnit: <TokenAmount tokenAmount={new BN(row.pricePerUnit)} />,
        quantity: <NumberFormat value={+row.quantity} as="p" withToken customTicker="$JBC" variant="t100-strong" />,
        amount: <TokenAmount tokenAmount={new BN(row.pricePaid)} />,
      })),
    [data]
  )

  return <StyledTable title="Market transactions" data={mappedData ?? []} columns={COLUMNS} />
}

const StyledTable = styled(Table)`
  th:not(:nth-of-type(1)):not(:nth-of-type(2)) {
    justify-content: end;
  }

  td:not(:nth-of-type(1)):not(:nth-of-type(2)) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
