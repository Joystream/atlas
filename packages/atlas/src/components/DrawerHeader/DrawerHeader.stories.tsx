import { Meta, StoryFn } from '@storybook/react'

import { DrawerHeader, DrawerHeaderProps } from './DrawerHeader'

export default {
  title: 'Other/DrawerHeader',
  component: DrawerHeader,
  argTypes: {
    onCloseClick: { table: { disable: true } },
  },
  args: {
    label: 'New',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    onCloseClick: () => null,
  },
} as Meta

const Template: StoryFn<DrawerHeaderProps> = (args) => <DrawerHeader {...args} />

export const Default = Template.bind({})
