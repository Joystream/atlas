import { Meta, StoryFn } from '@storybook/react'

import { SvgActionCreatorToken } from '@/assets/icons'
import { InfoStartCard, InfoStartCardProps } from '@/components/InfoStartCard/InfoStartCard'

export default {
  title: 'common/InfoStartCard',
  component: InfoStartCard,
} as Meta<InfoStartCardProps>

const Template: StoryFn<InfoStartCardProps> = (args) => <InfoStartCard {...args} />

export const Default = Template.bind({})
Default.args = {
  text: 'Your earnings will be transferred to your channel wallet after the sale ends or when you close it manually.',
  icon: <SvgActionCreatorToken />,
}

export const Warning = Template.bind({})
Warning.args = {
  variant: 'warning',
  text: 'Your earnings will be transferred to your channel wallet after the sale ends or when you close it manually.',
  icon: <SvgActionCreatorToken />,
}
