import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ListItem, ListItemProps } from './ListItem'

import { SvgActionChevronR, SvgActionExclamation } from '../_icons'

export default {
  title: 'Other/ListItem',
  component: ListItem,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      defaultValue: 'medium',
    },
    captionPosition: {
      control: { type: 'select', options: ['bottom', 'right'] },
      defaultValue: 'bottom',
    },
  },
  args: {
    label: 'ListItem label',
    caption: 'This is a caption',
    selected: false,
    disabled: false,
    destructive: false,
  },
} as Meta

const Template: Story<ListItemProps> = (args) => (
  <Container>
    <ListItem {...args} />
    <ListItem {...args} />
    <ListItem {...args} />
  </Container>
)

export const Default = Template.bind({})

export const IconStart = Template.bind({})
IconStart.args = {
  nodeStart: <SvgActionExclamation />,
}
export const IconEnd = Template.bind({})
IconEnd.args = {
  nodeEnd: <SvgActionChevronR />,
}
export const IconStartEnd = Template.bind({})
IconStartEnd.args = {
  nodeStart: <SvgActionExclamation />,
  nodeEnd: <SvgActionChevronR />,
}

const Container = styled.div`
  background-color: #181c20;
  width: 280px;
`
