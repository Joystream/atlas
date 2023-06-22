import { Meta, StoryFn } from '@storybook/react'

import { OutputPill, OutputPillProps } from '.'

export default {
  title: 'Other/OutputPill',
  component: OutputPill,
  args: {
    avatarUri: ['https://placedog.net/100/100'],
    handle: 'Member',
    withAvatar: true,
    readonly: false,
  },
  argTypes: {
    onDeleteClick: { table: { disable: true } },
  },
} as Meta<OutputPillProps>

const Template: StoryFn<OutputPillProps & { hasOnDeleteClick: boolean }> = (args) => <OutputPill {...args} />
export const Default = Template.bind({})
