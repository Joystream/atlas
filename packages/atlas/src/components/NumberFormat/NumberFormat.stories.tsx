import { Meta, StoryFn } from '@storybook/react'

import { tokenNumberToHapiBn } from '@/joystream-lib/utils'

import { NumberFormat, NumberFormatProps } from './NumberFormat'

export default {
  title: 'other/NumberFormat',
  component: NumberFormat,
  args: {
    value: 102930,
    format: 'dollar',
    variant: 't100-strong',
  },
} as Meta<NumberFormatProps>

const Template: StoryFn<Omit<NumberFormatProps, 'ref'>> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '200px' }}>
    <NumberFormat {...args} value={tokenNumberToHapiBn(args.value as number)} withToken />
    <NumberFormat {...args} value={args.value as number} withToken={false} />
    <NumberFormat {...args} format="full" value={args.value as number} withToken withDenomination customTicker="$JBC" />
    <NumberFormat
      {...args}
      format="full"
      value={args.value as number}
      withToken
      withDenomination
      customTicker="$JBC"
      denominationMultiplier={10}
    />
  </div>
)

export const Regular = Template.bind({})
