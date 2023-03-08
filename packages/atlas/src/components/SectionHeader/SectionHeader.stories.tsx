import { Meta, StoryFn } from '@storybook/react'

import { SectionHeader, SectionHeaderProps } from './SectionHeader'

const TABS = [
  {
    name: 'Videos',
  },
  {
    name: 'NFTs',
  },
  {
    name: 'Token',
  },
  {
    name: 'Information',
  },
  {
    name: 'About',
  },
]

export default {
  title: 'other/SectionHeader',
  component: SectionHeader,
  args: {
    start: {
      type: 'title',
      title: 'Videos',
    },
  },
} as Meta<SectionHeaderProps>

const DefaultTemplate: StoryFn<SectionHeaderProps> = (args) => {
  return <SectionHeader {...args} />
}

export const Default = DefaultTemplate.bind({})
Default.args = {}

export const WithTabs = DefaultTemplate.bind({})

WithTabs.args = {
  start: {
    type: 'tabs',
    tabsProps: {
      tabs: TABS,
      onSelectTab: () => null,
      selected: 0,
    },
  },
}
