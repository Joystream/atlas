import { Meta, Story } from '@storybook/react'
import BN from 'bn.js'

import { JoystreamProvider } from '@/providers/joystream/joystream.provider'

import { TablePaymentsHistory, TablePaymentsHistoryProps } from './TablePaymentsHistory'

const data = {
  date: new Date(2021, 1, 1),
  type: 'nft-sale',
  amount: new BN(-100000000000),
  channelBalance: new BN(200000000000),
}

export default {
  title: 'Other/TablePayments',
  component: TablePaymentsHistory,
  argTypes: {
    data: { table: { disable: true } },
  },
  args: {
    data: new Array(100).fill(data),
  },
} as Meta<TablePaymentsHistoryProps>

const Template: Story<TablePaymentsHistoryProps> = (args) => (
  <div style={{ paddingBottom: '50px' }}>
    <JoystreamProvider>
      <TablePaymentsHistory {...args} />
    </JoystreamProvider>
  </div>
)

export const Default = Template.bind({})
