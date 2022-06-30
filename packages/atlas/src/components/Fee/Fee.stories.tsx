import { Meta, Story } from '@storybook/react'

import { Fee, FeeProps } from './Fee'

export default {
  title: 'other/Fee',
  component: Fee,
  argTypes: {
    className: { table: { disable: true } },
    variant: { table: { disable: true } },
    color: { table: { disable: true } },
  },
  args: {
    variant: 'h500',
    amount: 0,
    loading: false,
    hideOnMobile: false,
  },
} as Meta<FeeProps>

const Template: Story<FeeProps> = (args) => <Fee {...args} />

export const Default = Template.bind({})
