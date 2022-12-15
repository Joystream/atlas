import { Meta, StoryFn } from '@storybook/react'

import { Information, InformationProps } from '.'

export default {
  title: 'other/Information',
  component: Information,
  args: {
    placement: 'top',
    headerText: 'Lorem Ipsum',
    text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
} as Meta<InformationProps>

const Template: StoryFn<InformationProps> = (args) => (
  <div style={{ marginTop: '90px' }}>
    <Information {...args} />
  </div>
)

export const Default = Template.bind({})
