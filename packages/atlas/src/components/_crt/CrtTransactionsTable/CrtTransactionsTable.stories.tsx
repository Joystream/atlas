import { Meta } from '@storybook/react'

import { CrtTransactionsTableProps, CrtTransactionsTable as _CrtTransactionsTable } from './CrtTransactionsTable'

const member = () => ({
  address: '5CrLvuj3zAVYNYSUSiScr5gH9sLrcgME4oKjQf4xu1Zj5B7e',
  avatarUrls: [`https://api.dicebear.com/6.x/micah/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${Math.random()}`],
  handle: 'doesnotexist',
  loading: false,
})

export default {
  title: 'crt/CrtTransactionsTable',
  component: _CrtTransactionsTable,
  args: {
    ticker: '$JBC',
    transactions: [
      { date: new Date(), member: member(), action: 'bought', price: 98, qty: 50, amount: 4_900 },
      { date: new Date(), member: member(), action: 'sold', price: 100, qty: 2, amount: 200 },
    ],
  },
} as Meta<CrtTransactionsTableProps>

export const CrtTransactionsTable = {}
