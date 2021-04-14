import { Meta, Story } from '@storybook/react'
import React from 'react'
import HelperText, { HelperTextProps } from './HelperText'

export default {
  title: 'Shared/HelperText',
  component: HelperText,
  argTypes: {
    helperText: { defaultValue: 'some helper text' },
  },
} as Meta

const Template: Story<HelperTextProps> = (args) => <HelperText {...args} />

export const Default = Template.bind({})
