import { Meta, Story } from '@storybook/react'

import { MemberBadge, MemberBadgeProps } from '.'

export default {
  title: 'Other/MemberBadge',
  component: MemberBadge,
  args: {
    avatarUri: 'https://placedog.net/100/100',
    handle: 'Member',
  },
  argTypes: {
    className: { table: { disable: true } },
    onDeleteClick: { table: { disable: true } },
  },
} as Meta

const Template: Story<MemberBadgeProps> = (args) => <MemberBadge {...args} />
export const Default = Template.bind({})
