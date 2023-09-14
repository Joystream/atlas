import { Meta, StoryFn } from '@storybook/react'

import { MarketWidget, MarketWidgetProps } from '@/components/_crt/MarketWidget/MarketWidget'

export default {
  title: 'crt/MarketWidget',
  component: MarketWidget,
  args: {
    amountSoldOnMarket: 1000,
    pricePerUnit: 100,
    amountBoughtOnMarket: 100,
  },
} as Meta<MarketWidgetProps>

export const Def: StoryFn<MarketWidgetProps> = (args) => <MarketWidget {...args} />
