import { Meta, Story } from '@storybook/react'

import { ContentCard, ContentCardProps } from './ContentCard'

export default {
  title: 'other/ContentCard',
  component: ContentCard,
  args: {
    pill: {
      label: 'Coming early 2022',
    },
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, quis.',
    subtitle: 'Hello subtitle',
    body: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores dolorem dolorum laboriosam facere quaerat est ad esse quo, id voluptatibus eius, maxime magnam placeat fugit explicabo sit, dolor sint expedita.',
    button: {
      children: 'Learn more',
    },
  },
} as Meta<ContentCardProps>

const Template: Story<ContentCardProps> = (args) => <ContentCard {...args} />

export const Default = Template.bind({})
