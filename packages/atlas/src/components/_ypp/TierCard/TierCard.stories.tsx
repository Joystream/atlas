import { Meta, StoryFn } from '@storybook/react'

import { TierCard, TierCardProps } from '@/components/_ypp/TierCard/TierCard'

export default {
  title: 'ypp/TierCard',
  component: TierCard,
} as Meta<TierCardProps>

const Template: StoryFn<TierCardProps> = (args) => <TierCard {...args} />

export const Default = Template.bind({})
Default.args = {
  rewards: [100, 200, 300],
  checks: ['Join us!', 'Growing subscriber base of channel supporters.'],
}
