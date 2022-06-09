import { Meta, Story } from '@storybook/react'

import { OutputPill, OutputPillProps } from '.'

export default {
  title: 'Other/OutputPill',
  component: OutputPill,
  args: {
    avatarUri: 'https://placedog.net/100/100',
    handle: 'Member',
    withAvatar: true,
    hasOnDeleteClick: false,
    readonly: false,
  },
  argTypes: {
    className: { table: { disable: true } },
    onDeleteClick: { table: { disable: true } },
  },
} as Meta<OutputPillProps>

const Template: Story<OutputPillProps & { hasOnDeleteClick: boolean }> = (args) => <OutputPill {...args} />
export const Default = Template.bind({})
