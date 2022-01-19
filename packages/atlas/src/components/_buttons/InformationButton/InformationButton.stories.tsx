import { Meta, Story } from '@storybook/react'
import React from 'react'

import { InformationButton, InformationButtonProps } from '.'

export default {
  title: 'button/InformationButton',
  component: InformationButton,
  args: {
    tooltip: {
      headerText: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
    },
  },
} as Meta

const Template: Story<InformationButtonProps> = (args) => <InformationButton {...args} />

export const Default = Template.bind({})
