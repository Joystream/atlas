import { Meta, Story } from '@storybook/react'

import { Table, TableProps } from './Table'

const MOCKED_DATA: TableProps['data'] = [
  {
    column1: new Date().getDate(),
    column2: 'NFT Sale',
    column3: 10000,
    column4: 132334,
  },
  {
    column1: new Date().getDate(),
    column2: 'NFT Sale',
    column3: 22222,
    column4: 999999,
  },
]

const MOCKED_COLUMNS: TableProps['columns'] = [
  {
    Header: 'Date',
    accessor: 'column1',
  },
  {
    Header: 'Type',
    accessor: 'column2',
  },
  {
    Header: 'Amount',
    accessor: 'column3',
  },
  {
    Header: 'Channel balance',
    accessor: 'column4',
  },
]

export default {
  title: 'Other/Table',
  component: Table,
  argTypes: {
    columns: { table: { disable: true } },
    data: { table: { disable: true } },
  },
  args: {
    columns: MOCKED_COLUMNS,
    data: MOCKED_DATA,
  },
} as Meta<TableProps>

const Template: Story<TableProps> = (args) => <Table {...args} />

export const Default = Template.bind({})
export const Double = Template.bind({})
Double.args = {
  doubleColumn: true,
}
