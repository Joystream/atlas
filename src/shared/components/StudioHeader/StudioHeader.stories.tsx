import { Meta, Story } from '@storybook/react'
import React from 'react'
import StudioHeader, { StudioHeaderProps } from './StudioHeader'

export default {
  title: 'Shared/StudioHeader',
  component: StudioHeader,
  argTypes: {
    title: {
      defaultValue: 'Select your Channel',
    },
    subTitle: {
      defaultValue:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum expedita consequatur molestias dolorem laboriosam possimus corporis sequi nisi fugit voluptatum.',
    },
  },
} as Meta

const Template: Story<StudioHeaderProps> = (args) => <StudioHeader {...args} />

export const Default = Template.bind({})
