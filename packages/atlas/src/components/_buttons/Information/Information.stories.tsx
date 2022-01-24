import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Information, InformationProps } from '.'

export default {
  title: 'button/Information',
  component: Information,
  args: {
    tooltip: {
      headerText: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
    },
  },
} as Meta

const Template: Story<InformationProps> = (args) => <Information {...args} />

export const Default = Template.bind({})
