import styled from '@emotion/styled'

import { Table, TableProps } from '@/components/Table'
import { cVar } from '@/styles'

const COLUMNS: TableProps['columns'] = [
  {
    Header: '',
    accessor: 'index',
    width: 200,
  },
  {
    Header: 'CHANNEL',
    accessor: 'channel',
    width: 200,
  },
  {
    Header: 'NFTS SOLD',
    accessor: 'nftsSold',
    width: 232300,
  },
  {
    Header: 'SALES VOLUME',
    accessor: 'salesVolume',
    width: 100,
  },
]

const StyledTable = styled(Table)`
  background: transparent;

  .table-base {
    border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')}!important;
  }

  .table-row {
    background-color: transparent;
  }

  .table-header {
    box-shadow: 0 1px 0 0 ${cVar('colorBorderMutedAlpha')};
    background-color: transparent;
  }
`

export const TopSellingChannelsTable = () => {
  return (
    <StyledTable
      columns={COLUMNS}
      data={[
        { index: 1, channel: 'Radek', nftsSold: 1, salesVolume: 22 },
        { index: 1, channel: 'Radek', nftsSold: 1, salesVolume: 22 },
        { index: 1, channel: 'Radek', nftsSold: 1, salesVolume: 22 },
      ]}
    />
  )
}
