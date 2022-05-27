import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { Tabs, TabsProps } from './Tabs'

const badgeTabs = [
  { name: 'one', badgeNumber: 1 },
  { name: 'two', badgeNumber: 2 },
  { name: 'three', badgeNumber: 3 },
  { name: 'four', badgeNumber: 4 },
  { name: 'five', badgeNumber: 5 },
  { name: 'six', badgeNumber: 6 },
  { name: 'seven', badgeNumber: 7 },
  { name: 'eight', badgeNumber: 8 },
]
const pillTabs = [
  { name: 'one', pillText: 1 },
  { name: 'two', pillText: 2 },
  { name: 'three', pillText: 3 },
  { name: 'four', pillText: 4 },
  { name: 'five', pillText: 5 },
  { name: 'six', pillText: 6 },
  { name: 'seven', pillText: 7 },
  { name: 'eight', pillText: 8 },
]

export default {
  title: 'other/Tabs',
  component: Tabs,
  args: {
    underline: true,
  },
  argTypes: {
    onSelectTab: {
      table: { disable: true },
    },
    tabs: {
      table: { disable: true },
    },
    initialIndex: {
      table: { disable: true },
    },
    selected: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} as Meta

const Template: Story<TabsProps> = (args) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)

  return (
    <Container>
      <Tabs {...args} onSelectTab={setSelectedTabIdx} selected={selectedTabIdx} tabs={badgeTabs} />
      <Tabs {...args} onSelectTab={setSelectedTabIdx} selected={selectedTabIdx} tabs={pillTabs} />
      <Tabs
        {...args}
        onSelectTab={setSelectedTabIdx}
        selected={selectedTabIdx}
        tabs={pillTabs.map((tab) => ({ name: tab.name }))}
      />
    </Container>
  )
}
export const Default = Template.bind({})

export const Container = styled.div`
  width: 300px;
  gap: 64px;
`
