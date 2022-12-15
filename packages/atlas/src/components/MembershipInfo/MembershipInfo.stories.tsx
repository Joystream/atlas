import { Meta, StoryFn } from '@storybook/react'

import { MembershipInfo, MembershipInfoProps } from './'

export default {
  title: 'other/MembershipInfo',
  component: MembershipInfo,
  args: {
    address: '5CrLvuj3zAVYNYSUSiScr5gH9sLrcgME4oKjQf4xu1Zj5B7e',
    avatarUrl: 'https://thispersondoesnotexist.com/image',
    handle: 'doesnotexist',
    loading: false,
    isOwner: false,
  },
} as Meta

const Template: StoryFn<MembershipInfoProps> = (args) => <MembershipInfo {...args} />

export const Default = Template.bind({})
