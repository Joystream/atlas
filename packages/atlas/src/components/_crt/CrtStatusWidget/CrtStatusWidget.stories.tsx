import { Meta } from '@storybook/react'

import { CrtStatusWidgetProps, CrtStatusWidget as _CrtStatusWidget } from './CrtStatusWidget'

export default {
  title: 'crt/CrtStatusWidget',
  component: _CrtStatusWidget,
  args: {
    name: 'CRT',
    creationDate: new Date(),
    supply: 20_000_000,
    marketCap: 2_222_000,
    revenue: 234_000,
    revenueShare: 200_000,
    transactionVolume: 2_222_222,
  },
} as Meta<CrtStatusWidgetProps>

export const CrtStatusWidget = {}
