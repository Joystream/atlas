import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { ListItem, ListItemProps } from './ListItem'

import { SvgActionChevronR, SvgActionExclamation } from '../../assets/icons'

export default {
  title: 'Other/ListItem',
  component: ListItem,
  args: {
    label: 'ListItem label',
    caption: 'This is a caption',
    selected: false,
    disabled: false,
    destructive: false,
  },
} as Meta

const Template: StoryFn<ListItemProps> = (args) => (
  <Container>
    <ListItem {...args} />
    <ListItem {...args} />
    <ListItem {...args} />
  </Container>
)

const TemplateSingle: StoryFn<ListItemProps> = (args) => (
  <Container>
    <ListItem {...args} />
  </Container>
)

export const Default = Template.bind({})

export const Single = TemplateSingle.bind({})

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
